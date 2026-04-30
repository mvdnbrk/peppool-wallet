import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import {
  generateMnemonic,
  deriveAddress,
  deriveAuthKeyPair,
  getDerivationPath,
  parseDerivationPath
} from '@/utils/crypto';
import { encrypt, decrypt, deriveKeyBytes } from '@/utils/encryption';
import { hasAddressActivity } from '@/utils/api';
import { ensureAuth, clearAuth } from '@/utils/auth';
import { refreshPrices, clearPrices } from '@/utils/price';
import { getWalletState, saveWalletState, clearAllSettings } from '@/utils/settings';
import { useSession } from '@/composables/useSession';
import { useLockoutStore } from './lockout';
import { useSettingsStore } from './settings';
import { useInscriptionStore } from './inscriptions';
import { useAccountStore } from './account';
import { LOCAL_STORAGE_KEYS, CHROME_STORAGE_KEYS, STORAGE_PREFIX } from '@/constants/storage';

export interface Account {
  address: string;
  path: string;
  label: string;
}

export const useWalletStore = defineStore('wallet', () => {
  const lockout = useLockoutStore();
  const settingsStore = useSettingsStore();
  const inscriptionStore = useInscriptionStore();
  const accountStore = useAccountStore();

  // ── State ──
  const { settings } = settingsStore;
  const walletStateData = getWalletState();

  const accounts = ref<Account[]>(walletStateData.accounts);
  const activeAccountIndex = ref<number>(walletStateData.activeAccountIndex);
  const encryptedMnemonic = ref<string | null>(localStorage.getItem(LOCAL_STORAGE_KEYS.VAULT));

  const session = useSession({
    encryptedMnemonic,
    getLockDuration: () => settings.lockDuration
  });

  // ── Computed ──
  const isCreated = computed(() => !!encryptedMnemonic.value);
  const isMnemonicLoaded = computed(() => session.hasSessionKey.value);
  const activeAccount = computed(() => accounts.value[activeAccountIndex.value] || null);
  const address = computed(() => activeAccount.value?.address || null);

  // Initialize cached transactions
  if (address.value) {
    accountStore.loadCachedData(address.value);
    inscriptionStore.load(address.value);
  }

  // ── Actions ──
  async function checkSession() {
    await lockout.restore();
    return session.checkSession();
  }

  async function refreshAuth() {
    if (!session.hasSessionKey.value) return;
    try {
      await session.withMnemonic(async (mnemonic) => {
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
      await refreshPrices();

      await accountStore.sync(address.value, force);
      await session.resetLockTimer();
    } catch (e) {
      console.error('Failed to refresh balance', e);
    }
  }

  async function createWallet(password: string) {
    const mnemonic = generateMnemonic();
    await importWallet(mnemonic, password);
  }

  async function importWallet(mnemonic: string, password: string) {
    const walletAddress = deriveAddress(mnemonic, 0, 0);
    const encrypted = await encrypt(mnemonic, password);

    encryptedMnemonic.value = encrypted;
    await session.cacheKeyBytes(await deriveKeyBytes(password, encrypted));

    const initialAccount: Account = {
      address: walletAddress,
      path: getDerivationPath(0, 0),
      label: 'Account 1'
    };

    accounts.value = [initialAccount];
    activeAccountIndex.value = 0;
    session.markUnlocked();

    localStorage.setItem(LOCAL_STORAGE_KEYS.VAULT, encrypted);
    await saveWalletState({ accounts: accounts.value, activeAccountIndex: 0 });

    await session.resetLockTimer();
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
      await saveWalletState({ accounts: accounts.value });
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

      await session.cacheKeyBytes(await deriveKeyBytes(password, encryptedMnemonic.value));
      session.markUnlocked();
      await session.resetLockTimer();
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
    await session.lock();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
  }

  async function resetWallet() {
    await session.lock();

    accounts.value = [];
    activeAccountIndex.value = 0;
    encryptedMnemonic.value = null;
    clearPrices();
    accountStore.reset();
    clearAuth();

    // Wipe all peppool localStorage keys (cache + vault)
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }

    // Wipe chrome.storage (settings, accounts, permissions)
    await clearAllSettings();
    await chrome.storage.local.remove([
      CHROME_STORAGE_KEYS.PERMISSIONS,
      CHROME_STORAGE_KEYS.LOCKOUT
    ]);

    lockout.reset();
  }

  async function switchAccount(index: number) {
    if (!accounts.value[index]) return;
    activeAccountIndex.value = index;
    await saveWalletState({ activeAccountIndex: index });
    accountStore.reset();
    inscriptionStore.load(accounts.value[index].address);
    await refreshBalance(true);
  }

  async function addAccount(label?: string) {
    if (!session.hasSessionKey.value) {
      throw new Error('Wallet is locked. Please re-authenticate.');
    }
    await session.withMnemonic(async (mnemonic) => {
      const nextIndex = accounts.value.length;
      const newAddress = deriveAddress(mnemonic, nextIndex, 0);
      const newAccount: Account = {
        address: newAddress,
        path: getDerivationPath(nextIndex, 0),
        label: label || `Account ${nextIndex + 1}`
      };
      accounts.value.push(newAccount);
      await saveWalletState({ accounts: accounts.value });
      await switchAccount(nextIndex);
    });
  }

  async function renameAccount(index: number, label: string) {
    if (!accounts.value[index]) return;
    accounts.value[index].label = label;
    await saveWalletState({ accounts: accounts.value });
  }

  function updateVault(encrypted: string) {
    encryptedMnemonic.value = encrypted;
    localStorage.setItem(LOCAL_STORAGE_KEYS.VAULT, encrypted);
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
    isUnlocked: session.isUnlocked,
    isCreated,
    isMnemonicLoaded,
    lockout,
    checkSession,
    createWallet,
    importWallet,
    refreshBalance,
    resetLockTimer: session.debouncedResetLockTimer,
    startPolling,
    stopPolling,
    unlock,
    lock,
    resetWallet,
    switchAccount,
    addAccount,
    renameAccount,
    withMnemonic: session.withMnemonic,
    updateVault
  };
});
