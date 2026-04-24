import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import {
  generateMnemonic,
  deriveAddress,
  deriveAuthKeyPair,
  getDerivationPath,
  parseDerivationPath
} from '@/utils/crypto';
import { encrypt, decrypt, deriveKeyBytes, decryptWithKey, importKey } from '@/utils/encryption';
import { hasAddressActivity, fetchPepPrice } from '@/utils/api';
import { ensureAuth, clearAuth } from '@/utils/auth';
import { EXPLORERS, type ExplorerId, pepeExplorer } from '@/utils/explorer';
import { useLockoutStore } from './lockout';
import { useInscriptionStore } from './inscriptions';
import { useAccountStore } from './account';

export interface Account {
  address: string;
  path: string;
  label: string;
}

// ── Background worker messaging ────────────────────────────────────────────
async function setAutoLockAlarm(delayMinutes: number) {
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    try {
      await chrome.runtime.sendMessage({ type: 'set-auto-lock', delayMinutes });
    } catch {
      /* background worker unavailable */
    }
  }
}

async function clearAutoLockAlarm() {
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    try {
      await chrome.runtime.sendMessage({ type: 'clear-auto-lock' });
    } catch {
      /* background worker unavailable */
    }
  }
}

export const useWalletStore = defineStore('wallet', () => {
  const lockout = useLockoutStore();
  const inscriptionStore = useInscriptionStore();
  const accountStore = useAccountStore();

  // ── State ──
  const accounts = ref<Account[]>(JSON.parse(localStorage.getItem('peppool_accounts') || '[]'));
  const activeAccountIndex = ref<number>(
    parseInt(localStorage.getItem('peppool_active_account') || '0')
  );
  const encryptedMnemonic = ref<string | null>(localStorage.getItem('peppool_vault'));
  let sessionKey: CryptoKey | null = null;
  const hasSessionKey = ref(false);
  const isUnlocked = ref(false);
  const lockDuration = ref<number>(parseInt(localStorage.getItem('peppool_lock_duration') || '15'));
  const prices = ref({
    USD: Number(localStorage.getItem('peppool_price_usd')) || 0,
    EUR: Number(localStorage.getItem('peppool_price_eur')) || 0
  });
  const selectedCurrency = ref<'USD' | 'EUR'>(
    (localStorage.getItem('peppool_currency') as 'USD' | 'EUR') || 'USD'
  );
  const selectedExplorer = ref<ExplorerId>(
    (localStorage.getItem('peppool_explorer') as ExplorerId) || 'peppool'
  );

  let lockTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Computed ──
  const isCreated = computed(() => !!encryptedMnemonic.value);
  const isMnemonicLoaded = computed(() => hasSessionKey.value);
  const activeAccount = computed(() => accounts.value[activeAccountIndex.value] || null);
  const address = computed(() => activeAccount.value?.address || null);
  const balanceFiat = computed(
    () => accountStore.balance * (prices.value[selectedCurrency.value] || 0)
  );
  const currencySymbol = computed(() => (selectedCurrency.value === 'USD' ? '$' : '€'));

  // Initialize cached transactions
  if (address.value) {
    accountStore.loadCachedTransactions(address.value);
  }

  // ── Actions ──
  async function syncToChromeStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({
        peppool_accounts: JSON.stringify(accounts.value),
        peppool_active_account: activeAccountIndex.value.toString()
      });
    }
  }

  function setCurrency(currency: 'USD' | 'EUR') {
    selectedCurrency.value = currency;
    localStorage.setItem('peppool_currency', currency);
  }

  function setExplorer(explorer: ExplorerId) {
    selectedExplorer.value = explorer;
    localStorage.setItem('peppool_explorer', explorer);
  }

  function openExplorerTx(txid: string) {
    pepeExplorer.openTx(selectedExplorer.value, txid);
  }

  function openExplorerAddress(address: string) {
    pepeExplorer.openAddress(selectedExplorer.value, address);
  }

  function setLockDuration(minutes: number) {
    lockDuration.value = minutes;
    localStorage.setItem('peppool_lock_duration', minutes.toString());
    resetLockTimer();
  }

  async function checkSession() {
    await lockout.restore();
    if (typeof chrome === 'undefined' || !chrome.storage?.session) return false;

    const sessionData = await chrome.storage.session.get(['sessionStartTime', 'dataKey']);
    const sessionStart = sessionData.sessionStartTime as number | undefined;
    const hex = sessionData.dataKey as string | undefined;

    if (!sessionStart || !hex) return false;

    const elapsed = Date.now() - sessionStart;
    if (elapsed >= lockDuration.value * 60 * 1000) {
      await chrome.storage.session.remove(['sessionStartTime', 'dataKey']);
      return false;
    }

    try {
      const rawBytes = fromHex(hex);
      sessionKey = await importKey(rawBytes.buffer as ArrayBuffer, ['decrypt']);
      rawBytes.fill(0);
      hasSessionKey.value = true;
      isUnlocked.value = true;
    } catch {
      isUnlocked.value = false;
      return false;
    }

    resetLockTimer();
    return true;
  }

  async function resetLockTimer() {
    if (!isUnlocked.value) return;

    const durationMs = lockDuration.value * 60 * 1000;

    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      await chrome.storage.session.set({ sessionStartTime: Date.now() });
    }

    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = setTimeout(() => lock(), durationMs);
    await setAutoLockAlarm(lockDuration.value);
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function debouncedResetLockTimer() {
    if (!isUnlocked.value || debounceTimer) return;
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
    }, 1000);
    await resetLockTimer();
  }

  async function withMnemonic<T>(fn: (mnemonic: string) => T | Promise<T>): Promise<T> {
    if (!sessionKey || !encryptedMnemonic.value) {
      throw new Error('Wallet is locked');
    }
    const mnemonic = await decryptWithKey(encryptedMnemonic.value, sessionKey);
    return fn(mnemonic);
  }

  async function refreshAuth() {
    if (!sessionKey) return;
    try {
      await withMnemonic(async (mnemonic) => {
        const authKey = deriveAuthKeyPair(mnemonic);
        await ensureAuth(authKey.address, authKey.privateKey, authKey.compressed);
      });
    } catch {
      /* auth is best-effort — anonymous rate is the fallback */
    }
  }

  async function refreshBalance(force = false) {
    if (!address.value) return;
    try {
      await refreshAuth();
      const currentPrices = await fetchPepPrice();
      prices.value = currentPrices;
      localStorage.setItem('peppool_price_usd', currentPrices.USD.toString());
      localStorage.setItem('peppool_price_eur', currentPrices.EUR.toString());

      await accountStore.sync(address.value, force);
      await resetLockTimer();
    } catch (e) {
      console.error('Failed to refresh balance', e);
    }
  }

  async function createWallet(password: string) {
    const mnemonic = generateMnemonic();
    await importWallet(mnemonic, password);
  }

  function toHex(bytes: Uint8Array): string {
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  function fromHex(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
  }

  async function cacheKeyBytes(keyBytes: Uint8Array) {
    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      await chrome.storage.session.set({ dataKey: toHex(keyBytes) });
    }
    sessionKey = await importKey(keyBytes.buffer as ArrayBuffer, ['decrypt']);
    hasSessionKey.value = true;
    keyBytes.fill(0);
  }

  async function importWallet(mnemonic: string, password: string) {
    const walletAddress = deriveAddress(mnemonic, 0, 0);
    const encrypted = await encrypt(mnemonic, password);

    encryptedMnemonic.value = encrypted;
    await cacheKeyBytes(await deriveKeyBytes(password, encrypted));

    const initialAccount: Account = {
      address: walletAddress,
      path: getDerivationPath(0, 0),
      label: 'Account 1'
    };

    accounts.value = [initialAccount];
    activeAccountIndex.value = 0;
    isUnlocked.value = true;

    localStorage.setItem('peppool_vault', encrypted);
    localStorage.setItem('peppool_accounts', JSON.stringify(accounts.value));
    localStorage.setItem('peppool_active_account', '0');

    await syncToChromeStorage();

    await resetLockTimer();
    await lockout.reset();
    await refreshBalance(true);
    await discoverAccounts(mnemonic);
  }

  async function discoverAccounts(mnemonic: string) {
    let index = 1;
    const foundAccounts: Account[] = [];

    while (index < 20) {
      // BIP44 gap limit
      const addr = deriveAddress(mnemonic, index, 0);
      const active = await hasAddressActivity(addr);
      if (!active) break;

      foundAccounts.push({
        address: addr,
        path: getDerivationPath(index, 0),
        label: `Account ${index + 1}`
      });
      index++;
    }

    if (foundAccounts.length > 0) {
      accounts.value = [...accounts.value, ...foundAccounts];
      localStorage.setItem('peppool_accounts', JSON.stringify(accounts.value));
      await syncToChromeStorage();
    }
  }

  function verifyVaultIntegrity(mnemonic: string) {
    const primaryAddress = deriveAddress(mnemonic, 0, 0);

    if (accounts.value.length === 0) {
      if (address.value && address.value !== primaryAddress) throw new Error('Invalid vault');
      return;
    }

    const account0 = accounts.value.find((a) => parseDerivationPath(a.path).accountIndex === 0);
    if (!account0 || account0.address !== primaryAddress) throw new Error('Invalid vault');

    const active = activeAccount.value;
    if (active && active !== account0) {
      const { accountIndex, addressIndex } = parseDerivationPath(active.path);
      if (deriveAddress(mnemonic, accountIndex, addressIndex) !== active.address)
        throw new Error('Invalid vault');
    }
  }

  async function unlock(password: string): Promise<boolean> {
    if (lockout.checkLocked()) return false;
    if (!encryptedMnemonic.value) return false;

    try {
      const mnemonic = await decrypt(encryptedMnemonic.value, password);
      verifyVaultIntegrity(mnemonic);

      await cacheKeyBytes(await deriveKeyBytes(password, encryptedMnemonic.value));
      isUnlocked.value = true;
      await resetLockTimer();
      await lockout.reset();
      await refreshBalance(true);
      return true;
    } catch (e) {
      const { wipe } = await lockout.recordFailure();
      if (wipe) {
        await resetWallet();
      }
      return false;
    }
  }

  async function lock() {
    isUnlocked.value = false;
    sessionKey = null;
    hasSessionKey.value = false;
    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      await chrome.storage.session.remove(['sessionStartTime', 'dataKey']);
    }
    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = null;
    localStorage.removeItem('peppool_transactions');
    localStorage.removeItem('peppool_form_send');
    localStorage.removeItem('peppool_form_import');
    await clearAutoLockAlarm();
  }

  async function resetWallet() {
    accounts.value = [];
    activeAccountIndex.value = 0;
    encryptedMnemonic.value = null;
    sessionKey = null;
    hasSessionKey.value = false;
    isUnlocked.value = false;
    prices.value = { USD: 0, EUR: 0 };
    accountStore.reset();
    clearAuth();

    // Selective wipe of peppool-prefixed keys
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('peppool_')) {
        localStorage.removeItem(key);
      }
    }

    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove('peppool_permissions');
      await chrome.storage.session?.remove(['sessionStartTime', 'dataKey']);
    }

    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = null;

    lockout.reset();
    clearAutoLockAlarm();
  }

  async function switchAccount(index: number) {
    if (!accounts.value[index]) return;
    activeAccountIndex.value = index;
    localStorage.setItem('peppool_active_account', index.toString());
    await syncToChromeStorage();
    accountStore.reset();
    inscriptionStore.load(accounts.value[index].address);
    await refreshBalance(true);
  }

  async function addAccount(label?: string) {
    if (!sessionKey) {
      throw new Error('Wallet is locked. Please re-authenticate.');
    }
    await withMnemonic(async (mnemonic) => {
      const nextIndex = accounts.value.length;
      const newAddress = deriveAddress(mnemonic, nextIndex, 0);
      const newAccount: Account = {
        address: newAddress,
        path: getDerivationPath(nextIndex, 0),
        label: label || `Account ${nextIndex + 1}`
      };
      accounts.value.push(newAccount);
      localStorage.setItem('peppool_accounts', JSON.stringify(accounts.value));
      await syncToChromeStorage();
      await switchAccount(nextIndex);
    });
  }

  async function renameAccount(index: number, label: string) {
    if (!accounts.value[index]) return;
    accounts.value[index].label = label;
    localStorage.setItem('peppool_accounts', JSON.stringify(accounts.value));
    await syncToChromeStorage();
  }

  function updateVault(encrypted: string) {
    encryptedMnemonic.value = encrypted;
    localStorage.setItem('peppool_vault', encrypted);
  }

  let pollTimer: ReturnType<typeof setInterval> | null = null;
  function startPolling() {
    stopPolling();
    pollTimer = setInterval(() => refreshBalance(), 30000);
  }
  function stopPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  }

  return {
    accounts,
    activeAccountIndex,
    activeAccount,
    address,
    encryptedMnemonic: readonly(encryptedMnemonic),
    isUnlocked,
    isCreated,
    isMnemonicLoaded,
    lockout,
    balanceFiat,
    selectedCurrency,
    selectedExplorer,
    EXPLORERS,
    currencySymbol,
    lockDuration,
    prices,
    setCurrency,
    setExplorer,
    openExplorerTx,
    openExplorerAddress,
    setLockDuration,
    checkSession,
    createWallet,
    importWallet,
    refreshBalance,
    resetLockTimer: debouncedResetLockTimer,
    startPolling,
    stopPolling,
    unlock,
    lock,
    resetWallet,
    switchAccount,
    addAccount,
    renameAccount,
    withMnemonic,
    updateVault
  };
});
