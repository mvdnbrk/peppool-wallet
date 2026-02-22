import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLockoutStore } from './lockout';
import { useWalletStore } from './wallet';

// Mock the API and Crypto utils
vi.mock('../utils/api', () => ({
  fetchAddressInfo: vi.fn(),
  fetchPepPrice: vi.fn(() => Promise.resolve({ USD: 0.5, EUR: 0.4 })),
  fetchTransactions: vi.fn(() => Promise.resolve([])),
  fetchRecommendedFees: vi.fn(),
  fetchTipHeight: vi.fn(() => Promise.resolve(1))
}));

// Mock Crypto logic
vi.mock('../utils/crypto', () => ({
  deriveAddress: vi.fn(() => 'correct-addr'),
  generateMnemonic: vi.fn(),
  validateMnemonic: vi.fn()
}));

// Mock encryption
vi.mock('../utils/encryption', () => ({
  encrypt: vi.fn(() => Promise.resolve('pbkdf2:upgraded-vault')),
  decrypt: vi.fn((_vault, password) => {
    if (password === 'correct') return Promise.resolve('mnemonic');
    return Promise.reject(new Error('Incorrect password'));
  }),
  isLegacyVault: vi.fn((vault: string) => !vault.startsWith('pbkdf2:'))
}));

describe('Lockout Store', () => {
  let store: ReturnType<typeof useLockoutStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    store = useLockoutStore();
  });

  it('should track failed attempts and lockout after 3 failures via wallet unlock', async () => {
    const wallet = useWalletStore();
    wallet.updateVault('vault');
    wallet.address = 'correct-addr';

    await wallet.unlock('w1');
    await wallet.unlock('w2');
    await wallet.unlock('w3');
    expect(store.isLockedOut).toBe(true);
  });

  it('should prevent unlock attempts during lockout', async () => {
    const wallet = useWalletStore();
    wallet.updateVault('vault');
    wallet.address = 'correct-addr';

    store.lockoutUntil = Date.now() + 10000;
    expect(store.isLockedOut).toBe(true);

    const result = await wallet.unlock('correct');
    expect(result).toBe(false);
    expect(wallet.isUnlocked).toBe(false);

    store.lockoutUntil = Date.now() - 1000;
    expect(store.isLockedOut).toBe(false);

    const finalResult = await wallet.unlock('correct');
    expect(finalResult).toBe(true);
    expect(wallet.isUnlocked).toBe(true);
  });

  it('should reset failed attempts if lockout period has passed', async () => {
    const wallet = useWalletStore();
    wallet.updateVault('vault');
    wallet.address = 'correct-addr';

    store.failedAttempts = 3;
    store.lockoutUntil = Date.now() - 1000;

    await wallet.unlock('wrong-again');

    expect(store.failedAttempts).toBe(1);
    expect(store.isLockedOut).toBe(false);
  });

  it('should escalate lockout duration at each tier', async () => {
    const wallet = useWalletStore();
    wallet.updateVault('vault');
    wallet.address = 'correct-addr';

    // Tier 1: 3 failures → 30s lockout
    for (let i = 0; i < 3; i++) await wallet.unlock('wrong');
    expect(store.isLockedOut).toBe(true);
    const tier1Duration = store.lockoutUntil - Date.now();
    expect(tier1Duration).toBeGreaterThan(28 * 1000);
    expect(tier1Duration).toBeLessThanOrEqual(30 * 1000);

    // Simulate reaching tier 2
    store.lockoutUntil = 0;
    store.failedAttempts = 5;
    await wallet.unlock('wrong');
    expect(store.failedAttempts).toBe(6);
    expect(store.isLockedOut).toBe(true);

    const tier2Duration = store.lockoutUntil - Date.now();
    expect(tier2Duration).toBeGreaterThan(4 * 60 * 1000);
  });

  it('should wipe wallet after 12 consecutive failures', async () => {
    const wallet = useWalletStore();
    wallet.updateVault('vault');
    wallet.address = 'correct-addr';

    store.failedAttempts = 11;
    store.lockoutUntil = 0;

    await wallet.unlock('wrong');

    expect(wallet.encryptedMnemonic).toBeNull();
    expect(wallet.address).toBeNull();
  });

  it('should reset state via reset()', async () => {
    store.failedAttempts = 5;
    store.lockoutUntil = Date.now() + 60000;

    await store.reset();

    expect(store.failedAttempts).toBe(0);
    expect(store.lockoutUntil).toBe(0);
    expect(store.isLockedOut).toBe(false);
  });

  it('should compute attemptsRemaining correctly', () => {
    store.failedAttempts = 0;
    expect(store.attemptsRemaining).toBe(3);

    store.failedAttempts = 2;
    expect(store.attemptsRemaining).toBe(1);

    store.failedAttempts = 3;
    expect(store.attemptsRemaining).toBe(3); // next tier is 6
  });
});
