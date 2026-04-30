import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  fetchAddressInfo,
  fetchTransactions,
  fetchTransaction as apiFetchTransaction,
  fetchTipHeight,
  fetchUtxos,
  isInscriptionUtxo
} from '@/utils/api';
import { Transaction } from '@/models/Transaction';
import { TXS_PER_PAGE } from '@/utils/constants';
import { useInscriptionStore } from './inscriptions';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage';

export const useAccountStore = defineStore('account', () => {
  const inscriptionStore = useInscriptionStore();

  // ── State ──
  // Ribbits is the canonical unit (integer). Conversion to PEP/fiat happens at display time.
  const balanceRibbits = ref<number>(0);
  const transactions = ref<Transaction[]>([]);
  const canLoadMoreTransactions = ref(false);
  let lastTipHeight = 0;

  // Spendable = total balance minus value locked in inscription UTXOs.
  // Derived so it survives popup close/reopen: both inputs come from cache.
  const spendableBalanceRibbits = computed(() =>
    Math.max(0, balanceRibbits.value - inscriptionStore.utxoValueRibbits)
  );

  // ── Cache (keyed by address) ──
  function getCache<T>(key: string): Record<string, T> {
    try {
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch {
      return {};
    }
  }

  function loadCachedData(address: string) {
    try {
      const balanceCache = getCache<number>(LOCAL_STORAGE_KEYS.BALANCE);
      if (balanceCache[address] != null) {
        balanceRibbits.value = balanceCache[address];
      }

      const txCache = getCache<unknown[]>(LOCAL_STORAGE_KEYS.TRANSACTIONS);
      if (txCache[address]) {
        transactions.value = txCache[address].map((raw: any) => new Transaction(raw, address));
      }
    } catch {
      /* ignore corrupt cache */
    }
  }

  // ── Actions ──
  async function refreshTransactions(address: string) {
    try {
      const rawTxs = await fetchTransactions(address);
      transactions.value = rawTxs.map((raw) => new Transaction(raw, address));
      canLoadMoreTransactions.value = rawTxs.length >= TXS_PER_PAGE;
      const txCache = getCache<unknown[]>(LOCAL_STORAGE_KEYS.TRANSACTIONS);
      txCache[address] = rawTxs.slice(0, 20);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txCache));
    } catch (e) {
      console.error('Failed to fetch transactions', e);
    }
  }

  async function fetchMoreTransactions(address: string) {
    if (transactions.value.length === 0) return false;
    const lastTx = transactions.value[transactions.value.length - 1];
    if (!lastTx) return false;
    try {
      const rawTxs = await fetchTransactions(address, lastTx.txid);
      const newTxs = rawTxs.map((raw) => new Transaction(raw, address));
      const existingIds = new Set(transactions.value.map((t) => t.txid));
      const uniqueNewTxs = newTxs.filter((t) => !existingIds.has(t.txid));
      canLoadMoreTransactions.value = rawTxs.length >= TXS_PER_PAGE;
      transactions.value = [...transactions.value, ...uniqueNewTxs];
      return uniqueNewTxs.length > 0;
    } catch (e) {
      console.error('Failed to fetch more transactions', e);
      return false;
    }
  }

  async function fetchTransaction(txid: string, address: string): Promise<Transaction> {
    const rawTx = await apiFetchTransaction(txid);
    return new Transaction(rawTx, address);
  }

  async function sync(address: string, force = false) {
    try {
      const tipHeight = await fetchTipHeight();
      if (!force && tipHeight === lastTipHeight && lastTipHeight > 0) return;
      lastTipHeight = tipHeight;

      balanceRibbits.value = await fetchAddressInfo(address);
      const balanceCache = getCache<number>(LOCAL_STORAGE_KEYS.BALANCE);
      balanceCache[address] = balanceRibbits.value;
      localStorage.setItem(LOCAL_STORAGE_KEYS.BALANCE, JSON.stringify(balanceCache));

      await refreshTransactions(address);
      await inscriptionStore.sync(address, tipHeight);

      try {
        const [utxos, inscriptionSet] = await Promise.all([
          fetchUtxos(address),
          inscriptionStore.getOutputsSet(address)
        ]);
        const inscriptionRibbits = utxos
          .filter((u) => isInscriptionUtxo(u, inscriptionSet))
          .reduce((sum, u) => sum + u.value, 0);
        inscriptionStore.setUtxoValueRibbits(inscriptionRibbits);
      } catch {
        // Leave the inscription value at its cached state.
      }
    } catch (e) {
      console.error('Failed to sync account', e);
    }
  }

  function reset() {
    balanceRibbits.value = 0;
    transactions.value = [];
    canLoadMoreTransactions.value = false;
    lastTipHeight = 0;
  }

  return {
    balanceRibbits,
    spendableBalanceRibbits,
    transactions,
    canLoadMoreTransactions,
    loadCachedData,
    refreshTransactions,
    fetchMoreTransactions,
    fetchTransaction,
    sync,
    reset
  };
});
