import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import { generateMnemonic, deriveAddress } from '../utils/crypto';
import { encrypt, decrypt, isLegacyVault } from '../utils/encryption';
import { fetchAddressInfo, fetchTransactions, fetchPepPrice, fetchTipHeight } from '../utils/api';
import { Transaction } from '../models/Transaction';
import { RIBBITS_PER_PEP, TXS_PER_PAGE } from '../utils/constants';
import { EXPLORERS, type ExplorerId, pepeExplorer } from '../utils/explorer';
import { useLockoutStore } from './lockout';

// ── Background worker messaging ────────────────────────────────────────────
async function setAutoLockAlarm(delayMinutes: number) {
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    try {
      await chrome.runtime.sendMessage({ type: 'set-auto-lock', delayMinutes });
    } catch {
      /* background worker unavailable (e.g. dev mode) */
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
  const address = ref<string | null>(localStorage.getItem('peppool_address'));
  const encryptedMnemonic = ref<string | null>(localStorage.getItem('peppool_vault'));
  const plaintextMnemonic = ref<string | null>(null);
  const isUnlocked = ref(false);

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
  const lockDuration = ref<number>(parseInt(localStorage.getItem('peppool_lock_duration') || '15'));

  // Load cached transactions on initialization
  let initialTransactions: Transaction[] = [];
  try {
    const cachedTxs = localStorage.getItem('peppool_transactions');
    if (cachedTxs) {
      initialTransactions = JSON.parse(cachedTxs).map(
        (raw: any) => new Transaction(raw, localStorage.getItem('peppool_address') || '')
      );
    }
  } catch {
    localStorage.removeItem('peppool_transactions');
  }

  const transactions = ref<Transaction[]>(initialTransactions);
  const canLoadMore = ref(true);
  let lockTimer: ReturnType<typeof setTimeout> | null = null;

  const isCreated = computed(() => !!encryptedMnemonic.value);
  const isMnemonicLoaded = computed(() => !!plaintextMnemonic.value);
  const balanceFiat = computed(() => balance.value * (prices.value[selectedCurrency.value] || 0));
  const currencySymbol = computed(() => (selectedCurrency.value === 'USD' ? '$' : '€'));

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
    const unlockedUntilLocal = data.unlocked_until as number | undefined;

    if (!unlockedUntilLocal || unlockedUntilLocal <= Date.now()) return false;

    isUnlocked.value = true;

    try {
      const sessionData = await chrome.storage.session.get(['mnemonic']);
      const mnemonic = sessionData.mnemonic as string | undefined;
      if (mnemonic) plaintextMnemonic.value = mnemonic;
    } catch (e) {
      /* session unavailable */
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

    // Local timer — locks the popup if the user leaves it open + idle
    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = setTimeout(() => lock(), durationMs);

    // Background alarm — actively purges the mnemonic from chrome.storage
    // even after the popup is destroyed (user clicks away)
    await setAutoLockAlarm(lockDuration.value);
  }

  async function refreshTransactions() {
    if (!address.value) return;
    try {
      const rawTxs = await fetchTransactions(address.value);
      transactions.value = rawTxs.map((raw) => new Transaction(raw, address.value!));
      canLoadMore.value = rawTxs.length >= TXS_PER_PAGE;

      // Cache the last 20 transactions
      const cacheData = rawTxs.slice(0, 20);
      localStorage.setItem('peppool_transactions', JSON.stringify(cacheData));
    } catch (e) {
      console.error('Failed to fetch transactions', e);
    }
  }

  async function fetchMoreTransactions() {
    if (!address.value || transactions.value.length === 0) return;

    const lastTx = transactions.value[transactions.value.length - 1];
    if (!lastTx) return false;

    try {
      const rawTxs = await fetchTransactions(address.value, lastTx.txid);
      const newTxs = rawTxs.map((raw) => new Transaction(raw, address.value!));

      // Avoid duplicates (in case the API overlaps)
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

  // ── Smart refresh with tip height check ─────────────────────────────
  let lastTipHeight = 0;
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  const POLL_INTERVAL_MS = 30_000; // 30 seconds

  /**
   * Refresh wallet data. Checks the chain tip height first —
   * if no new blocks have arrived, skips the expensive balance + tx fetch.
   * Price is always refreshed (it changes off-chain).
   * Pass force=true to bypass the tip check (e.g. after sending a tx).
   */
  async function refreshBalance(force = false) {
    if (!address.value) return;
    try {
      // Always refresh price (changes independently of blocks)
      const currentPrices = await fetchPepPrice();
      prices.value = currentPrices;
      localStorage.setItem('peppool_price_usd', currentPrices.USD.toString());
      localStorage.setItem('peppool_price_eur', currentPrices.EUR.toString());

      // Check if chain has advanced since last fetch
      const tipHeight = await fetchTipHeight();
      if (!force && tipHeight === lastTipHeight && lastTipHeight > 0) {
        // No new blocks — skip expensive calls
        await resetLockTimer();
        return;
      }
      lastTipHeight = tipHeight;

      // Chain advanced (or first load) — fetch balance + txs
      const totalRibbits = await fetchAddressInfo(address.value);
      const pepBalance = totalRibbits / RIBBITS_PER_PEP;
      balance.value = pepBalance;
      localStorage.setItem('peppool_balance', pepBalance.toString());

      await refreshTransactions();
      await resetLockTimer();
    } catch (e) {
      console.error('Failed to refresh balance', e);
    }
  }

  function startPolling() {
    stopPolling();
    pollTimer = setInterval(() => refreshBalance(), POLL_INTERVAL_MS);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  async function createWallet(password: string) {
    const mnemonic = generateMnemonic();
    await importWallet(mnemonic, password);
  }

  async function importWallet(mnemonic: string, password: string) {
    const walletAddress = deriveAddress(mnemonic);
    const encrypted = await encrypt(mnemonic, password);

    encryptedMnemonic.value = encrypted;
    plaintextMnemonic.value = mnemonic;

    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      await chrome.storage.session.set({ mnemonic });
    }

    address.value = walletAddress;
    isUnlocked.value = true;
    localStorage.setItem('peppool_vault', encrypted);
    localStorage.setItem('peppool_address', walletAddress);

    await lockout.reset();
    await refreshBalance();
  }

  async function unlock(password: string): Promise<boolean> {
    if (lockout.checkLocked()) return false;
    if (!encryptedMnemonic.value) return false;

    try {
      const mnemonic = await decrypt(encryptedMnemonic.value, password);
      const walletAddress = deriveAddress(mnemonic);

      if (walletAddress !== address.value) throw new Error('Invalid vault');

      // Auto-upgrade legacy (SHA-256 only) vaults to PBKDF2
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
      await refreshBalance();
      return true;
    } catch (e) {
      const { wipe } = await lockout.recordFailure();
      if (wipe) resetWallet();
      return false;
    }
  }

  async function lock() {
    isUnlocked.value = false;
    plaintextMnemonic.value = null;
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove('unlocked_until');
      if (chrome.storage.session) await chrome.storage.session.remove('mnemonic');
    }
    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = null;

    localStorage.removeItem('peppool_transactions');
    clearForms();
    await clearAutoLockAlarm();
  }

  function clearForms() {
    // Specifically wipe form persistence but keep the wallet (vault/address)
    const keysToRemove = Object.keys(localStorage).filter((k) => k.startsWith('peppool_form_'));
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }

  function resetWallet() {
    address.value = null;
    encryptedMnemonic.value = null;
    plaintextMnemonic.value = null;
    isUnlocked.value = false;
    balance.value = 0;
    prices.value = { USD: 0, EUR: 0 };
    transactions.value = [];
    // Remove all peppool-related keys (factory reset)
    const keysToRemove = Object.keys(localStorage).filter((k) => k.startsWith('peppool_'));
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    lockout.reset();
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.remove('unlocked_until');
      if (chrome.storage.session) chrome.storage.session.remove('mnemonic');
    }
    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = null;
    clearAutoLockAlarm();
  }

  /**
   * Cache a decrypted mnemonic in memory (e.g. after password confirmation
   * during a send). Avoids exposing plaintextMnemonic as a writable ref.
   */
  function cacheMnemonic(mnemonic: string) {
    plaintextMnemonic.value = mnemonic;
  }

  /**
   * Update the encrypted vault (e.g. after a password change).
   * Centralises the write so in-memory state and localStorage stay in sync.
   */
  function updateVault(encrypted: string) {
    encryptedMnemonic.value = encrypted;
    localStorage.setItem('peppool_vault', encrypted);
  }

  return {
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
    fetchMoreTransactions,
    resetLockTimer,
    startPolling,
    stopPolling,
    unlock,
    lock,
    resetWallet,
    cacheMnemonic,
    updateVault
  };
});
