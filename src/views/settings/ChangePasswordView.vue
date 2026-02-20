<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApp } from '@/composables/useApp';
import { useLockout } from '@/composables/useLockout';
import { encrypt } from '@/utils/encryption';
import { useForm, validatePasswordMatch, usePasswordBlur } from '@/utils/form';
import { UX_DELAY_NORMAL } from '@/utils/constants';

const { router, wallet: walletStore, requireUnlock } = useApp();
requireUnlock();

const { isLockedOut, lockoutError } = useLockout();

const form = useForm({
  oldPassword: '',
  password: '', // Logic helper expects 'password' and 'confirmPassword'
  confirmPassword: ''
});

const { onBlurPassword, onBlurConfirmPassword } = usePasswordBlur(form);

const isSuccess = ref(false);

const canSubmit = computed(() => {
  return (
    !isLockedOut.value &&
    !form.isProcessing &&
    form.oldPassword &&
    form.password &&
    form.confirmPassword &&
    !form.hasError()
  );
});

const oldPasswordError = computed(() => {
  if (isLockedOut.value) {
    return lockoutError.value;
  }
  return form.errors.oldPassword;
});

async function handleChangePassword() {
  if (isLockedOut.value) return;

  const errors = validatePasswordMatch(form.password, form.confirmPassword);

  if (errors.password) {
    form.setError('password', errors.password.replace('Password', 'New password'));
    return;
  }

  if (errors.confirmPassword) {
    form.setError('confirmPassword', errors.confirmPassword);
    return;
  }

  form.isProcessing = true;
  try {
    // Verify old password via unlock() — inherits escalating lockout
    const success = await walletStore.unlock(form.oldPassword);
    if (!success) {
      if (!isLockedOut.value) {
        form.setError('oldPassword', 'Incorrect current password');
      }
      form.isProcessing = false;
      return;
    }

    // Re-encrypt with new password
    const mnemonic = walletStore.plaintextMnemonic;
    if (!mnemonic) {
      form.setError('general', 'Could not access wallet data. Please try again.');
      form.isProcessing = false;
      return;
    }

    const newEncrypted = await encrypt(mnemonic, form.password);
    walletStore.updateVault(newEncrypted);

    isSuccess.value = true;
  } catch (e) {
    if (!isLockedOut.value) {
      form.setError('oldPassword', 'Incorrect current password');
    }
  } finally {
    form.isProcessing = false;
  }
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader
        :title="isSuccess ? 'Success' : 'Change password'"
        :key="isSuccess ? 'success' : 'form'"
      />
    </template>

    <!-- Success State -->
    <PepSuccessState
      v-if="isSuccess"
      title="Password updated!"
      description="Your new password is now active."
    />

    <PepForm
      v-else
      :loading="form.isProcessing"
      @submit="handleChangePassword"
      class="flex flex-1 flex-col"
    >
      <PepPasswordInput
        v-model="form.oldPassword"
        id="old-password"
        label="Current password"
        placeholder="Enter current password"
        :error="oldPasswordError"
        :disabled="isLockedOut"
      />

      <PepPasswordFields
        v-model:password="form.password"
        v-model:confirmPassword="form.confirmPassword"
        :errors="form.errors"
        :disabled="isLockedOut"
        passwordLabel="New password"
        confirmLabel="Confirm new password"
        @blur-password="onBlurPassword"
        @blur-confirm="onBlurConfirmPassword"
      />
    </PepForm>

    <template #actions>
      <PepLoadingButton
        v-if="!isSuccess"
        @click="handleChangePassword"
        :loading="form.isProcessing"
        :minLoadingMs="UX_DELAY_NORMAL"
        :disabled="!canSubmit"
        class="w-full"
      >
        {{ isLockedOut ? 'Locked' : form.isProcessing ? 'Updating...' : 'Update password' }}
      </PepLoadingButton>

      <PepButton v-else @click="router.push('/dashboard')" variant="secondary" class="w-full">
        Close
      </PepButton>
    </template>
  </PepMainLayout>
</template>
