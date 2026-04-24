import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAccountStore } from './account';

import { Transaction } from '@/models/Transaction';
import * as api from '@/utils/api';

vi.mock('@/utils/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/api')>();
  return {
    ...actual,
    fetchAddressInfo: vi.fn(() => Promise.resolve(100000000)),
    fetchTransactions: vi.fn(() => Promise.resolve([])),
    fetchTipHeight: vi.fn(() => Promise.resolve(100)),
    fetchUtxos: vi.fn(() =>
      Promise.resolve([{ txid: 'a', vout: 0, value: 100000000, status: { confirmed: true } }])
    ),
    fetchAddressInscriptions: vi.fn(() =>
      Promise.resolve({ inscriptions: [], outputs: [], total: 0 })
    ),
    fetchInscription: vi.fn(),
    fetchTransaction: vi.fn()
  };
});

const addr = 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU';

describe('Account Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with zero balance', () => {
    const account = useAccountStore();
    expect(account.balance).toBe(0);
    expect(account.spendableBalance).toBe(0);
    expect(account.transactions).toHaveLength(0);
    expect(account.canLoadMore).toBe(true);
  });

  it('should restore cached balance from localStorage', () => {
    localStorage.setItem('peppool_balance', '42');
    const account = useAccountStore();
    expect(account.balance).toBe(42);
  });

  it('should sync balance from API', async () => {
    vi.mocked(api.fetchAddressInfo).mockResolvedValue(500000000);
    const account = useAccountStore();

    await account.sync(addr, true);

    expect(account.balance).toBe(5);
    expect(localStorage.getItem('peppool_balance')).toBe('5');
  });

  it('should skip sync when tip height unchanged', async () => {
    vi.mocked(api.fetchTipHeight).mockResolvedValue(100);
    const account = useAccountStore();

    await account.sync(addr, true);
    vi.clearAllMocks();

    await account.sync(addr, false);
    expect(api.fetchAddressInfo).not.toHaveBeenCalled();
  });

  it('should force sync regardless of tip height', async () => {
    vi.mocked(api.fetchTipHeight).mockResolvedValue(100);
    const account = useAccountStore();

    await account.sync(addr, true);
    vi.clearAllMocks();
    vi.mocked(api.fetchTipHeight).mockResolvedValue(100);
    vi.mocked(api.fetchAddressInfo).mockResolvedValue(200000000);

    await account.sync(addr, true);
    expect(api.fetchAddressInfo).toHaveBeenCalled();
    expect(account.balance).toBe(2);
  });

  it('should compute spendable balance excluding inscription UTXOs', async () => {
    vi.mocked(api.fetchAddressInfo).mockResolvedValue(300000000);
    vi.mocked(api.fetchUtxos).mockResolvedValue([
      { txid: 'spendable1', vout: 0, value: 200000000, status: { confirmed: true } },
      { txid: 'inscribed1', vout: 1, value: 10000, status: { confirmed: true } },
      { txid: 'spendable2', vout: 0, value: 99990000, status: { confirmed: true } }
    ]);
    vi.mocked(api.fetchAddressInscriptions).mockResolvedValue({
      inscriptions: [],
      outputs: ['inscribed1:1'],
      total: 0
    });

    const account = useAccountStore();
    await account.sync(addr, true);

    expect(account.balance).toBe(3);
    expect(account.spendableBalance).toBe(2.9999);
  });

  it('should fall back to total balance when UTXO fetch fails', async () => {
    vi.mocked(api.fetchAddressInfo).mockResolvedValue(100000000);
    vi.mocked(api.fetchUtxos).mockRejectedValue(new Error('Network error'));

    const account = useAccountStore();
    await account.sync(addr, true);

    expect(account.balance).toBe(1);
    expect(account.spendableBalance).toBe(1);
  });

  it('should refresh transactions and cache them', async () => {
    const mockTx = {
      txid: 'tx1',
      version: 1,
      locktime: 0,
      vin: [],
      vout: [{ value: 100000000, scriptpubkey_address: addr }],
      size: 100,
      weight: 400,
      fee: 1000,
      status: { confirmed: true, block_height: 100, block_time: Date.now() / 1000 }
    };
    vi.mocked(api.fetchTransactions).mockResolvedValue([mockTx] as any);

    const account = useAccountStore();
    await account.refreshTransactions(addr);

    expect(account.transactions).toHaveLength(1);
    expect(account.transactions[0]!.txid).toBe('tx1');

    const cached = localStorage.getItem('peppool_transactions');
    expect(cached).not.toBeNull();
    expect(JSON.parse(cached!)[0].txid).toBe('tx1');
  });

  it('should restore transactions from cache', () => {
    const mockTx = {
      txid: 'cached-tx',
      version: 1,
      locktime: 0,
      vin: [],
      vout: [{ value: 100000000, scriptpubkey_address: addr }],
      size: 100,
      weight: 400,
      fee: 1000,
      status: { confirmed: true, block_height: 100, block_time: Date.now() / 1000 }
    };
    localStorage.setItem('peppool_transactions', JSON.stringify([mockTx]));

    const account = useAccountStore();
    account.loadCachedTransactions(addr);

    expect(account.transactions).toHaveLength(1);
    expect(account.transactions[0]!.txid).toBe('cached-tx');
  });

  it('should fetch more transactions and append uniquely', async () => {
    const baseTx = {
      version: 1,
      locktime: 0,
      vin: [],
      vout: [{ value: 100000000, scriptpubkey_address: addr }],
      size: 100,
      weight: 400,
      fee: 1000,
      status: { confirmed: true, block_height: 100, block_time: Date.now() / 1000 }
    };

    const account = useAccountStore();
    account.transactions = [new Transaction({ ...baseTx, txid: 'tx1' } as any, addr)];

    const fullPage = Array(25)
      .fill(null)
      .map((_, i) => ({ ...baseTx, txid: `page-${i}` }));
    vi.mocked(api.fetchTransactions).mockResolvedValue(fullPage as any);

    const hasMore = await account.fetchMoreTransactions(addr);
    expect(hasMore).toBe(true);
    expect(account.canLoadMore).toBe(true);

    vi.mocked(api.fetchTransactions).mockResolvedValue([]);
    const hasNoMore = await account.fetchMoreTransactions(addr);
    expect(hasNoMore).toBe(false);
    expect(account.canLoadMore).toBe(false);
  });

  it('should fetch a single transaction', async () => {
    const mockTx = {
      txid: 'single-tx',
      version: 1,
      locktime: 0,
      vin: [],
      vout: [{ value: 100000000, scriptpubkey_address: addr }],
      size: 100,
      weight: 400,
      fee: 1000,
      status: { confirmed: true, block_height: 100, block_time: Date.now() / 1000 }
    };
    vi.mocked(api.fetchTransaction).mockResolvedValue(mockTx as any);

    const account = useAccountStore();
    const tx = await account.fetchTransaction('single-tx', addr);

    expect(tx.txid).toBe('single-tx');
    expect(tx).toBeInstanceOf(Transaction);
  });

  it('should reset all state', () => {
    const account = useAccountStore();
    account.balance = 5;
    account.spendableBalance = 4;
    account.transactions = [{ txid: 'x' } as any];
    account.canLoadMore = false;

    account.reset();

    expect(account.balance).toBe(0);
    expect(account.spendableBalance).toBe(0);
    expect(account.transactions).toHaveLength(0);
    expect(account.canLoadMore).toBe(true);
  });
});
