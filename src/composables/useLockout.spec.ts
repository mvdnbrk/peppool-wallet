import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLockout } from './useLockout';
import { useWalletStore } from '@/stores/wallet';
import { reactive, nextTick } from 'vue';

vi.unmock('@/composables/useLockout');

vi.mock('@/stores/wallet', () => ({
  useWalletStore: vi.fn()
}));

describe('useLockout Composable', () => {
  let mockStore: any;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1000000);

    mockStore = reactive({
      lockoutUntil: 0,
      isLockedOut: false
    });

    vi.mocked(useWalletStore).mockReturnValue(mockStore);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should reflect initial lockout state', () => {
    const { isLockedOut } = useLockout();
    expect(isLockedOut.value).toBe(false);
  });

  it('should show error when locked out', async () => {
    mockStore.isLockedOut = true;
    mockStore.lockoutUntil = 1010000;

    const { isLockedOut, lockoutError } = useLockout();

    expect(isLockedOut.value).toBe(true);
    expect(lockoutError.value).toContain('Locked for 10s');
  });

  it('should reflect store changes', async () => {
    const { isLockedOut } = useLockout();
    expect(isLockedOut.value).toBe(false);

    mockStore.isLockedOut = true;
    mockStore.lockoutUntil = 1010000;
    await nextTick();

    expect(isLockedOut.value).toBe(true);
  });

  it('should update countdown in lockoutError', async () => {
    mockStore.isLockedOut = true;
    mockStore.lockoutUntil = 1010000; // 10s from 1000000

    const { lockoutError } = useLockout();
    expect(lockoutError.value).toContain('10s');

    // Simulate update by changing store value
    mockStore.lockoutUntil = 1005000; // Now 5s left
    await nextTick();

    expect(lockoutError.value).toContain('5s');
  });
});
