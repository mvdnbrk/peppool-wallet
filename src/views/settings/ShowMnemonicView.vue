<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '../../stores/wallet';
import { decrypt } from '../../utils/encryption';

const router = useRouter();
const walletStore = useWalletStore();

const password = ref('');
const mnemonic = ref('');
const error = ref('');
const step = ref(1); // 1: Password, 2: Show
const now = ref(Date.now());
let ticker: ReturnType<typeof setInterval> | null = null;

const isLockedOut = computed(() => {
  if (walletStore.lockoutUntil === 0) return false;
  return walletStore.lockoutUntil > now.value;
});

const secondsRemaining = computed(() => {
  if (!isLockedOut.value) return 0;
  return Math.max(0, Math.ceil((walletStore.lockoutUntil - now.value) / 1000));
});

const errorMessage = computed(() => {
  if (isLockedOut.value) {
    return `Too many failed attempts. Locked for ${secondsRemaining.value}s.`;
  }
  return error.value;
});

watch(password, () => {
  error.value = '';
});

watch(isLockedOut, (locked) => {
  if (locked) {
    password.value = '';
    error.value = '';
  } else {
    error.value = '';
  }
});

onMounted(() => {
  if (!walletStore.isUnlocked) {
    router.replace('/');
    return;
  }
  ticker = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

// Clear sensitive data from memory when leaving this view
onUnmounted(() => {
  mnemonic.value = '';
  password.value = '';
  if (ticker) clearInterval(ticker);
});

async function handleReveal() {
  if (isLockedOut.value) return;

  try {
    // Use decrypt directly but through the store's unlock flow for lockout tracking
    const success = await walletStore.unlock(password.value);
    if (!success) {
      if (!isLockedOut.value) {
        error.value = 'Incorrect password';
      }
      return;
    }

    // After successful unlock, the mnemonic is in the store
    if (walletStore.plaintextMnemonic) {
      mnemonic.value = walletStore.plaintextMnemonic;
    } else {
      // Fallback: decrypt directly if session didn't cache it
      mnemonic.value = await decrypt(walletStore.encryptedMnemonic!, password.value);
    }
    step.value = 2;
    error.value = '';
  } catch (e) {
    if (!isLockedOut.value) {
      error.value = 'Incorrect password';
    }
  }
}
</script>

<template>
  <div class="relative flex h-full flex-col justify-center p-6">
    <PepHeader title="Secret phrase" />

    <!-- Step 1: Verify Password -->
    <div v-if="step === 1" class="mt-12 space-y-8">
      <p class="text-sm text-slate-400">Please enter your password to reveal your secret phrase.</p>

      <div class="space-y-6">
        <PepPasswordInput
          v-model="password"
          id="reveal-password"
          label="Password"
          placeholder="Enter your password"
          :error="errorMessage"
          :disabled="isLockedOut"
          @keyup.enter="handleReveal"
        />

        <div class="space-y-3">
          <PepButton
            @click="handleReveal"
            :disabled="isLockedOut || !password || !!errorMessage"
            class="w-full"
          >
            {{ isLockedOut ? 'Locked' : 'Reveal Phrase' }}
          </PepButton>
        </div>
      </div>
    </div>

    <!-- Step 2: Show Phrase -->
    <div v-if="step === 2" class="mt-12 space-y-6">
      <div class="rounded-lg border border-red-900/50 bg-red-900/20 p-3 text-xs text-red-400">
        <strong>SECURITY WARNING:</strong> Never share this phrase with anyone. Anyone with this
        phrase can steal your funds.
      </div>

      <PepMnemonicGrid :mnemonic="mnemonic" />
    </div>
  </div>
</template>
