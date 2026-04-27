import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import { useSession } from './useSession';

vi.mock('@/utils/encryption', () => ({
  importKey: vi.fn(() => Promise.resolve({ type: 'secret' } as CryptoKey)),
  decryptWithKey: vi.fn(() => Promise.resolve('test mnemonic'))
}));

import { decryptWithKey } from '@/utils/encryption';

function makeSession(initialMnemonic: string | null = 'pbkdf2:vault') {
  const encryptedMnemonic = ref<string | null>(initialMnemonic);
  const session = useSession({
    encryptedMnemonic,
    getLockDuration: () => 15
  });
  return { session, encryptedMnemonic };
}

describe('useSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('cacheKeyBytes', () => {
    it('persists key as hex to chrome.storage.session and zeros input', async () => {
      const { session } = makeSession();
      const bytes = new Uint8Array([0x0a, 0xff, 0x10]);

      await session.cacheKeyBytes(bytes);

      expect(chrome.storage.session.set).toHaveBeenCalledWith({ dataKey: '0aff10' });
      expect(session.hasSessionKey.value).toBe(true);
      // Input bytes wiped — prevents the raw key from lingering on the heap
      expect(Array.from(bytes)).toEqual([0, 0, 0]);
    });
  });

  describe('checkSession', () => {
    it('returns false when chrome.storage has no session data', async () => {
      vi.mocked(chrome.storage.session.get).mockResolvedValueOnce({});
      const { session } = makeSession();

      const result = await session.checkSession();

      expect(result).toBe(false);
      expect(session.isUnlocked.value).toBe(false);
    });

    it('clears entire session and returns false when expired', async () => {
      // sessionStartTime older than 15 minutes
      const expiredStart = Date.now() - 16 * 60 * 1000;
      vi.mocked(chrome.storage.session.get).mockResolvedValueOnce({
        sessionStartTime: expiredStart,
        dataKey: 'aabb'
      });
      const { session } = makeSession();

      const result = await session.checkSession();

      expect(result).toBe(false);
      // Expiry wipes everything in session storage, not just key/timestamp —
      // form drafts belong to the same session as the auth key.
      expect(chrome.storage.session.clear).toHaveBeenCalled();
    });

    it('restores session when within lock duration', async () => {
      vi.mocked(chrome.storage.session.get).mockResolvedValueOnce({
        sessionStartTime: Date.now(),
        dataKey: '0102030405060708091011121314151617181920212223242526272829303132'
      });
      const { session } = makeSession();

      const result = await session.checkSession();

      expect(result).toBe(true);
      expect(session.isUnlocked.value).toBe(true);
      expect(session.hasSessionKey.value).toBe(true);
    });
  });

  describe('resetLockTimer', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('no-ops when wallet is locked', async () => {
      const { session } = makeSession();

      await session.resetLockTimer();

      expect(chrome.storage.session.set).not.toHaveBeenCalledWith(
        expect.objectContaining({ sessionStartTime: expect.any(Number) })
      );
    });

    it('schedules lock after lockDuration when unlocked', async () => {
      const { session } = makeSession();
      session.markUnlocked();

      await session.resetLockTimer();
      expect(session.isUnlocked.value).toBe(true);

      vi.advanceTimersByTime(14 * 60 * 1000);
      expect(session.isUnlocked.value).toBe(true);

      vi.advanceTimersByTime(2 * 60 * 1000);
      // setTimeout fires lock() which is async — flush microtasks
      await vi.runOnlyPendingTimersAsync();
      expect(session.isUnlocked.value).toBe(false);
    });

    it('debouncedResetLockTimer skips while debounce is active', async () => {
      const { session } = makeSession();
      session.markUnlocked();

      await session.debouncedResetLockTimer();
      vi.mocked(chrome.storage.session.set).mockClear();

      // Second call within debounce window should be a no-op
      await session.debouncedResetLockTimer();
      expect(chrome.storage.session.set).not.toHaveBeenCalled();

      // After debounce window, calls go through again
      vi.advanceTimersByTime(1100);
      await session.debouncedResetLockTimer();
      expect(chrome.storage.session.set).toHaveBeenCalled();
    });
  });

  describe('withMnemonic', () => {
    it('throws when sessionKey not loaded', async () => {
      const { session } = makeSession();
      await expect(session.withMnemonic((m) => m)).rejects.toThrow('Wallet is locked');
    });

    it('throws when encryptedMnemonic is null', async () => {
      const { session } = makeSession(null);
      await session.cacheKeyBytes(new Uint8Array(32));
      await expect(session.withMnemonic((m) => m)).rejects.toThrow('Wallet is locked');
    });

    it('decrypts and runs callback with mnemonic when unlocked', async () => {
      const { session } = makeSession();
      await session.cacheKeyBytes(new Uint8Array(32));

      const result = await session.withMnemonic((m) => m.toUpperCase());

      expect(decryptWithKey).toHaveBeenCalled();
      expect(result).toBe('TEST MNEMONIC');
    });
  });

  describe('lock', () => {
    it('clears session storage, state, and resets flags', async () => {
      const { session } = makeSession();
      await session.cacheKeyBytes(new Uint8Array(32));
      session.markUnlocked();

      await session.lock();

      expect(session.isUnlocked.value).toBe(false);
      expect(session.hasSessionKey.value).toBe(false);
      // Full clear, not selective remove — drafts and any other session-scoped
      // state die with the auth session.
      expect(chrome.storage.session.clear).toHaveBeenCalled();
    });

    it('subsequent withMnemonic throws after lock', async () => {
      const { session } = makeSession();
      await session.cacheKeyBytes(new Uint8Array(32));
      session.markUnlocked();

      await session.lock();

      await expect(session.withMnemonic((m) => m)).rejects.toThrow('Wallet is locked');
    });
  });

  describe('markUnlocked', () => {
    it('flips isUnlocked to true', () => {
      const { session } = makeSession();
      expect(session.isUnlocked.value).toBe(false);

      session.markUnlocked();

      expect(session.isUnlocked.value).toBe(true);
    });
  });
});
