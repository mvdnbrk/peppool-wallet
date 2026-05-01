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
  const confirmedBalanceRibbits = ref<number>(0);
  const pendingBalanceRibbits = ref<number>(0);
  const transactions = ref<Transaction[]>([]);
  const canLoadMoreTransactions = ref(false);
  let lastTipHeight = 0;

  // Total balance (confirmed + mempool) — what users see on the dashboard.
  const balanceRibbits = computed(
    () => confirmedBalanceRibbits.value + pendingBalanceRibbits.value
  );

  // Spendable = confirmed balance minus value locked in confirmed inscription UTXOs.
  // Mempool balance is excluded because coin selection only spends confirmed UTXOs;
  // including pending here would let the send page promise funds it can't actually spend (issue #35).
  const spendableBalanceRibbits = computed(() =>
    Math.max(0, confirmedBalanceRibbits.value - inscriptionStore.utxoValueRibbits)
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
      const balanceCache = getCache<{ confirmed: number; pending: number } | number>(
        LOCAL_STORAGE_KEYS.BALANCE
      );
      const cached = balanceCache[address];
      if (typeof cached === 'object' && cached !== null) {
        confirmedBalanceRibbits.value = cached.confirmed;
        pendingBalanceRibbits.value = cached.pending;
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

      const { confirmed, pending } = await fetchAddressInfo(address);
      confirmedBalanceRibbits.value = confirmed;
      pendingBalanceRibbits.value = pending;
      const balanceCache = getCache<{ confirmed: number; pending: number }>(
        LOCAL_STORAGE_KEYS.BALANCE
      );
      balanceCache[address] = { confirmed, pending };
      localStorage.setItem(LOCAL_STORAGE_KEYS.BALANCE, JSON.stringify(balanceCache));

      await refreshTransactions(address);
      await inscriptionStore.sync(address, tipHeight);

      try {
        const [utxos, inscriptionSet] = await Promise.all([
          fetchUtxos(address),
          inscriptionStore.getOutputsSet(address)
        ]);
        // Only confirmed inscription UTXOs are subtracted, matching filterSpendableUtxos()
        // which spends only confirmed outputs (issue #35).
        const inscriptionRibbits = utxos
          .filter((u) => u.status.confirmed && isInscriptionUtxo(u, inscriptionSet))
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
    confirmedBalanceRibbits.value = 0;
    pendingBalanceRibbits.value = 0;
    transactions.value = [];
    canLoadMoreTransactions.value = false;
    lastTipHeight = 0;
  }

  return {
    balanceRibbits,
    confirmedBalanceRibbits,
    pendingBalanceRibbits,
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
