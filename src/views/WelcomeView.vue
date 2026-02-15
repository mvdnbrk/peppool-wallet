<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useForm } from '../utils/form';

const router = useRouter();
const walletStore = useWalletStore();
const now = ref(Date.now());
let ticker: any = null;
const passwordInput = ref<any>(null);

const form = useForm({
  password: ''
});

// Local reactivity for lockout
const localIsLockedOut = computed(() => {
  if (walletStore.lockoutUntil === 0) return false;
  return walletStore.lockoutUntil > now.value;
});

const secondsRemaining = computed(() => {
  if (!localIsLockedOut.value) return 0;
  const diff = walletStore.lockoutUntil - now.value;
  return Math.max(0, Math.ceil(diff / 1000));
});

const loginErrorMessage = computed(() => {
  if (localIsLockedOut.value) {
    return `Too many failed attempts. Locked for ${secondsRemaining.value}s.`;
  }
  return form.errors.general;
});

// Watch local lockout state change
watch(localIsLockedOut, (isLocked) => {
  if (isLocked) {
    form.password = '';
    form.clearError();
  } else {
    form.clearError();
    // Re-focus when lockout ends
    setTimeout(() => passwordInput.value?.focus(), 50);
  }
});

onMounted(() => {
  ticker = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (ticker) clearInterval(ticker);
});

async function handleUnlock() {
  if (localIsLockedOut.value) return;
  
  form.isProcessing = true;
  form.clearError();
  const startTime = Date.now();

  try {
    const success = await walletStore.unlock(form.password);
    const elapsed = Date.now() - startTime;
    if (elapsed < 500) await new Promise(r => setTimeout(r, 500 - elapsed));

    if (success) {
      router.push('/dashboard');
    } else {
      if (!localIsLockedOut.value) {
        form.setError('general', 'Incorrect password');
        passwordInput.value?.focus();
      }
    }
  } catch (e) {
    if (!localIsLockedOut.value) {
      form.setError('general', 'Incorrect password');
      passwordInput.value?.focus();
    }
  } finally {
    form.isProcessing = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-full space-y-8 p-6 text-center">
    <div class="space-y-4 flex flex-col items-center">
      <img src="../assets/logo.svg" class="w-24 h-24 mx-auto" alt="Peppool Logo" />
      <PepWordmark size="xl" />
      <p class="text-slate-400 text-sm">The Pepecoin wallet for everyone</p>
    </div>

    <div v-if="walletStore.isCreated" class="w-full space-y-4">
      <div class="text-left">
        <PepPasswordInput
          ref="passwordInput"
          v-model="form.password"
          id="password"
          label="Password"
          placeholder="Enter your password"
          :error="loginErrorMessage"
          :disabled="localIsLockedOut"
          autofocus
          @keyup.enter="handleUnlock"
        />
      </div>
      
      <PepButton 
        @click="handleUnlock" 
        :loading="form.isProcessing" 
        :disabled="localIsLockedOut || !form.password || form.hasError()"
        class="w-full"
      >
        {{ localIsLockedOut ? 'Locked' : 'Unlock' }}
      </PepButton>

      <button 
        @click="router.push('/reset-wallet')"
        class="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer underline hover:no-underline"
        tabindex="-1"
      >
        Forgot your password?
      </button>
    </div>

    <div v-else class="w-full space-y-4">
      <PepButton @click="router.push('/create')" class="w-full">
        Create new wallet
      </PepButton>
      
      <PepButton @click="router.push('/import')" variant="secondary" class="w-full">
        Import secret phrase
      </PepButton>
    </div>
  </div>
</template>
