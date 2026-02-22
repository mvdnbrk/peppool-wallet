import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWalletStore } from './wallet';

import { Transaction } from '../models/Transaction';

// Mock the API and Crypto utils
let tipHeight = 0;
vi.mock('../utils/api', () => ({
  fetchAddressInfo: vi.fn(() => Promise.resolve(100000000)),
  fetchPepPrice: vi.fn(() => Promise.resolve({ USD: 0.5, EUR: 0.4 })),
  fetchTransactions: vi.fn(() => Promise.resolve([])),
  fetchRecommendedFees: vi.fn(() =>
    Promise.resolve({ fastestFee: 1, halfHourFee: 1, hourFee: 1, economyFee: 1, minimumFee: 1 })
  ),
  fetchTipHeight: vi.fn(() => Promise.resolve(++tipHeight))
}));

describe('Wallet Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize as not created', () => {
    const store = useWalletStore();
    expect(store.isCreated).toBe(false);
    expect(store.isUnlocked).toBe(false);
    expect(store.canLoadMore).toBe(true);
  });

  it('should create a wallet and persist it', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    expect(store.isCreated).toBe(true);
    expect(store.isUnlocked).toBe(true);
    expect(store.address).not.toBeNull();
    expect(localStorage.getItem('peppool_vault')).not.toBeNull();
  });

  it('should unlock an existing wallet', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');
    const originalAddress = store.address;

    store.lock();
    expect(store.isUnlocked).toBe(false);

    const success = await store.unlock('password123');
    expect(success).toBe(true);
    expect(store.isUnlocked).toBe(true);
    expect(store.address).toBe(originalAddress);
  });

  it('should handle failed unlock and trigger lockout after 5 attempts', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');
    store.lock();

    // 5 attempts should trigger 30s lockout
    for (let i = 0; i < 5; i++) {
      const success = await store.unlock('wrong-pass');
      expect(success).toBe(false);
    }

    expect(store.isLockedOut).toBe(true);
    expect(store.lockoutUntil).toBeGreaterThan(Date.now());
  });

  it('should auto-unlock via checkSession if chrome.storage has mnemonic', async () => {
    localStorage.setItem('peppool_vault', 'any-vault');
    localStorage.setItem('peppool_address', 'any-addr');

    // Mock chrome.storage.local.get for session expiry
    (global.chrome.storage.local.get as any).mockResolvedValue({
      unlocked_until: Date.now() + 10000
    });

    // Mock chrome.storage.session.get
    (global.chrome.storage.session.get as any).mockResolvedValue({
      mnemonic: 'suffer dish east miss seat great brother hello motion mountain celery plunge'
    });

    const store = useWalletStore();
    const success = await store.checkSession();
    expect(success).toBe(true);
    expect(store.isUnlocked).toBe(true);
  });

  it('should import a wallet with a mnemonic', async () => {
    const store = useWalletStore();
    const mnemonic = 'suffer dish east miss seat great brother hello motion mountain celery plunge';
    await store.importWallet(mnemonic, 'newpassword');

    expect(store.isCreated).toBe(true);
    expect(store.isUnlocked).toBe(true);
    expect(store.address).toBe('PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');
  });

  it('should perform a full wallet reset', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    expect(store.isCreated).toBe(true);
    store.resetWallet();

    expect(store.address).toBeNull();
    expect(store.isCreated).toBe(false);
    expect(localStorage.getItem('peppool_vault')).toBeNull();
  });

  it('should handle currency changes correctly', () => {
    const store = useWalletStore();
    expect(store.selectedCurrency).toBe('USD');

    store.setCurrency('EUR');
    expect(store.selectedCurrency).toBe('EUR');
    expect(store.currencySymbol).toBe('€');
    expect(localStorage.getItem('peppool_currency')).toBe('EUR');
  });

  it('should handle explorer changes correctly', () => {
    const store = useWalletStore();
    expect(store.selectedExplorer).toBe('peppool');

    store.setExplorer('pepeblocks');
    expect(store.selectedExplorer).toBe('pepeblocks');
    expect(localStorage.getItem('peppool_explorer')).toBe('pepeblocks');
  });

  it('should open explorer links through actions', () => {
    const store = useWalletStore();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    store.openExplorerTx('tx123');
    expect(openSpy).toHaveBeenCalledWith('https://peppool.space/tx/tx123', '_blank');

    store.setExplorer('pepeblocks');
    store.openExplorerAddress('addr123');
    expect(openSpy).toHaveBeenCalledWith('https://pepeblocks.com/address/addr123', '_blank');

    openSpy.mockRestore();
  });

  it('should calculate fiat balance correctly', async () => {
    const store = useWalletStore();
    store.address = 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh';
    await store.refreshBalance();

    store.setCurrency('USD');
    expect(store.balanceFiat).toBe(0.5); // 1 PEP * 0.5 USD

    store.setCurrency('EUR');
    expect(store.balanceFiat).toBe(0.4); // 1 PEP * 0.4 EUR
  });

  it('should update and persist lock duration', () => {
    const store = useWalletStore();
    expect(store.lockDuration).toBe(15);

    store.setLockDuration(180);
    expect(store.lockDuration).toBe(180);
    expect(localStorage.getItem('peppool_lock_duration')).toBe('180');
  });

  it('should trigger lock after timeout', async () => {
    vi.useFakeTimers();
    const store = useWalletStore();
    store.isUnlocked = true;
    store.setLockDuration(15);
    await store.resetLockTimer();

    vi.advanceTimersByTime(14 * 60 * 1000);
    expect(store.isUnlocked).toBe(true);

    vi.advanceTimersByTime(2 * 60 * 1000);
    expect(store.isUnlocked).toBe(false);

    vi.useRealTimers();
  });

  it('cacheMnemonic should update the mnemonic in the store', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    // After creation, plaintextMnemonic should be set
    expect(store.plaintextMnemonic).not.toBeNull();
    const originalMnemonic = store.plaintextMnemonic;

    // Lock clears it
    store.lock();
    expect(store.plaintextMnemonic).toBeNull();

    // cacheMnemonic restores it
    store.cacheMnemonic(originalMnemonic!);
    expect(store.plaintextMnemonic).toBe(originalMnemonic);
  });

  it('plaintextMnemonic should be exposed as readonly', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    // Verify it's a Ref and contains a value
    expect(store.plaintextMnemonic).toBeTruthy();

    const original = store.plaintextMnemonic;

    // Direct assignment should be a no-op (readonly ref)
    // We expect a Vue warning in the console here, which is what we're testing.
    // To avoid polluting test logs, we can temporarily mock console.warn
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      (store as any).plaintextMnemonic = 'hacked';
    } catch {
      // Expected for readonly in some environments
    }

    // Should still be the original value, not 'hacked'
    expect(store.plaintextMnemonic).toBe(original);
    warnSpy.mockRestore();
  });

  describe('Transaction Caching', () => {
    const mockTx = {
      txid: 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3',
      version: 1,
      locktime: 0,
      vin: [],
      vout: [
        {
          value: 100000000,
          scriptpubkey: '',
          scriptpubkey_address: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh'
        }
      ],
      status: {
        confirmed: true,
        block_height: 100,
        block_hash: '...',
        block_time: Date.now() / 1000
      }
    };

    it('should cache transactions in localStorage when refreshed', async () => {
      const api = await import('../utils/api');
      vi.mocked(api.fetchTransactions).mockResolvedValue([mockTx] as any);

      const store = useWalletStore();
      store.address = 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh';
      await store.refreshTransactions();

      const cached = localStorage.getItem('peppool_transactions');
      expect(cached).not.toBeNull();
      expect(JSON.parse(cached!)).toHaveLength(1);
      expect(JSON.parse(cached!)[0].txid).toBe(mockTx.txid);
    });

    it('should restore transactions from cache on initialization', () => {
      localStorage.setItem('peppool_transactions', JSON.stringify([mockTx]));
      localStorage.setItem('peppool_address', 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');

      const store = useWalletStore();
      expect(store.transactions).toHaveLength(1);
      expect(store.transactions[0]!.txid).toBe(mockTx.txid);
    });

    it('should clear cached transactions on lock', async () => {
      localStorage.setItem('peppool_transactions', JSON.stringify([mockTx]));
      const store = useWalletStore();

      await store.lock();
      expect(localStorage.getItem('peppool_transactions')).toBeNull();
    });

    it('should clear cached transactions on resetWallet', () => {
      localStorage.setItem('peppool_transactions', JSON.stringify([mockTx]));
      const store = useWalletStore();

      store.resetWallet();
      expect(localStorage.getItem('peppool_transactions')).toBeNull();
    });

    it('should fetch more transactions and append them uniquely', async () => {
      const api = await import('../utils/api');
      const store = useWalletStore();
      store.address = 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh';

      // Setup initial transactions
      const tx1 = { ...mockTx, txid: 'tx1' };
      store.transactions = [new Transaction(tx1, store.address)];

      // Mock API to return a full page of transactions
      const fullPage = Array(25)
        .fill(null)
        .map((_, i) => ({ ...mockTx, txid: `page-${i}` }));
      vi.mocked(api.fetchTransactions).mockResolvedValue(fullPage as any);

      const hasMore = await store.fetchMoreTransactions();

      expect(hasMore).toBe(true);
      expect(store.canLoadMore).toBe(true);

      // Mock API to return nothing (end of list)
      vi.mocked(api.fetchTransactions).mockResolvedValue([]);
      const hasNoMore = await store.fetchMoreTransactions();
      expect(hasNoMore).toBe(false);
      expect(store.canLoadMore).toBe(false);
    });
  });
});
