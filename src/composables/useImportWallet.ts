import { ref, computed, watch, onMounted } from 'vue';
import { useApp } from '@/composables/useApp';
import { validateMnemonic, getInvalidMnemonicWords } from '@/utils/crypto';
import { validatePasswordMatch } from '@/utils/form';

const SESSION_KEY = 'import_draft_mnemonic';
const SESSION_TS_KEY = 'import_draft_ts';
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

  // Persistence logic
  onMounted(async () => {
    if (chrome?.storage?.session) {
      const data = await chrome.storage.session.get([SESSION_KEY, SESSION_TS_KEY]);
      const savedAt = Number(data[SESSION_TS_KEY]) || 0;
      if (data[SESSION_KEY] && Date.now() - savedAt < DRAFT_TTL_MS) {
        mnemonic.value = String(data[SESSION_KEY]);
      } else {
        clearSessionDraft();
      }
    }
  });

  watch(mnemonic, (val) => {
    if (chrome?.storage?.session) {
      chrome.storage.session.set({
        [SESSION_KEY]: val,
        [SESSION_TS_KEY]: Date.now()
      });
    }
  });

  function clearSessionDraft() {
    if (chrome?.storage?.session) {
      chrome.storage.session.remove([SESSION_KEY, SESSION_TS_KEY]);
    }
  }

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
    clearSessionDraft();
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
