import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWalletStore } from './wallet';
import { resetSettingsState } from '@/utils/settings';

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
  encrypt: vi.fn(() => Promise.resolve('pbkdf2:vault')),
  decrypt: vi.fn(() => Promise.resolve('mnemonic')),
  deriveKeyBytes: vi.fn(() => Promise.resolve(new Uint8Array(32))),
  extractSalt: vi.fn(() => new Uint8Array(16)),
  importKey: vi.fn(() => Promise.resolve({ type: 'secret' } as CryptoKey)),
  decryptWithKey: vi.fn(() => Promise.resolve('mnemonic'))
}));

// Mock API
vi.mock('../utils/api', () => ({
  fetchAddressInfo: vi.fn(() => Promise.resolve(0)),
  fetchTransactions: vi.fn(() => Promise.resolve([])),
  hasAddressActivity: vi.fn(() => Promise.resolve(false)),
  fetchPepPrice: vi.fn(() => Promise.resolve({ USD: 0, EUR: 0 })),
  fetchTipHeight: vi.fn(() => Promise.resolve(0))
}));

describe('Wallet Lock vs Reset Behavior', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    resetSettingsState();
    vi.clearAllMocks();
  });

  it('lock() should clear sensitive state but keep the wallet', async () => {
    const store = useWalletStore();

    // 1. Setup a wallet and some mock session data
    await store.importWallet('mnemonic', 'password');
    localStorage.setItem('peppool_transactions', '[{"txid":"1"}]');

    expect(store.isUnlocked).toBe(true);
    expect(store.encryptedMnemonic).toBe('pbkdf2:vault');
    expect(store.address).toBe('Paddress');

    // 2. Perform lock
    await store.lock();

    // CHECK: Still has the wallet
    expect(store.isCreated).toBe(true);
    expect(store.encryptedMnemonic).toBe('pbkdf2:vault');
    expect(store.address).toBe('Paddress');

    // CHECK: Session data is cleared
    expect(store.isUnlocked).toBe(false);
    expect(store.isMnemonicLoaded).toBe(false);
    expect(localStorage.getItem('peppool_transactions')).toBeNull();

    // CHECK: Form drafts wiped from chrome.storage.session for privacy
    expect(chrome.storage.session.remove).toHaveBeenCalledWith([
      'sessionStartTime',
      'dataKey',
      'send_draft',
      'import_draft_mnemonic',
      'import_draft_ts'
    ]);
  });

  it('resetWallet() should wipe EVERYTHING', async () => {
    const store = useWalletStore();

    // 1. Setup a wallet and some mock session data
    await store.importWallet('mnemonic', 'password');
    localStorage.setItem('peppool_transactions', '[{"txid":"1"}]');

    expect(store.isCreated).toBe(true);

    // 2. Perform reset
    await store.resetWallet();

    // CHECK: Wallet is completely gone
    expect(store.isCreated).toBe(false);
    expect(store.encryptedMnemonic).toBeNull();
    expect(store.address).toBeNull();
    expect(store.accounts).toHaveLength(0);

    // CHECK: Cache is wiped
    expect(localStorage.getItem('peppool_transactions')).toBeNull();

    // CHECK: Settings wiped from chrome.storage.local
    expect(chrome.storage.local.remove).toHaveBeenCalledWith([
      'peppool_settings',
      'peppool_accounts',
      'peppool_active_account'
    ]);
  });
});
