import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLockoutStore } from './lockout';
import { useWalletStore } from './wallet';

// Mock crypto
vi.mock('../utils/crypto', () => ({
  generateMnemonic: vi.fn(() => 'test mnemonic'),
  deriveAddress: vi.fn(() => 'Paddress'),
  isValidAddress: vi.fn(() => true)
}));

// Mock encryption
vi.mock('../utils/encryption', () => ({
  encrypt: vi.fn(() => Promise.resolve('vault')),
  decrypt: vi.fn((v, p) =>
    p === 'correct' ? Promise.resolve('mnemonic') : Promise.reject(new Error('fail'))
  ),
  isLegacyVault: vi.fn(() => false)
}));

// Mock API
vi.mock('../utils/api', () => ({
  fetchAddressInfo: vi.fn(() => Promise.resolve(0)),
  fetchTransactions: vi.fn(() => Promise.resolve([])),
  fetchPepPrice: vi.fn(() => Promise.resolve({ USD: 0, EUR: 0 })),
  fetchTipHeight: vi.fn(() => Promise.resolve(0))
}));

describe('Lockout Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should start with 0 failures and not locked', () => {
    const store = useLockoutStore();
    expect(store.failedAttempts).toBe(0);
    expect(store.isLockedOut).toBe(false);
  });

  it('should increment failures and lock after 5 attempts', async () => {
    const store = useLockoutStore();

    for (let i = 1; i <= 5; i++) {
      await store.recordFailure();
      expect(store.failedAttempts).toBe(i);
    }

    expect(store.isLockedOut).toBe(true);
    expect(store.lockoutUntil).toBeGreaterThan(Date.now());
  });

  it('should increase lockout duration exponentially', async () => {
    const store = useLockoutStore();

    // First lockout (5 failures) -> 30s
    for (let i = 0; i < 5; i++) await store.recordFailure();
    const firstLock = store.lockoutUntil - Date.now();
    expect(firstLock).toBeGreaterThan(25000);
    expect(firstLock).toBeLessThan(35000);

    // Second lockout (6 failures) -> 5 mins (300s) based on current implementation
    await store.recordFailure();
    const secondLock = store.lockoutUntil - Date.now();
    expect(secondLock).toBeGreaterThan(290000);
    expect(secondLock).toBeLessThan(310000);
  });

  it('should check if currently locked out', async () => {
    const store = useLockoutStore();
    expect(store.checkLocked()).toBe(false);

    for (let i = 0; i < 5; i++) await store.recordFailure();
    expect(store.checkLocked()).toBe(true);
  });

  it('should reset failures on success', async () => {
    const store = useLockoutStore();
    await store.recordFailure();
    expect(store.failedAttempts).toBe(1);

    await store.reset();
    expect(store.failedAttempts).toBe(0);
  });

  it('should persist state to chrome.storage.local', async () => {
    const store = useLockoutStore();
    await store.recordFailure();

    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        peppool_failed_attempts: 1
      })
    );
  });

  it('should wipe wallet after 12 consecutive failures', async () => {
    vi.useFakeTimers();
    const store = useWalletStore();
    const lockout = useLockoutStore();

    // Setup a wallet
    await store.importWallet('mnemonic', 'correct');
    expect(store.isCreated).toBe(true);
    expect(store.address).toBe('Paddress');

    // 12 failures
    for (let i = 0; i < 12; i++) {
      // Advance time to bypass any existing lockout
      vi.advanceTimersByTime(31 * 60 * 1000);
      await store.unlock('wrong');
    }

    expect(store.encryptedMnemonic).toBeNull();
    expect(store.address).toBeNull();
    expect(lockout.failedAttempts).toBe(0);
    vi.useRealTimers();
  });
});
