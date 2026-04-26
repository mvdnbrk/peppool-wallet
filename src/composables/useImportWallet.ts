import { ref, computed, onMounted } from 'vue';
import { useApp } from '@/composables/useApp';
import { useSessionDraft } from '@/composables/useSessionDraft';
import { validateMnemonic, getInvalidMnemonicWords } from '@/utils/crypto';
import { validatePasswordMatch } from '@/utils/form';

const DRAFT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useImportWallet() {
  const { wallet: walletStore } = useApp();

  const mnemonic = ref('');

  function sanitizeMnemonic() {
    mnemonic.value = mnemonic.value.replace(/,/g, ' ').replace(/\s+/g, ' ');
  }

  const invalidWords = computed(() => {
    if (!mnemonic.value) return [];
    return getInvalidMnemonicWords(mnemonic.value);
  });

  const isValid = computed(() => {
    const clean = mnemonic.value.trim().toLowerCase();
    return !!clean && invalidWords.value.length === 0 && validateMnemonic(clean);
  });

  const draft = useSessionDraft({
    key: 'import_draft',
    source: () => ({ mnemonic: mnemonic.value }),
    ttlMs: DRAFT_TTL_MS
  });

  onMounted(async () => {
    const data = await draft.load();
    if (data?.mnemonic) mnemonic.value = data.mnemonic;
  });

  async function importAction(password: string, confirmPassword: string) {
    const normalizedMnemonic = mnemonic.value.trim().toLowerCase();
    mnemonic.value = normalizedMnemonic;

    if (!validateMnemonic(normalizedMnemonic)) {
      throw new Error('Invalid secret phrase');
    }

    const passwordErrors = validatePasswordMatch(password, confirmPassword);
    if (passwordErrors.password) throw new Error(passwordErrors.password);
    if (passwordErrors.confirmPassword) throw new Error(passwordErrors.confirmPassword);

    await walletStore.importWallet(normalizedMnemonic, password);
    await draft.clear();
    return true;
  }

  return {
    mnemonic,
    invalidWords,
    isValid,
    importAction,
    sanitizeMnemonic
  };
}
