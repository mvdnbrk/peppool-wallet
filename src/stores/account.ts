import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  fetchAddressInfo,
  fetchTransactions,
  fetchTransaction as apiFetchTransaction,
  fetchTipHeight,
  fetchUtxos,
  filterSpendableUtxos
} from '@/utils/api';
import { Transaction } from '@/models/Transaction';
import { RIBBITS_PER_PEP, TXS_PER_PAGE } from '@/utils/constants';
import { useInscriptionStore } from './inscriptions';

export const useAccountStore = defineStore('account', () => {
  const inscriptionStore = useInscriptionStore();

  // ── State ──
  const balance = ref<number>(0);
  const spendableBalance = ref<number>(0);
  const transactions = ref<Transaction[]>([]);
  const canLoadMoreTransactions = ref(false);
  let lastTipHeight = 0;

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
      const balanceCache = getCache<number>('peppool_balance');
      if (balanceCache[address] != null) {
        balance.value = balanceCache[address];
      }

      const txCache = getCache<unknown[]>('peppool_transactions');
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
      const txCache = getCache<unknown[]>('peppool_transactions');
      txCache[address] = rawTxs.slice(0, 20);
      localStorage.setItem('peppool_transactions', JSON.stringify(txCache));
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

      const totalRibbits = await fetchAddressInfo(address);
      balance.value = totalRibbits / RIBBITS_PER_PEP;
      const balanceCache = getCache<number>('peppool_balance');
      balanceCache[address] = balance.value;
      localStorage.setItem('peppool_balance', JSON.stringify(balanceCache));

      await refreshTransactions(address);
      await inscriptionStore.sync(address, tipHeight);

      try {
        const [utxos, inscriptionSet] = await Promise.all([
          fetchUtxos(address),
          inscriptionStore.getOutputsSet(address)
        ]);
        const spendableRibbits = filterSpendableUtxos(utxos, inscriptionSet).reduce(
          (sum, u) => sum + u.value,
          0
        );
        spendableBalance.value = spendableRibbits / RIBBITS_PER_PEP;
      } catch {
        spendableBalance.value = balance.value;
      }
    } catch (e) {
      console.error('Failed to sync account', e);
    }
  }

  function reset() {
    balance.value = 0;
    spendableBalance.value = 0;
    transactions.value = [];
    canLoadMoreTransactions.value = false;
    lastTipHeight = 0;
  }

  return {
    balance,
    spendableBalance,
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
