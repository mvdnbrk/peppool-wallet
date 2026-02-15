<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import { validateMnemonic } from '../utils/crypto';
import { useForm } from '../utils/form';

const router = useRouter();
const walletStore = useWalletStore();

const form = useForm({
  mnemonic: '',
  password: '',
  confirmPassword: ''
});

async function handleImport() {
  const normalizedMnemonic = form.mnemonic
    .replace(/[,\s\n\r\t]+/g, ' ')
    .trim()
    .toLowerCase();

  if (!validateMnemonic(normalizedMnemonic)) {
    form.setError('general', 'Invalid secret phrase');
    return;
  }
  
  if (form.password.length < 8) {
    form.setError('general', 'Password must be at least 8 characters');
    return;
  }
  
  if (form.password !== form.confirmPassword) {
    form.setError('general', 'Passwords do not match');
    return;
  }

  form.isProcessing = true;
  try {
    await walletStore.importWallet(normalizedMnemonic, form.password);
    router.push('/dashboard');
  } catch (e) {
    form.setError('general', 'Failed to import wallet');
    console.error(e);
  } finally {
    form.isProcessing = false;
  }
}
</script>

<template>
  <div class="flex flex-col min-h-full p-6 relative">
    <PepHeader title="Import Wallet" :absolute="false" />

    <div class="flex-1 flex flex-col pt-4">
      <div class="space-y-6 flex-1 overflow-y-auto pr-2">
        <PepInputGroup label="Secret Phrase (12 or 24 words)" id="mnemonic">
          <textarea 
            v-model="form.mnemonic"
            id="mnemonic"
            rows="3"
            placeholder="word1 word2 ..."
            class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-pep-green sm:text-sm"
          ></textarea>
        </PepInputGroup>

        <PepInput
          v-model="form.password"
          id="new-password"
          type="password"
          label="New Password"
          placeholder="Min. 8 characters"
        />

        <PepInput
          v-model="form.confirmPassword"
          id="confirm-password"
          type="password"
          label="Confirm Password"
          placeholder="Repeat password"
          :error="form.errors.general"
        />
      </div>

      <div class="pt-6">
        <PepButton @click="handleImport" :loading="form.isProcessing" :disabled="form.hasError()" class="w-full">
          Import Wallet
        </PepButton>
      </div>
    </div>
  </div>
</template>
