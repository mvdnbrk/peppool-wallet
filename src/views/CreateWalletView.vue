<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import { generateMnemonic } from '../utils/crypto';
import { useForm, validatePasswordMatch, usePasswordBlur } from '../utils/form';
import { MIN_PASSWORD_LENGTH } from '../utils/constants';

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
  <div class="flex flex-col min-h-full p-6 relative">
    <PepHeader
      title="Create wallet"
      :onBack="step === 2 ? () => step = 1 : undefined"
      :absolute="false"
    />

    <!-- Step 1: Password -->
    <div v-if="step === 1" class="flex-1 flex flex-col pt-4">
      <div class="space-y-8 flex-1">
        <div class="text-slate-400 text-sm space-y-2">
          <p>Set a password to protect your wallet.</p>
          <p>This password is used to encrypt your secret phrase locally.</p>
        </div>

        <div class="space-y-6">
          <PepInput
            v-model="form.password"
            id="new-password"
            type="password"
            label="New password"
            :placeholder="`Min. ${MIN_PASSWORD_LENGTH} characters`"
            :error="form.errors.password"
            @blur="onBlurPassword"
          />

          <PepInput
            v-model="form.confirmPassword"
            id="confirm-password"
            type="password"
            label="Confirm password"
            placeholder="Repeat password"
            :error="form.errors.confirmPassword"
            @blur="onBlurConfirmPassword"
          />
        </div>
      </div>

      <div class="pt-6">
        <PepButton @click="handleNextToSeed" :disabled="!form.password || !form.confirmPassword || form.hasError()" class="w-full">
          Next
        </PepButton>
      </div>
    </div>

    <!-- Step 2: Show Seed -->
    <div v-if="step === 2" class="flex-1 flex flex-col pt-4">
      <div class="space-y-6 flex-1">
        <div class="text-slate-400 text-sm space-y-2">
          <p class="font-bold text-white">Write down your secret phrase</p>
          <p>This phrase is the ONLY way to recover your wallet if you lose your device or password.</p>
        </div>

        <PepMnemonicGrid :mnemonic="mnemonic" />

        <div class="pt-2">
          <PepCheckbox
            v-model="confirmedSeed"
            id="confirm-seed"
            label="I have written down my secret phrase and stored it in a safe place."
          />
        </div>

        <p v-if="form.errors.general" class="mt-2 text-sm text-red-400">{{ form.errors.general }}</p>
      </div>

      <div class="pt-6">
        <PepButton @click="handleCreate" :loading="form.isProcessing" :disabled="!confirmedSeed" class="w-full">
          Create wallet
        </PepButton>
      </div>
    </div>
  </div>
</template>
