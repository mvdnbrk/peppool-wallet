import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWalletStore } from './wallet';

// Mock crypto
vi.mock('../utils/crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/crypto')>();
  return {
    ...actual,
    generateMnemonic: vi.fn(() => 'test mnemonic'),
    deriveAddress: vi.fn(() => 'Paddress')
  };
});

// Mock encryption
vi.mock('../utils/encryption', () => ({
  encrypt: vi.fn(() => Promise.resolve('vault')),
  decrypt: vi.fn(() => Promise.resolve('mnemonic')),
  isLegacyVault: vi.fn(() => false)
}));

// Mock API
vi.mock('../utils/api', () => ({
  fetchAddressInfo: vi.fn(() => Promise.resolve(0)),
  fetchTransactions: vi.fn(() => Promise.resolve([])),
  fetchPepPrice: vi.fn(() => Promise.resolve({ USD: 0, EUR: 0 })),
  fetchTipHeight: vi.fn(() => Promise.resolve(0))
}));

describe('Wallet Lock vs Reset Behavior', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('lock() should clear sensitive state but keep the wallet', async () => {
    const store = useWalletStore();

    // 1. Setup a wallet and some mock session data
    await store.importWallet('mnemonic', 'password');
    localStorage.setItem('peppool_transactions', '[{"txid":"1"}]');
    localStorage.setItem('peppool_form_send', '{"recipient":"foo","amount":"10"}');

    expect(store.isUnlocked).toBe(true);
    expect(store.encryptedMnemonic).toBe('vault');
    expect(store.address).toBe('Paddress');

    // 2. Perform lock
    await store.lock();

    // CHECK: Still has the wallet
    expect(store.isCreated).toBe(true);
    expect(store.encryptedMnemonic).toBe('vault');
    expect(store.address).toBe('Paddress');

    // CHECK: Session data is cleared
    expect(store.isUnlocked).toBe(false);
    expect(store.plaintextMnemonic).toBeNull();
    expect(localStorage.getItem('peppool_transactions')).toBeNull();

    // CHECK: Form data is wiped for privacy
    expect(localStorage.getItem('peppool_form_send')).toBeNull();
  });

  it('resetWallet() should wipe EVERYTHING', async () => {
    const store = useWalletStore();

    // 1. Setup a wallet and some mock session data
    await store.importWallet('mnemonic', 'password');
    localStorage.setItem('peppool_transactions', '[{"txid":"1"}]');
    localStorage.setItem('peppool_currency', 'EUR');

    expect(store.isCreated).toBe(true);

    // 2. Perform reset
    store.resetWallet();

    // CHECK: Wallet is completely gone
    expect(store.isCreated).toBe(false);
    expect(store.encryptedMnemonic).toBeNull();
    expect(store.address).toBeNull();
    expect(store.accounts).toHaveLength(0);

    // CHECK: Even general settings are wiped
    expect(localStorage.getItem('peppool_currency')).toBeNull();
    expect(localStorage.getItem('peppool_transactions')).toBeNull();
  });
});
