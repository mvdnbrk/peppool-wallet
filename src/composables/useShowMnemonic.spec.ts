import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useShowMnemonic } from './useShowMnemonic';
import { useApp } from '@/composables/useApp';
import * as encryption from '@/utils/encryption';
import { defineComponent, createApp } from 'vue';

// Mock dependencies
vi.mock('@/composables/useApp');
vi.mock('@/utils/encryption', () => ({
  decrypt: vi.fn()
}));

// Helper to test composables that use lifecycle hooks
function withSetup<T>(composable: () => T): [T, ReturnType<typeof createApp>] {
  let result: T;
  const app = createApp(
    defineComponent({
      setup() {
        result = composable();
        return () => {};
      }
    })
  );
  app.mount(document.createElement('div'));
  return [result!, app];
}

describe('useShowMnemonic Composable', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      unlock: vi.fn(),
      plaintextMnemonic: 'test mnemonic',
      encryptedMnemonic: 'encrypted'
    };
    vi.mocked(useApp).mockReturnValue({
      wallet: mockWallet
    } as any);
  });

  it('should initialize with step 1 and empty mnemonic', () => {
    const [composable] = withSetup(() => useShowMnemonic());
    expect(composable.step.value).toBe(1);
    expect(composable.mnemonic.value).toBe('');
    expect(composable.error.value).toBe('');
  });

  it('should successfully reveal mnemonic when password is correct', async () => {
    mockWallet.unlock.mockResolvedValue(true);
    const [composable] = withSetup(() => useShowMnemonic());

    const result = await composable.reveal('correct-pass');

    expect(result).toBe(true);
    expect(composable.mnemonic.value).toBe('test mnemonic');
    expect(composable.step.value).toBe(2);
    expect(mockWallet.unlock).toHaveBeenCalledWith('correct-pass');
  });

  it('should use fallback decryption if plaintext is not in store', async () => {
    mockWallet.unlock.mockResolvedValue(true);
    mockWallet.plaintextMnemonic = null;
    vi.mocked(encryption.decrypt).mockResolvedValue('decrypted-fallback');

    const [composable] = withSetup(() => useShowMnemonic());
    await composable.reveal('correct-pass');

    expect(composable.mnemonic.value).toBe('decrypted-fallback');
    expect(encryption.decrypt).toHaveBeenCalledWith('encrypted', 'correct-pass');
  });

  it('should set error and return false when password is incorrect', async () => {
    mockWallet.unlock.mockResolvedValue(false);
    const [composable] = withSetup(() => useShowMnemonic());

    const result = await composable.reveal('wrong-pass');

    expect(result).toBe(false);
    expect(composable.error.value).toBe('Incorrect password');
    expect(composable.step.value).toBe(1);
  });

  it('should return false if password is empty', async () => {
    const [composable] = withSetup(() => useShowMnemonic());
    const result = await composable.reveal('');
    expect(result).toBe(false);
  });

  it('should handle unexpected errors during unlock', async () => {
    mockWallet.unlock.mockRejectedValue(new Error('Unexpected'));
    const [composable] = withSetup(() => useShowMnemonic());

    const result = await composable.reveal('any-pass');

    expect(result).toBe(false);
    expect(composable.error.value).toBe('Incorrect password');
  });

  it('should clear mnemonic on unmount', async () => {
    const [composable, app] = withSetup(() => useShowMnemonic());
    composable.mnemonic.value = 'sensitive data';

    app.unmount();

    expect(composable.mnemonic.value).toBe('');
  });
});
