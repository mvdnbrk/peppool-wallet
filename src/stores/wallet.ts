import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import {
  generateMnemonic,
  deriveAddress,
  getDerivationPath,
  parseDerivationPath
} from '@/utils/crypto';
import { encrypt, decrypt, isLegacyVault } from '@/utils/encryption';
import {
  fetchAddressInfo,
  fetchTransactions,
  fetchTransaction as apiFetchTransaction,
  fetchPepPrice,
  fetchTipHeight
} from '@/utils/api';
import { Transaction } from '@/models/Transaction';
import { RIBBITS_PER_PEP, TXS_PER_PAGE } from '@/utils/constants';
import { EXPLORERS, type ExplorerId, pepeExplorer } from '@/utils/explorer';
import { useLockoutStore } from './lockout';

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

  // ── State ──
  const accounts = ref<Account[]>(JSON.parse(localStorage.getItem('peppool_accounts') || '[]'));
  const activeAccountIndex = ref<number>(
    parseInt(localStorage.getItem('peppool_active_account') || '0')
  );
  const encryptedMnemonic = ref<string | null>(localStorage.getItem('peppool_vault'));
  const plaintextMnemonic = ref<string | null>(null);
  const isUnlocked = ref(false);
  const lockDuration = ref<number>(parseInt(localStorage.getItem('peppool_lock_duration') || '15'));
  const balance = ref<number>(Number(localStorage.getItem('peppool_balance')) || 0);
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

  const transactions = ref<Transaction[]>([]);
  const canLoadMore = ref(true);
  let lockTimer: ReturnType<typeof setTimeout> | null = null;
  let lastTipHeight = 0;

  // ── Computed ──
  const isCreated = computed(() => !!encryptedMnemonic.value);
  const isMnemonicLoaded = computed(() => !!plaintextMnemonic.value);
  const activeAccount = computed(() => accounts.value[activeAccountIndex.value] || null);
  const address = computed(() => activeAccount.value?.address || null);
  const balanceFiat = computed(() => balance.value * (prices.value[selectedCurrency.value] || 0));
  const currencySymbol = computed(() => (selectedCurrency.value === 'USD' ? '$' : '€'));

  // Initialize transactions from cache
  try {
    const cachedTxs = localStorage.getItem('peppool_transactions');
    if (cachedTxs) {
      transactions.value = JSON.parse(cachedTxs).map(
        (raw: any) => new Transaction(raw, address.value || '')
      );
    }
  } catch {
    /* ignore */
  }

  // ── Actions ──
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
    if (typeof chrome === 'undefined' || !chrome.storage) return false;

    const data = await chrome.storage.local.get(['unlocked_until']);
    const unlockedUntil = data.unlocked_until as number | undefined;
    if (!unlockedUntil || unlockedUntil <= Date.now()) return false;

    isUnlocked.value = true;
    try {
      const sessionData = await chrome.storage.session.get(['mnemonic']);
      const mnemonic = sessionData.mnemonic as string | undefined;
      if (mnemonic) plaintextMnemonic.value = mnemonic;
    } catch {
      /* ignore */
    }

    resetLockTimer();
    return true;
  }

  async function resetLockTimer() {
    if (!isUnlocked.value) return;
    const durationMs = lockDuration.value * 60 * 1000;
    const expiry = Date.now() + durationMs;

    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ unlocked_until: expiry });
    }

    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = setTimeout(() => lock(), durationMs);
    await setAutoLockAlarm(lockDuration.value);
  }

  async function refreshTransactions() {
    if (!address.value) return;
    try {
      const rawTxs = await fetchTransactions(address.value);
      transactions.value = rawTxs.map((raw) => new Transaction(raw, address.value!));
      canLoadMore.value = rawTxs.length >= TXS_PER_PAGE;
      localStorage.setItem('peppool_transactions', JSON.stringify(rawTxs.slice(0, 20)));
    } catch (e) {
      console.error('Failed to fetch transactions', e);
    }
  }

  async function fetchMoreTransactions() {
    if (!address.value || transactions.value.length === 0) return false;
    const lastTx = transactions.value[transactions.value.length - 1];
    if (!lastTx) return false;
    try {
      const rawTxs = await fetchTransactions(address.value, lastTx.txid);
      const newTxs = rawTxs.map((raw) => new Transaction(raw, address.value!));
      const existingIds = new Set(transactions.value.map((t) => t.txid));
      const uniqueNewTxs = newTxs.filter((t) => !existingIds.has(t.txid));
      canLoadMore.value = rawTxs.length >= TXS_PER_PAGE;
      transactions.value = [...transactions.value, ...uniqueNewTxs];
      return uniqueNewTxs.length > 0;
    } catch (e) {
      console.error('Failed to fetch more transactions', e);
      return false;
    }
  }

  async function fetchTransaction(txid: string): Promise<Transaction> {
    const rawTx = await apiFetchTransaction(txid);
    return new Transaction(rawTx, address.value || '');
  }

  async function refreshBalance(force = false) {
    if (!address.value) return;
    try {
      const currentPrices = await fetchPepPrice();
      prices.value = currentPrices;
      localStorage.setItem('peppool_price_usd', currentPrices.USD.toString());
      localStorage.setItem('peppool_price_eur', currentPrices.EUR.toString());

      const tipHeight = await fetchTipHeight();
      if (!force && tipHeight === lastTipHeight && lastTipHeight > 0) {
        await resetLockTimer();
        return;
      }
      lastTipHeight = tipHeight;

      const totalRibbits = await fetchAddressInfo(address.value);
      balance.value = totalRibbits / RIBBITS_PER_PEP;
      localStorage.setItem('peppool_balance', balance.value.toString());

      await refreshTransactions();
      await resetLockTimer();
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
    plaintextMnemonic.value = mnemonic;
    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      await chrome.storage.session.set({ mnemonic });
    }

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

    await lockout.reset();
    await refreshBalance(true);
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

      if (isLegacyVault(encryptedMnemonic.value)) {
        const upgraded = await encrypt(mnemonic, password);
        updateVault(upgraded);
      }

      plaintextMnemonic.value = mnemonic;
      if (typeof chrome !== 'undefined' && chrome.storage?.session) {
        await chrome.storage.session.set({ mnemonic });
      }
      isUnlocked.value = true;
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
    plaintextMnemonic.value = null;
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove('unlocked_until');
      await chrome.storage.session?.remove('mnemonic');
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
    plaintextMnemonic.value = null;
    isUnlocked.value = false;
    balance.value = 0;
    prices.value = { USD: 0, EUR: 0 };
    transactions.value = [];

    // Selective wipe of peppool-prefixed keys
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('peppool_')) {
        localStorage.removeItem(key);
      }
    }

    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove('unlocked_until');
      await chrome.storage.session?.remove('mnemonic');
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
    balance.value = 0;
    transactions.value = [];
    await refreshBalance(true);
  }

  async function addAccount(label?: string) {
    if (!plaintextMnemonic.value) return;
    const nextIndex = accounts.value.length;
    const newAddress = deriveAddress(plaintextMnemonic.value, nextIndex, 0);
    const newAccount: Account = {
      address: newAddress,
      path: getDerivationPath(nextIndex, 0),
      label: label || `Account ${nextIndex + 1}`
    };
    accounts.value.push(newAccount);
    localStorage.setItem('peppool_accounts', JSON.stringify(accounts.value));
    await switchAccount(nextIndex);
  }

  function cacheMnemonic(mnemonic: string) {
    plaintextMnemonic.value = mnemonic;
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
    plaintextMnemonic: readonly(plaintextMnemonic),
    isUnlocked,
    isCreated,
    isMnemonicLoaded,
    lockout,
    balance,
    balanceFiat,
    selectedCurrency,
    selectedExplorer,
    EXPLORERS,
    currencySymbol,
    lockDuration,
    prices,
    transactions,
    canLoadMore,
    setCurrency,
    setExplorer,
    openExplorerTx,
    openExplorerAddress,
    setLockDuration,
    checkSession,
    createWallet,
    importWallet,
    refreshBalance,
    refreshTransactions,
    fetchTransaction,
    fetchMoreTransactions,
    resetLockTimer,
    startPolling,
    stopPolling,
    unlock,
    lock,
    resetWallet,
    switchAccount,
    addAccount,
    cacheMnemonic,
    updateVault
  };
});
