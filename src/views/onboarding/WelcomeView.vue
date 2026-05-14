<script setup lang="ts">
import { useApp } from '@/composables/useApp';
import { useLockout } from '@/composables/useLockout';
import { consumePendingRedirect } from '@/router';
import { ref, computed, watch } from 'vue';
import { useForm } from '@/utils/form';
import { UX_DELAY_FAST } from '@/utils/constants';
import type PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';

const { router, wallet: walletStore } = useApp();
const { isLockedOut: localIsLockedOut, lockoutError } = useLockout();

const passwordInput = ref<InstanceType<typeof PepPasswordInput> | null>(null);

const form = useForm({
  password: ''
});

const loginErrorMessage = computed(() => {
  if (localIsLockedOut.value) {
    return lockoutError.value;
  }
  return form.errors.general;
});

const canUnlock = computed(() => {
  return !localIsLockedOut.value && form.password && !form.hasError();
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

async function handleUnlock() {
  if (localIsLockedOut.value) return;

  form.isProcessing = true;
  form.clearError();

  const startTime = Date.now();

  try {
    const success = await walletStore.unlock(form.password);

    if (success) {
      router.push(consumePendingRedirect() || '/dashboard');
      return;
    }

    // Wait for the minimum loading time before showing error
    const elapsed = Date.now() - startTime;
    if (elapsed < UX_DELAY_FAST) {
      await new Promise((r) => setTimeout(r, UX_DELAY_FAST - elapsed));
    }

    if (localIsLockedOut.value) return;

    form.setError('general', 'Incorrect password');
    passwordInput.value?.focus();
  } catch {
    const elapsed = Date.now() - startTime;
    if (elapsed < UX_DELAY_FAST) {
      await new Promise((r) => setTimeout(r, UX_DELAY_FAST - elapsed));
    }

    if (localIsLockedOut.value) return;

    form.setError('general', 'Incorrect password');
    passwordInput.value?.focus();
  } finally {
    form.isProcessing = false;
  }
}
</script>

<template>
  <PepMainLayout>
    <div class="flex flex-1 flex-col items-center justify-center space-y-8 text-center">
      <div class="flex flex-col items-center space-y-4">
        <img src="/src/assets/logo.svg" class="mx-auto h-24 w-24" alt="Peppool Logo" />
        <PepWordmark size="xl" />
        <p class="text-sm text-slate-400">The Pepecoin wallet for everyone</p>
      </div>

      <div v-if="walletStore.isCreated" class="w-full">
        <PepForm id="welcome-unlock-form" :loading="form.isProcessing" @submit="handleUnlock">
          <PepPasswordInput
            id="password"
            ref="passwordInput"
            v-model="form.password"
            label="Password"
            placeholder="Enter your password"
            :error="loginErrorMessage"
            :disabled="localIsLockedOut"
            autofocus
          />
        </PepForm>

        <div class="mt-8 space-y-4">
          <PepLoadingButton
            type="submit"
            form="welcome-unlock-form"
            :loading="form.isProcessing"
            :min-loading-ms="UX_DELAY_FAST"
            :disabled="!canUnlock"
            class="w-full"
          >
            {{ localIsLockedOut ? 'Locked' : 'Unlock' }}
          </PepLoadingButton>

          <button
            type="button"
            class="w-full cursor-pointer text-xs text-slate-500 underline transition-colors hover:text-white hover:no-underline"
            tabindex="-1"
            @click="router.push('/forgot-password')"
          >
            Forgot your password?
          </button>
        </div>
      </div>

      <div v-else class="w-full space-y-4">
        <PepButton class="w-full" @click="router.push('/create')"> Create new wallet </PepButton>

        <PepButton variant="secondary" class="w-full" @click="router.push('/import')">
          Import secret phrase
        </PepButton>
      </div>
    </div>
  </PepMainLayout>
</template>
