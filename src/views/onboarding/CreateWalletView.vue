<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { generateMnemonic } from '@/utils/crypto';
import { useForm, validatePasswordMatch, usePasswordBlur } from '@/utils/form';
import PepPasswordFields from '@/components/ui/form/PepPasswordFields.vue';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';
import PepForm from '@/components/ui/form/PepForm.vue';
import { UX_DELAY_SLOW } from '@/utils/constants';

const router = useRouter();
const walletStore = useWalletStore();

const step = ref(1); // 1: Password, 2: Show Seed
const mnemonic = ref('');
const confirmedSeed = ref(false);

const form = useForm({
  password: '',
  confirmPassword: ''
});

const { onBlurPassword, onBlurConfirmPassword } = usePasswordBlur(form);

const canProceed = computed(() => {
  return form.password && form.confirmPassword && !form.hasError();
});

function handleNextToSeed() {
  const errors = validatePasswordMatch(form.password, form.confirmPassword);

  if (errors.password) {
    form.setError('password', errors.password);
    return;
  }

  if (errors.confirmPassword) {
    form.setError('confirmPassword', errors.confirmPassword);
    return;
  }

  mnemonic.value = generateMnemonic();
  form.clearError();
  step.value = 2;
}

async function handleCreate() {
  if (!confirmedSeed.value) {
    form.setError('general', 'Please confirm backup');
    return;
  }

  form.isProcessing = true;
  try {
    await walletStore.importWallet(mnemonic.value, form.password);
    router.push('/dashboard');
  } catch (e) {
    form.setError('general', 'Failed to create wallet');
    console.error('Failed to create wallet:', (e as Error).message);
  } finally {
    form.isProcessing = false;
  }
}
</script>

<template>
  <div class="relative flex min-h-full flex-col p-6">
    <PepPageHeader
      title="Create wallet"
      :onBack="step === 2 ? () => (step = 1) : undefined"
      :backTo="step === 1 ? '/' : undefined"
    />

    <!-- Step 1: Password -->
    <div v-if="step === 1" class="flex flex-1 flex-col pt-0">
      <PepForm @submit="handleNextToSeed" class="flex flex-1 flex-col">
        <div class="flex-1 space-y-8">
          <div class="space-y-2 text-sm text-slate-400">
            <p>Set a password to protect your wallet.</p>
            <p>This password is used to encrypt your secret phrase locally.</p>
          </div>

          <div class="space-y-6">
            <PepPasswordFields
              v-model:password="form.password"
              v-model:confirmPassword="form.confirmPassword"
              :errors="form.errors"
              @blur-password="onBlurPassword"
              @blur-confirm="onBlurConfirmPassword"
            />
          </div>
        </div>

        <template #actions>
          <PepButton type="submit" :disabled="!canProceed" class="w-full"> Next </PepButton>
        </template>
      </PepForm>
    </div>

    <!-- Step 2: Show Seed -->
    <div v-if="step === 2" class="flex flex-1 flex-col pt-0">
      <PepForm :loading="form.isProcessing" @submit="handleCreate" class="flex flex-1 flex-col">
        <div class="flex-1">
          <div class="space-y-2 pb-4 text-sm text-slate-400">
            <p class="text-offwhite font-bold">Write down your secret phrase</p>
            <p>
              This phrase is the ONLY way to recover your wallet if you lose your device or
              password.
            </p>
          </div>

          <PepMnemonicGrid :mnemonic="mnemonic" />

          <div class="pt-4">
            <PepCheckbox
              v-model="confirmedSeed"
              id="confirm-seed"
              label="I have written down my secret phrase and stored it in a safe place."
              :disabled="form.isProcessing"
            />
          </div>

          <p v-if="form.errors.general" class="mt-2 text-sm text-red-400">
            {{ form.errors.general }}
          </p>
        </div>

        <template #actions>
          <PepLoadingButton
            type="submit"
            :loading="form.isProcessing"
            :min-loading-ms="UX_DELAY_SLOW"
            :disabled="!confirmedSeed"
            class="w-full"
          >
            Create wallet
          </PepLoadingButton>
        </template>
      </PepForm>
    </div>
  </div>
</template>
