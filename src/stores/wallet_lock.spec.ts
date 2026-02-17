import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWalletStore } from './wallet';

// Mock the API and Crypto utils
vi.mock('../utils/api', () => ({
  fetchAddressInfo: vi.fn(() => Promise.resolve(100000000)),
  fetchPepPrice: vi.fn(() => Promise.resolve({ USD: 0.5, EUR: 0.4 })),
  fetchTransactions: vi.fn(() => Promise.resolve([])),
  fetchRecommendedFees: vi.fn(() => Promise.resolve({ fastestFee: 1 })),
  fetchTipHeight: vi.fn(() => Promise.resolve(100))
}));

describe('Wallet Lock vs Reset Behavior', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('lock() should preserve the vault but clear sensitive memory', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    const originalAddress = store.address;
    const originalVault = localStorage.getItem('peppool_vault');

    expect(store.isUnlocked).toBe(true);
    expect(originalVault).not.toBeNull();

    // Perform LOCK
    await store.lock();

    // CHECK: Wallet still exists locally
    expect(store.address).toBe(originalAddress);
    expect(store.isCreated).toBe(true);
    expect(localStorage.getItem('peppool_vault')).toBe(originalVault);

    // CHECK: Memory/Session is cleared
    expect(store.isUnlocked).toBe(false);
    expect(store.plaintextMnemonic).toBeNull();
  });

  it('resetWallet() should wipe EVERYTHING', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    expect(store.isCreated).toBe(true);
    expect(localStorage.getItem('peppool_vault')).not.toBeNull();

    // Perform RESET
    store.resetWallet();

    // CHECK: No trace of the wallet remains
    expect(store.address).toBeNull();
    expect(store.isCreated).toBe(false);
    expect(store.isUnlocked).toBe(false);
    expect(localStorage.getItem('peppool_vault')).toBeNull();
    expect(localStorage.getItem('peppool_address')).toBeNull();
  });

  it('lock() should clear persisted form data', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    // Simulate some persisted form data
    localStorage.setItem('peppool_form_send', JSON.stringify({ recipient: 'foo', amount: '10' }));
    expect(localStorage.getItem('peppool_form_send')).not.toBeNull();

    // Perform LOCK
    await store.lock();

    // CHECK: Form data is wiped for privacy
    expect(localStorage.getItem('peppool_form_send')).toBeNull();
  });
});
