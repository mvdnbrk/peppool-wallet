import { ref } from 'vue';
import { useApp } from '@/composables/useApp';
import { encrypt } from '@/utils/encryption';
import { validatePasswordMatch } from '@/utils/form';

export class ChangePasswordError extends Error {
  public field: 'oldPassword' | 'password' | 'general';

  constructor(field: 'oldPassword' | 'password' | 'general', message: string) {
    super(message);
    this.field = field;
    this.name = 'ChangePasswordError';
  }
}

export function useChangePassword() {
  const { wallet: walletStore } = useApp();
  const isSuccess = ref(false);

  async function performChange(oldPassword: string, newPassword: string, confirmPassword: string) {
    const passwordErrors = validatePasswordMatch(newPassword, confirmPassword);
    if (passwordErrors.password) {
      throw new ChangePasswordError(
        'password',
        passwordErrors.password.replace('Password', 'New password')
      );
    }
    if (passwordErrors.confirmPassword) {
      throw new ChangePasswordError('password', passwordErrors.confirmPassword);
    }

    if (newPassword === oldPassword) {
      throw new ChangePasswordError('password', 'Cannot use current password');
    }

    // Verify current password via unlock() — inherits escalating lockout
    const success = await walletStore.unlock(oldPassword);
    if (!success) {
      throw new ChangePasswordError('oldPassword', 'Incorrect current password');
    }

    // Re-encrypt with new password
    const mnemonic = walletStore.plaintextMnemonic;
    if (!mnemonic) {
      throw new ChangePasswordError('general', 'Could not access wallet data. Please try again.');
    }

    const newEncrypted = await encrypt(mnemonic, newPassword);
    walletStore.updateVault(newEncrypted);

    isSuccess.value = true;
    return true;
  }

  return {
    isSuccess,
    performChange
  };
}
