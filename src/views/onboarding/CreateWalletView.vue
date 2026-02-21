<script setup lang="ts">
import { computed } from 'vue';
import { useApp } from '@/composables/useApp';
import { useCreateWallet } from '@/composables/useCreateWallet';
import { useForm, usePasswordBlur } from '@/utils/form';
import { UX_DELAY_SLOW } from '@/utils/constants';

const { router } = useApp();
const { step, mnemonic, confirmedSeed, prepareMnemonic, createWallet, backToPassword } =
  useCreateWallet();

const form = useForm({
  password: '',
  confirmPassword: ''
});

const { onBlurPassword, onBlurConfirmPassword } = usePasswordBlur(form);

const canProceed = computed(() => {
  return form.password && form.confirmPassword && !form.hasError();
});

function handleNextToSeed() {
  const result = prepareMnemonic(form.password, form.confirmPassword);

  if (!result.success && result.errors) {
    if (result.errors.password) form.setError('password', result.errors.password);
    if (result.errors.confirmPassword)
      form.setError('confirmPassword', result.errors.confirmPassword);
    return;
  }

  form.clearError();
}

async function handleCreate() {
  form.isProcessing = true;
  try {
    await createWallet(form.password);
    router.push('/dashboard');
  } catch (e: any) {
    form.setError('general', e.message || 'Failed to create wallet');
  } finally {
    form.isProcessing = false;
  }
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader
        title="Create wallet"
        :onBack="step === 2 ? backToPassword : undefined"
        :backTo="step === 1 ? '/' : undefined"
      />
    </template>

    <!-- Step 1: Password -->
    <div v-if="step === 1" class="flex flex-1 flex-col pt-0">
      <PepForm
        id="create-wallet-password-form"
        @submit="handleNextToSeed"
        class="flex flex-1 flex-col"
      >
        <div class="space-y-2 text-sm text-slate-400">
          <p>Set a password to protect your wallet.</p>
          <p>This password is used to encrypt your secret phrase locally.</p>
        </div>

        <PepPasswordFields
          v-model:password="form.password"
          v-model:confirmPassword="form.confirmPassword"
          :errors="form.errors"
          @blur-password="onBlurPassword"
          @blur-confirm="onBlurConfirmPassword"
        />
      </PepForm>
    </div>

    <!-- Step 2: Show Seed -->
    <div v-if="step === 2" class="flex flex-1 flex-col pt-0">
      <PepForm
        id="create-wallet-confirm-form"
        :loading="form.isProcessing"
        @submit="handleCreate"
        class="flex flex-1 flex-col"
      >
        <div class="space-y-2 pb-0 text-sm text-slate-400">
          <p class="text-offwhite font-bold">Write down your secret phrase</p>
          <p>
            This phrase is the ONLY way to recover your wallet if you lose your device or password.
          </p>
        </div>

        <PepMnemonicGrid :mnemonic="mnemonic" />

        <div class="pt-0">
          <PepCheckbox
            v-model="confirmedSeed"
            id="confirm-seed"
            label="I have written down my secret phrase and stored it in a safe place."
            :disabled="form.isProcessing"
          />
        </div>

        <p v-if="form.errors.general" class="mt-0 text-sm text-red-400">
          {{ form.errors.general }}
        </p>
      </PepForm>
    </div>

    <template #actions>
      <PepButton
        v-if="step === 1"
        type="submit"
        form="create-wallet-password-form"
        :disabled="!canProceed"
        class="w-full"
      >
        Next
      </PepButton>

      <PepLoadingButton
        v-if="step === 2"
        type="submit"
        form="create-wallet-confirm-form"
        :loading="form.isProcessing"
        :min-loading-ms="UX_DELAY_SLOW"
        :disabled="!confirmedSeed"
        class="w-full"
      >
        Create wallet
      </PepLoadingButton>
    </template>
  </PepMainLayout>
</template>
