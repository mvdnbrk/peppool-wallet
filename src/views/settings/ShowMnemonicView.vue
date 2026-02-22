<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
import { useApp } from '@/composables/useApp';
import { useLockout } from '@/composables/useLockout';
import { useShowMnemonic } from '@/composables/useShowMnemonic';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';

const { router } = useApp();
const { isLockedOut, lockoutError } = useLockout();
const { step, mnemonic, error, reveal } = useShowMnemonic();

const passwordInput = ref<any>(null);
const password = ref('');
const isProcessing = ref(false);

const errorMessage = computed(() => {
  if (isLockedOut.value) {
    return lockoutError.value;
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
  }
});

// Clear password from memory when leaving this view
onUnmounted(() => {
  password.value = '';
});

async function handleReveal() {
  if (isLockedOut.value || isProcessing.value || !!errorMessage.value) return;

  isProcessing.value = true;
  try {
    const success = await reveal(password.value);
    if (!success) {
      nextTick(() => passwordInput.value?.focus());
    }
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Secret phrase" />
    </template>

    <!-- Step 1: Verify Password -->
    <div v-if="step === 1" class="flex-1 space-y-8">
      <p class="text-sm text-slate-400">Please enter your password to reveal your secret phrase.</p>

      <div class="space-y-6">
        <PepPasswordInput
          ref="passwordInput"
          v-model="password"
          id="reveal-password"
          label="Password"
          placeholder="Enter your password"
          :error="errorMessage"
          :disabled="isLockedOut"
          @keyup.enter="handleReveal"
        />
      </div>
    </div>

    <!-- Step 2: Show Phrase -->
    <div v-if="step === 2" class="flex-1 space-y-6">
      <div class="rounded-lg border border-red-900/50 bg-red-900/20 p-3 text-xs text-red-400">
        <strong>SECURITY WARNING:</strong> Never share this phrase with anyone. Anyone with this
        phrase can steal your funds.
      </div>

      <div class="flex flex-1 flex-col justify-center pt-8">
        <PepMnemonicGrid :mnemonic="mnemonic" />
      </div>
    </div>

    <template #actions>
      <PepLoadingButton
        v-if="step === 1"
        id="reveal-button"
        @click="handleReveal"
        :loading="isProcessing"
        :disabled="isLockedOut || !password || !!errorMessage || isProcessing"
        class="w-full"
      >
        {{ isLockedOut ? 'Locked' : 'Reveal Phrase' }}
      </PepLoadingButton>

      <PepButton
        v-if="step === 2"
        @click="router.push('/dashboard')"
        variant="secondary"
        class="w-full"
      >
        Close
      </PepButton>
    </template>
  </PepMainLayout>
</template>
