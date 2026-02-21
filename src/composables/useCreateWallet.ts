import { ref } from 'vue';
import { useApp } from '@/composables/useApp';
import { generateMnemonic } from '@/utils/crypto';
import { validatePasswordMatch } from '@/utils/form';

export function useCreateWallet() {
  const { wallet: walletStore } = useApp();

  const step = ref(1); // 1: Password, 2: Show Seed
  const mnemonic = ref('');
  const confirmedSeed = ref(false);

  function prepareMnemonic(password: string, confirmPassword: string) {
    const errors = validatePasswordMatch(password, confirmPassword);
    if (errors.password || errors.confirmPassword) {
      return { success: false, errors };
    }

    mnemonic.value = generateMnemonic();
    step.value = 2;
    return { success: true };
  }

  async function createWallet(password: string) {
    if (!confirmedSeed.value) {
      throw new Error('Please confirm backup');
    }

    await walletStore.importWallet(mnemonic.value, password);
    return true;
  }

  function backToPassword() {
    step.value = 1;
  }

  return {
    step,
    mnemonic,
    confirmedSeed,
    prepareMnemonic,
    createWallet,
    backToPassword
  };
}
