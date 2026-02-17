import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWalletStore } from './wallet';

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

  it('should trigger lock after timeout', () => {
    vi.useFakeTimers();
    const store = useWalletStore();
    store.isUnlocked = true;
    store.setLockDuration(15);
    store.resetLockTimer();

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
});
