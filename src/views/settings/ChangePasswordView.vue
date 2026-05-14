<script setup lang="ts">
import { computed, watch } from 'vue';
import { useApp } from '@/composables/useApp';
import { useLockout } from '@/composables/useLockout';
import { useChangePassword, ChangePasswordError } from '@/composables/useChangePassword';
import { useForm, usePasswordBlur } from '@/utils/form';
import { UX_DELAY_NORMAL } from '@/utils/constants';

const { router } = useApp();

const { isLockedOut, lockoutError } = useLockout();
const { isSuccess, performChange } = useChangePassword();

const form = useForm({
  oldPassword: '',
  password: '', // Logic helper expects 'password' and 'confirmPassword'
  confirmPassword: ''
});

const { onBlurPassword, onBlurConfirmPassword } = usePasswordBlur(form);

const canSubmit = computed(() => {
  return (
    !isLockedOut.value &&
    !form.isProcessing &&
    form.oldPassword &&
    form.password &&
    form.confirmPassword &&
    form.password !== form.oldPassword &&
    !form.hasError()
  );
});

// Immediately show error if new password is same as old
watch([() => form.oldPassword, () => form.password], ([oldPass, newPass]) => {
  if (oldPass && newPass && oldPass === newPass) {
    form.setError('password', 'Cannot use current password');
  } else if (form.errors.password === 'Cannot use current password') {
    form.clearError('password');
  }
});

const oldPasswordError = computed(() => {
  if (isLockedOut.value) {
    return lockoutError.value;
  }
  return form.errors.oldPassword;
});

async function handleChangePassword() {
  if (isLockedOut.value) return;

  form.isProcessing = true;
  try {
    await performChange(form.oldPassword, form.password, form.confirmPassword);
  } catch (e) {
    if (e instanceof ChangePasswordError) {
      if (e.field === 'oldPassword') {
        if (!isLockedOut.value) form.setError(e.field, e.message);
      } else {
        form.setError(e.field, e.message);
      }
    } else {
      form.setError('general', e instanceof Error ? e.message : 'An error occurred');
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
        :key="isSuccess ? 'success' : 'form'"
        :title="isSuccess ? 'Success' : 'Change password'"
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
      id="change-password-form"
      :loading="form.isProcessing"
      class="flex flex-1 flex-col"
      @submit="handleChangePassword"
    >
      <PepPasswordInput
        id="old-password"
        v-model="form.oldPassword"
        label="Current password"
        placeholder="Enter current password"
        :error="oldPasswordError"
        :disabled="isLockedOut"
      />

      <PepPasswordFields
        v-model:password="form.password"
        v-model:confirm-password="form.confirmPassword"
        :errors="form.errors"
        :disabled="isLockedOut"
        password-label="New password"
        confirm-label="Confirm new password"
        @blur-password="onBlurPassword"
        @blur-confirm="onBlurConfirmPassword"
      />
    </PepForm>

    <template #actions>
      <PepLoadingButton
        v-if="!isSuccess"
        :loading="form.isProcessing"
        :min-loading-ms="UX_DELAY_NORMAL"
        :disabled="!canSubmit"
        class="w-full"
        @click="handleChangePassword"
      >
        {{ isLockedOut ? 'Locked' : form.isProcessing ? 'Updating...' : 'Update password' }}
      </PepLoadingButton>

      <PepButton v-else variant="secondary" class="w-full" @click="router.push('/dashboard')">
        Close
      </PepButton>
    </template>
  </PepMainLayout>
</template>
