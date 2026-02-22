import { ref, onScopeDispose } from 'vue';
import { useApp } from '@/composables/useApp';
import { decrypt } from '@/utils/encryption';

export function useShowMnemonic() {
  const { wallet: walletStore } = useApp();

  const step = ref(1); // 1: Password, 2: Show
  const mnemonic = ref('');
  const error = ref('');

  onScopeDispose(() => {
    mnemonic.value = '';
  });

  async function reveal(password: string) {
    if (!password) return false;
    try {
      const success = await walletStore.unlock(password);
      if (!success) {
        error.value = 'Incorrect password';
        return false;
      }

      if (walletStore.plaintextMnemonic) {
        mnemonic.value = walletStore.plaintextMnemonic;
      } else {
        mnemonic.value = await decrypt(walletStore.encryptedMnemonic!, password);
      }

      step.value = 2;
      return true;
    } catch (e) {
      error.value = 'Incorrect password';
      return false;
    }
  }

  return {
    step,
    mnemonic,
    error,
    reveal
  };
}
