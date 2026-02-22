<script setup lang="ts">
import { computed, watch } from 'vue';
import { useApp } from '@/composables/useApp';
import { useLockout } from '@/composables/useLockout';
import { useChangePassword } from '@/composables/useChangePassword';
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
  } catch (e: any) {
    if (e.field === 'oldPassword') {
      if (!isLockedOut.value) form.setError(e.field, e.message);
    } else if (e.field) {
      form.setError(e.field, e.message);
    } else {
      form.setError('general', e.message || 'An error occurred');
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
      id="change-password-form"
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
