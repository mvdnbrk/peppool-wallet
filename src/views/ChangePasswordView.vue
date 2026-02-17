<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import { encrypt } from '../utils/encryption';
import { MIN_PASSWORD_LENGTH } from '../utils/constants';
import { useForm, validatePasswordMatch, usePasswordBlur } from '../utils/form';

const router = useRouter();
const walletStore = useWalletStore();

const form = useForm({
  oldPassword: '',
  password: '', // Logic helper expects 'password' and 'confirmPassword'
  confirmPassword: ''
});

const { onBlurPassword, onBlurConfirmPassword } = usePasswordBlur(form);

const successMsg = ref('');
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

const oldPasswordError = computed(() => {
  if (isLockedOut.value) {
    return `Too many failed attempts. Locked for ${secondsRemaining.value}s.`;
  }
  return form.errors.oldPassword;
});

// Require the wallet to be unlocked to change password
onMounted(() => {
  if (!walletStore.isUnlocked) {
    router.replace('/');
    return;
  }
  ticker = setInterval(() => { now.value = Date.now(); }, 1000);
});

onUnmounted(() => {
  if (ticker) clearInterval(ticker);
});

async function handleChangePassword() {
  if (isLockedOut.value) return;
  successMsg.value = '';

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

    successMsg.value = 'Password updated successfully!';
    setTimeout(() => {
      router.push('/settings');
    }, 2000);
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
  <div class="flex flex-col min-h-full p-6 relative">
    <PepHeader title="Change password" :absolute="false" />

    <div class="flex-1 flex flex-col pt-4">
      <div class="space-y-6 flex-1">
        <PepPasswordInput
          v-model="form.oldPassword"
          id="old-password"
          label="Current password"
          placeholder="Enter current password"
          :error="oldPasswordError"
          :disabled="isLockedOut"
        />

        <div class="space-y-4">
          <PepInput
            v-model="form.password"
            id="new-password"
            type="password"
            label="New password"
            :placeholder="`Min. ${MIN_PASSWORD_LENGTH} characters`"
            :error="form.errors.password"
            :disabled="isLockedOut"
            @blur="onBlurPassword"
          />

          <PepInput
            v-model="form.confirmPassword"
            id="confirm-password"
            type="password"
            label="Confirm new password"
            placeholder="Repeat new password"
            :error="form.errors.confirmPassword"
            :disabled="isLockedOut"
            @blur="onBlurConfirmPassword"
          />
        </div>

        <p v-if="successMsg" class="text-sm text-pep-green-light font-bold text-center animate-pulse">
          {{ successMsg }}
        </p>
      </div>

      <div class="pt-6">
        <PepButton @click="handleChangePassword" :disabled="isLockedOut || form.isProcessing || !form.oldPassword || !form.password || !form.confirmPassword || form.hasError()" class="w-full">
          {{ isLockedOut ? 'Locked' : form.isProcessing ? 'Updating...' : 'Update password' }}
        </PepButton>
      </div>
    </div>
  </div>
</template>
