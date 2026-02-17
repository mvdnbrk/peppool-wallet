import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
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

describe('Wallet Store - Lockout Logic', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should track failed attempts and lockout after 3 failures', async () => {
    const store = useWalletStore();
    store.updateVault('vault');
    store.address = 'correct-addr';

    await store.unlock('w1');
    await store.unlock('w2');
    await store.unlock('w3');
    expect(store.isLockedOut).toBe(true);
  });

  it('should prevent unlock attempts during lockout', async () => {
    const store = useWalletStore();
    store.updateVault('vault');
    store.address = 'correct-addr';

    // Manually set lockout in the past
    store.lockoutUntil = Date.now() + 10000;
    expect(store.isLockedOut).toBe(true);

    const result = await store.unlock('correct');
    expect(result).toBe(false);
    expect(store.isUnlocked).toBe(false);

    // Manually set lockout to be expired
    store.lockoutUntil = Date.now() - 1000;
    expect(store.isLockedOut).toBe(false);

    const finalResult = await store.unlock('correct');
    expect(finalResult).toBe(true);
    expect(store.isUnlocked).toBe(true);
  });

  it('should reset failed attempts if lockout period has passed', async () => {
    const store = useWalletStore();
    store.updateVault('vault');
    store.address = 'correct-addr';

    // Set 3 failures and an expired lockout
    store.failedAttempts = 3;
    store.lockoutUntil = Date.now() - 1000;

    // This call should trigger the auto-reset
    await store.unlock('wrong-again');

    // Counter should have been reset to 0 then incremented to 1 for this new failure
    expect(store.failedAttempts).toBe(1);
    expect(store.isLockedOut).toBe(false);
  });

  it('should escalate lockout duration at each tier', async () => {
    const store = useWalletStore();
    store.updateVault('vault');
    store.address = 'correct-addr';

    // Tier 1: 3 failures → 30s lockout
    for (let i = 0; i < 3; i++) await store.unlock('wrong');
    expect(store.isLockedOut).toBe(true);
    const tier1Duration = store.lockoutUntil - Date.now();
    // Should be ~30s (within 1s tolerance)
    expect(tier1Duration).toBeGreaterThan(28 * 1000);
    expect(tier1Duration).toBeLessThanOrEqual(30 * 1000);

    // Simulate reaching tier 2 by setting failedAttempts directly
    // (in practice the user would accumulate these across lockout resets)
    // Set lockoutUntil to 0 (cleared, not expired) so the auto-reset logic doesn't fire
    store.lockoutUntil = 0;
    store.failedAttempts = 5;
    await store.unlock('wrong'); // 6th failure
    expect(store.failedAttempts).toBe(6);
    expect(store.isLockedOut).toBe(true);

    // Tier 2 lockout should be ~5 minutes (longer than tier 1)
    const tier2Duration = store.lockoutUntil - Date.now();
    expect(tier2Duration).toBeGreaterThan(4 * 60 * 1000);
  });

  it('should wipe wallet after 12 consecutive failures', async () => {
    const store = useWalletStore();
    store.updateVault('vault');
    store.address = 'correct-addr';

    // Directly simulate 11 accumulated failures (lockoutUntil=0 avoids auto-reset)
    store.failedAttempts = 11;
    store.lockoutUntil = 0;

    // 12th failure triggers wipe
    await store.unlock('wrong');

    // Wallet should be wiped
    expect(store.encryptedMnemonic).toBeNull();
    expect(store.address).toBeNull();
  });
});
