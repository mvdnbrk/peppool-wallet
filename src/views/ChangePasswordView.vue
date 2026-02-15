<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import { decrypt, encrypt } from '../utils/encryption';
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

const state = reactive({
  successMsg: '',
  isLoading: false
});

// Require the wallet to be unlocked to change password
onMounted(() => {
  if (!walletStore.isUnlocked) router.replace('/dashboard');
});

async function handleChangePassword() {
  state.successMsg = '';

  const errors = validatePasswordMatch(form.password, form.confirmPassword);
  
  if (errors.password) {
    form.setError('password', errors.password.replace('Password', 'New password'));
    return;
  }
  
  if (errors.confirmPassword) {
    form.setError('confirmPassword', errors.confirmPassword);
    return;
  }

  state.isLoading = true;
  try {
    const mnemonic = await decrypt(walletStore.encryptedMnemonic!, form.oldPassword);
    const newEncrypted = await encrypt(mnemonic, form.password);

    walletStore.encryptedMnemonic = newEncrypted;
    localStorage.setItem('peppool_vault', newEncrypted);

    state.successMsg = 'Password updated successfully!';
    setTimeout(() => {
      router.push('/settings');
    }, 2000);
  } catch (e) {
    form.setError('oldPassword', 'Incorrect current password');
  } finally {
    state.isLoading = false;
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
          :error="form.errors.oldPassword"
        />

        <div class="space-y-4">
          <PepInput
            v-model="form.password"
            id="new-password"
            type="password"
            label="New password"
            :placeholder="`Min. ${MIN_PASSWORD_LENGTH} characters`"
            :error="form.errors.password"
            @blur="onBlurPassword"
          />

          <PepInput
            v-model="form.confirmPassword"
            id="confirm-password"
            type="password"
            label="Confirm new password"
            placeholder="Repeat new password"
            :error="form.errors.confirmPassword"
            @blur="onBlurConfirmPassword"
          />
        </div>

        <p v-if="state.successMsg" class="text-sm text-pep-green-light font-bold text-center animate-pulse">
          {{ state.successMsg }}
        </p>
      </div>

      <div class="pt-6">
        <PepButton @click="handleChangePassword" :disabled="state.isLoading || !form.oldPassword || !form.password || !form.confirmPassword || form.hasError()" class="w-full">
          {{ state.isLoading ? 'Updating...' : 'Update password' }}
        </PepButton>
      </div>
    </div>
  </div>
</template>
