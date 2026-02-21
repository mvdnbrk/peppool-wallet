import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateWallet } from './useCreateWallet';
import { useApp } from '@/composables/useApp';
import * as crypto from '@/utils/crypto';

// Mock dependencies
vi.mock('@/composables/useApp');
vi.mock('@/utils/crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/crypto')>();
  return {
    ...actual,
    generateMnemonic: vi.fn().mockReturnValue('test mnemonic')
  };
});

describe('useCreateWallet Composable', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      importWallet: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      wallet: mockWallet
    } as any);
  });

  it('should initialize with step 1 and empty mnemonic', () => {
    const { step, mnemonic, confirmedSeed } = useCreateWallet();
    expect(step.value).toBe(1);
    expect(mnemonic.value).toBe('');
    expect(confirmedSeed.value).toBe(false);
  });

  it('should generate mnemonic and move to step 2 when password is valid', () => {
    const { step, mnemonic, prepareMnemonic } = useCreateWallet();
    const result = prepareMnemonic('Password123!', 'Password123!');

    expect(result.success).toBe(true);
    expect(mnemonic.value).toBe('test mnemonic');
    expect(step.value).toBe(2);
  });

  it('should return errors and stay on step 1 when passwords do not match', () => {
    const { step, prepareMnemonic } = useCreateWallet();
    const result = prepareMnemonic('Password123!', 'Mismatch!');

    expect(result.success).toBe(false);
    expect(result.errors?.confirmPassword).toBe('Passwords do not match');
    expect(step.value).toBe(1);
  });

  it('should call importWallet when creating wallet', async () => {
    const { mnemonic, confirmedSeed, prepareMnemonic, createWallet } = useCreateWallet();
    prepareMnemonic('Password123!', 'Password123!');
    confirmedSeed.value = true;

    await createWallet('Password123!');

    expect(mockWallet.importWallet).toHaveBeenCalledWith('test mnemonic', 'Password123!');
  });

  it('should throw error if backup is not confirmed', async () => {
    const { createWallet } = useCreateWallet();
    await expect(createWallet('pwd')).rejects.toThrow('Please confirm backup');
  });

  it('should move back to step 1', () => {
    const { step, backToPassword } = useCreateWallet();
    step.value = 2;
    backToPassword();
    expect(step.value).toBe(1);
  });
});
