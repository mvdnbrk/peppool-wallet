import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChangePassword } from './useChangePassword';
import { useApp } from '@/composables/useApp';
import * as encryption from '@/utils/encryption';

// Mock dependencies
vi.mock('@/composables/useApp');
vi.mock('@/utils/encryption', () => ({
  encrypt: vi.fn(),
  decrypt: vi.fn()
}));

describe('useChangePassword Composable', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      unlock: vi.fn(),
      getMnemonic: vi.fn(() => Promise.resolve('test mnemonic')),
      updateVault: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      wallet: mockWallet
    } as any);
  });

  it('should successfully change password when all conditions are met', async () => {
    mockWallet.unlock.mockResolvedValue(true);
    vi.mocked(encryption.encrypt).mockResolvedValue('new-encrypted-mnemonic');

    const { isSuccess, performChange } = useChangePassword();
    const result = await performChange('old-pass', 'new-pass-12345678', 'new-pass-12345678');

    expect(result).toBe(true);
    expect(isSuccess.value).toBe(true);
    expect(mockWallet.unlock).toHaveBeenCalledWith('old-pass');
    expect(mockWallet.updateVault).toHaveBeenCalledWith('new-encrypted-mnemonic');
  });

  it('should throw error if passwords do not match', async () => {
    const { performChange } = useChangePassword();
    await expect(performChange('old', 'new-pass-123', 'mismatch')).rejects.toThrow(
      'Passwords do not match'
    );
  });

  it('should throw error if new password is same as old', async () => {
    const { performChange } = useChangePassword();
    await expect(performChange('same-pass', 'same-pass', 'same-pass')).rejects.toThrow(
      'Cannot use current password'
    );
  });

  it('should throw error if current password is incorrect', async () => {
    mockWallet.unlock.mockResolvedValue(false);
    const { performChange } = useChangePassword();
    await expect(performChange('wrong', 'new-pass-12345678', 'new-pass-12345678')).rejects.toThrow(
      'Incorrect current password'
    );
  });

  it('should throw error if mnemonic cannot be decrypted', async () => {
    mockWallet.unlock.mockResolvedValue(true);
    mockWallet.getMnemonic.mockRejectedValue(new Error('Wallet is locked'));
    const { performChange } = useChangePassword();
    await expect(performChange('old', 'new-pass-12345678', 'new-pass-12345678')).rejects.toThrow(
      'Wallet is locked'
    );
  });
});
