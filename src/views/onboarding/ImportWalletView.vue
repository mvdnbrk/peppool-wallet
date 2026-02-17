<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../../stores/wallet';
import { validateMnemonic, getInvalidMnemonicWords } from '../../utils/crypto';
import {
  useForm,
  validatePasswordMatch,
  usePasswordBlur,
  useMnemonicField
} from '../../utils/form';
import PepPasswordFields from '../../components/ui/PepPasswordFields.vue';
import PepLoadingButton from '../../components/ui/PepLoadingButton.vue';
import PepForm from '../../components/ui/PepForm.vue';
import { UX_DELAY_SLOW } from '../../utils/constants';
import { watch, computed, onMounted } from 'vue';

const router = useRouter();
const walletStore = useWalletStore();

const SESSION_KEY = 'import_draft_mnemonic';
const SESSION_TS_KEY = 'import_draft_ts';
const DRAFT_TTL_MS = 5 * 60 * 1000; // 5 minutes

const form = useForm({
  mnemonic: '',
  password: '',
  confirmPassword: ''
});

const invalidWords = computed(() => {
  if (!form.mnemonic) return [];
  return getInvalidMnemonicWords(form.mnemonic);
});

const { sanitizeMnemonic, onBlurMnemonic } = useMnemonicField(form, validateMnemonic);
const { onBlurPassword, onBlurConfirmPassword } = usePasswordBlur(form);

const canImport = computed(() => {
  const mnemonic = form.mnemonic.trim().toLowerCase();
  return (
    mnemonic &&
    form.password &&
    form.confirmPassword &&
    !form.hasError() &&
    invalidWords.value.length === 0 &&
    validateMnemonic(mnemonic)
  );
});

// Strip commas and normalize internal spacing while typing
watch(() => form.mnemonic, sanitizeMnemonic);

// Persist mnemonic to session storage (in-memory only, cleared on browser close)
watch(
  () => form.mnemonic,
  (val) => {
    if (chrome?.storage?.session) {
      chrome.storage.session.set({
        [SESSION_KEY]: val,
        [SESSION_TS_KEY]: Date.now()
      });
    }
  }
);

onMounted(async () => {
  if (chrome?.storage?.session) {
    const data = await chrome.storage.session.get([SESSION_KEY, SESSION_TS_KEY]);
    const savedAt = Number(data[SESSION_TS_KEY]) || 0;
    if (data[SESSION_KEY] && Date.now() - savedAt < DRAFT_TTL_MS) {
      form.mnemonic = data[SESSION_KEY];
    } else {
      clearSessionDraft();
    }
  }
});

function clearSessionDraft() {
  if (chrome?.storage?.session) {
    chrome.storage.session.remove([SESSION_KEY, SESSION_TS_KEY]);
  }
}

async function handleImport() {
  const normalizedMnemonic = form.mnemonic.trim().toLowerCase();
  form.mnemonic = normalizedMnemonic; // Update UI to reflect cleaned version

  if (!validateMnemonic(normalizedMnemonic)) {
    form.setError('mnemonic', 'Invalid secret phrase');
    return;
  }

  const errors = validatePasswordMatch(form.password, form.confirmPassword);

  if (errors.password) {
    form.setError('password', errors.password);
    return;
  }

  if (errors.confirmPassword) {
    form.setError('confirmPassword', errors.confirmPassword);
    return;
  }

  form.isProcessing = true;
  try {
    await walletStore.importWallet(normalizedMnemonic, form.password);
    clearSessionDraft();
    router.push('/dashboard');
  } catch (e) {
    form.setError('general', 'Failed to import wallet');
    console.error('Failed to import wallet:', (e as Error).message);
  } finally {
    form.isProcessing = false;
  }
}
</script>

<template>
  <div class="relative flex min-h-full flex-col p-6">
    <PepHeader title="Import wallet" backTo="/" :absolute="false" />

    <div class="flex flex-1 flex-col pt-4">
      <PepForm :loading="form.isProcessing" @submit="handleImport" class="flex flex-1 flex-col">
        <div class="flex-1 space-y-6 overflow-y-auto pr-2">
          <PepInputGroup
            label="Secret phrase (12 or 24 words)"
            id="mnemonic"
            :error="invalidWords.length > 0 ? '' : form.errors.mnemonic"
          >
            <textarea
              v-model="form.mnemonic"
              id="mnemonic"
              rows="3"
              placeholder="word1 word2 ..."
              :disabled="form.isProcessing"
              class="text-offwhite focus:outline-pep-green block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-white/10 transition-all placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              :class="{
                'outline-red-500/50 focus:outline-red-400':
                  form.errors.mnemonic && invalidWords.length === 0
              }"
              @blur="onBlurMnemonic"
            ></textarea>

            <p v-if="invalidWords.length > 0" class="mt-2 text-xs text-red-400">
              <span class="font-semibold">{{ invalidWords[invalidWords.length - 1] }}</span> is not
              a valid seed phrase word
            </p>
          </PepInputGroup>

          <PepPasswordFields
            v-model:password="form.password"
            v-model:confirmPassword="form.confirmPassword"
            :errors="form.errors"
            @blur-password="onBlurPassword"
            @blur-confirm="onBlurConfirmPassword"
          />
        </div>

        <template #actions>
          <PepLoadingButton
            type="submit"
            :loading="form.isProcessing"
            :min-loading-ms="UX_DELAY_SLOW"
            :disabled="!canImport"
            class="w-full"
          >
            Import wallet
          </PepLoadingButton>
        </template>
      </PepForm>
    </div>
  </div>
</template>
