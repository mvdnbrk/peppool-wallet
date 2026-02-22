import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import { generateMnemonic, deriveAddress } from '../utils/crypto';
import { encrypt, decrypt, isLegacyVault } from '../utils/encryption';
import { fetchAddressInfo, fetchTransactions, fetchPepPrice, fetchTipHeight } from '../utils/api';
import { Transaction } from '../models/Transaction';
import { RIBBITS_PER_PEP, TXS_PER_PAGE } from '../utils/constants';
import { EXPLORERS, type ExplorerId, pepeExplorer } from '../utils/explorer';
import { useLockoutStore } from './lockout';

export interface Account {
  address: string;
  accountIndex: number;
  addressIndex: number;
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
  const activeAddress = ref<string | null>(localStorage.getItem('peppool_active_address'));
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

  // ── Computed ──
  const isCreated = computed(() => !!encryptedMnemonic.value);
  const isMnemonicLoaded = computed(() => !!plaintextMnemonic.value);
  const address = computed(() => activeAddress.value);
  const activeAccount = computed(() =>
    accounts.value.find((a) => a.address === activeAddress.value)
  );
  const balanceFiat = computed(() => balance.value * (prices.value[selectedCurrency.value] || 0));
  const currencySymbol = computed(() => (selectedCurrency.value === 'USD' ? '$' : '€'));

  // Initialize transactions from cache
  try {
    const cachedTxs = localStorage.getItem('peppool_transactions');
    if (cachedTxs) {
      transactions.value = JSON.parse(cachedTxs).map(
        (raw: any) => new Transaction(raw, activeAddress.value || '')
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
    if (!data.unlocked_until || data.unlocked_until <= Date.now()) return false;

    isUnlocked.value = true;
    try {
      const sessionData = await chrome.storage.session.get(['mnemonic']);
      if (sessionData.mnemonic) plaintextMnemonic.value = sessionData.mnemonic;
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
    if (!activeAddress.value) return;
    try {
      const rawTxs = await fetchTransactions(activeAddress.value);
      transactions.value = rawTxs.map((raw) => new Transaction(raw, activeAddress.value!));
      canLoadMore.value = rawTxs.length >= TXS_PER_PAGE;
      localStorage.setItem('peppool_transactions', JSON.stringify(rawTxs.slice(0, 20)));
    } catch (e) {
      console.error('Failed to fetch transactions', e);
    }
  }

  async function fetchMoreTransactions() {
    if (!activeAddress.value || transactions.value.length === 0) return false;
    const lastTx = transactions.value[transactions.value.length - 1];
    try {
      const rawTxs = await fetchTransactions(activeAddress.value, lastTx.txid);
      const newTxs = rawTxs.map((raw) => new Transaction(raw, activeAddress.value!));
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

  async function refreshBalance(force = false) {
    if (!activeAddress.value) return;
    try {
      const currentPrices = await fetchPepPrice();
      prices.value = currentPrices;
      localStorage.setItem('peppool_price_usd', currentPrices.USD.toString());
      localStorage.setItem('peppool_price_eur', currentPrices.EUR.toString());

      await fetchTipHeight();
      const totalRibbits = await fetchAddressInfo(activeAddress.value);
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
      accountIndex: 0,
      addressIndex: 0,
      label: 'Account 1'
    };

    accounts.value = [initialAccount];
    activeAddress.value = walletAddress;
    isUnlocked.value = true;

    localStorage.setItem('peppool_vault', encrypted);
    localStorage.setItem('peppool_accounts', JSON.stringify(accounts.value));
    localStorage.setItem('peppool_active_address', walletAddress);

    await lockout.reset();
    await refreshBalance(true);
  }

  async function unlock(password: string): Promise<boolean> {
    if (lockout.checkLocked()) return false;
    if (!encryptedMnemonic.value) return false;

    try {
      const mnemonic = await decrypt(encryptedMnemonic.value, password);
      const walletAddress = deriveAddress(mnemonic, 0, 0);

      const matched = accounts.value.find((a) => a.address === walletAddress);
      if (!matched && activeAddress.value && activeAccount.value) {
        const activeDerived = deriveAddress(
          mnemonic,
          activeAccount.value.accountIndex,
          activeAccount.value.addressIndex
        );
        if (activeDerived !== activeAddress.value) throw new Error('Invalid vault');
      }

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
        resetWallet();
      }
      return false;
    }
  }

  function lock() {
    isUnlocked.value = false;
    plaintextMnemonic.value = null;
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.remove('unlocked_until');
      chrome.storage.session?.remove('mnemonic');
    }
    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = null;
    localStorage.removeItem('peppool_transactions');
    localStorage.removeItem('peppool_form_send');
    localStorage.removeItem('peppool_form_import');
    clearAutoLockAlarm();
  }

  function resetWallet() {
    accounts.value = [];
    activeAddress.value = null;
    encryptedMnemonic.value = null;
    plaintextMnemonic.value = null;
    isUnlocked.value = false;
    balance.value = 0;
    transactions.value = [];
    localStorage.clear();
    lockout.reset();
    clearAutoLockAlarm();
  }

  function switchAccount(address: string) {
    const account = accounts.value.find((a) => a.address === address);
    if (!account) return;
    activeAddress.value = address;
    localStorage.setItem('peppool_active_address', address);
    balance.value = 0;
    transactions.value = [];
    refreshBalance(true);
  }

  async function addAccount(label?: string) {
    if (!plaintextMnemonic.value) return;
    const nextIndex = accounts.value.length;
    const newAddress = deriveAddress(plaintextMnemonic.value, nextIndex, 0);
    const newAccount: Account = {
      address: newAddress,
      accountIndex: nextIndex,
      addressIndex: 0,
      label: label || `Account ${nextIndex + 1}`
    };
    accounts.value.push(newAccount);
    localStorage.setItem('peppool_accounts', JSON.stringify(accounts.value));
    switchAccount(newAddress);
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
    activeAddress,
    activeAccount,
    address,
    encryptedMnemonic,
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
