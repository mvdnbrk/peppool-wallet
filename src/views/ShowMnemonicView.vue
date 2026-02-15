<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useWalletStore } from '../stores/wallet';
import { decrypt } from '../utils/encryption';

const walletStore = useWalletStore();

const password = ref('');
const mnemonic = ref('');
const error = ref('');
const step = ref(1); // 1: Password, 2: Show

watch(password, () => {
  error.value = '';
});

// Clear sensitive data from memory when leaving this view
onUnmounted(() => {
  mnemonic.value = '';
  password.value = '';
});

async function handleReveal() {
  try {
    const revealed = await decrypt(walletStore.encryptedMnemonic!, password.value);
    mnemonic.value = revealed;
    step.value = 2;
    error.value = '';
  } catch (e) {
    error.value = 'Incorrect password';
  }
}
</script>

<template>
  <div class="flex flex-col h-full p-6 justify-center relative">
    <PepHeader title="Secret Phrase" />

    <!-- Step 1: Verify Password -->
    <div v-if="step === 1" class="space-y-8 mt-12">
      <p class="text-slate-400 text-sm">
        Please enter your password to reveal your secret phrase.
      </p>

      <div class="space-y-6">
        <PepPasswordInput
          v-model="password"
          id="reveal-password"
          label="Password"
          placeholder="Wallet password"
          :error="error"
          @keyup.enter="handleReveal"
        />

        <div class="space-y-3">
          <PepButton @click="handleReveal" :disabled="!password || !!error" class="w-full">
            Reveal Phrase
          </PepButton>
        </div>
      </div>
    </div>

    <!-- Step 2: Show Phrase -->
    <div v-if="step === 2" class="space-y-6 mt-12">
      <div class="bg-red-900/20 border border-red-900/50 p-3 rounded-lg text-xs text-red-400">
        <strong>SECURITY WARNING:</strong> Never share this phrase with anyone. Anyone with this phrase can steal your funds.
      </div>

      <PepMnemonicGrid :mnemonic="mnemonic" />
    </div>
  </div>
</template>
