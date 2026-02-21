<script setup lang="ts">
import { computed, watch } from 'vue';
import { useApp } from '@/composables/useApp';
import { useImportWallet } from '@/composables/useImportWallet';
import { useForm, usePasswordBlur, useMnemonicField } from '@/utils/form';
import { validateMnemonic } from '@/utils/crypto';
import { UX_DELAY_SLOW } from '@/utils/constants';

const { router } = useApp();
const {
  mnemonic: mnemonicRef,
  invalidWords,
  isValid: isMnemonicValid,
  importAction,
  sanitizeMnemonic
} = useImportWallet();

const form = useForm({
  mnemonic: '',
  password: '',
  confirmPassword: ''
});

const { onBlurMnemonic } = useMnemonicField(form, validateMnemonic);
const { onBlurPassword, onBlurConfirmPassword } = usePasswordBlur(form);

// Sync form mnemonic with composable mnemonic
watch(
  mnemonicRef,
  (val) => {
    if (form.mnemonic !== val) form.mnemonic = val;
  },
  { immediate: true }
);

watch(
  () => form.mnemonic,
  (val) => {
    if (mnemonicRef.value !== val) {
      mnemonicRef.value = val;
      sanitizeMnemonic();
    }
  }
);

const canImport = computed(() => {
  return isMnemonicValid.value && form.password && form.confirmPassword && !form.hasError();
});

async function handleImport() {
  form.isProcessing = true;
  try {
    await importAction(form.password, form.confirmPassword);
    router.push('/dashboard');
  } catch (e: any) {
    form.setError('general', e.message || 'Failed to import wallet');
  } finally {
    form.isProcessing = false;
  }
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Import wallet" backTo="/" />
    </template>

    <PepForm
      id="import-wallet-form"
      :loading="form.isProcessing"
      @submit="handleImport"
      class="flex flex-1 flex-col"
    >
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
          <span class="font-semibold">{{ invalidWords[invalidWords.length - 1] }}</span> is not a
          valid seed phrase word
        </p>
      </PepInputGroup>

      <PepPasswordFields
        v-model:password="form.password"
        v-model:confirmPassword="form.confirmPassword"
        :errors="form.errors"
        @blur-password="onBlurPassword"
        @blur-confirm="onBlurConfirmPassword"
      />
    </PepForm>

    <template #actions>
      <PepLoadingButton
        type="submit"
        form="import-wallet-form"
        :loading="form.isProcessing"
        :min-loading-ms="UX_DELAY_SLOW"
        :disabled="!canImport"
        class="w-full"
      >
        Import wallet
      </PepLoadingButton>
    </template>
  </PepMainLayout>
</template>
