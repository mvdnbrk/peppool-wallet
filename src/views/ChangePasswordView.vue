<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import { decrypt, encrypt } from '../utils/encryption';

const router = useRouter();
const walletStore = useWalletStore();

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const error = ref('');
const successMsg = ref('');
const isLoading = ref(false);

// Require the wallet to be unlocked to change password
onMounted(() => {
  if (!walletStore.isUnlocked) router.replace('/dashboard');
});

// Clear passwords from memory on unmount
onUnmounted(() => {
  oldPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
});

watch([oldPassword, newPassword, confirmPassword], () => {
  error.value = '';
});

async function handleChangePassword() {
  error.value = '';
  successMsg.value = '';

  if (newPassword.value.length < 8) {
    error.value = 'New password must be at least 8 characters';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  isLoading.value = true;
  try {
    const mnemonic = await decrypt(walletStore.encryptedMnemonic!, oldPassword.value);
    const newEncrypted = await encrypt(mnemonic, newPassword.value);

    walletStore.encryptedMnemonic = newEncrypted;
    localStorage.setItem('peppool_vault', newEncrypted);

    successMsg.value = 'Password updated successfully!';
    setTimeout(() => {
      router.push('/settings');
    }, 2000);
  } catch (e) {
    error.value = 'Incorrect current password';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col min-h-full p-6 relative">
    <PepHeader title="Change password" :absolute="false" />

    <div class="flex-1 flex flex-col pt-4">
      <div class="space-y-6 flex-1">
        <PepPasswordInput
          v-model="oldPassword"
          id="old-password"
          label="Current Password"
          placeholder="Enter current password"
        />

        <div class="space-y-4">
          <PepInput
            v-model="newPassword"
            id="new-password"
            type="password"
            label="New password"
            placeholder="Min. 8 characters"
          />

          <PepInput
            v-model="confirmPassword"
            id="confirm-password"
            type="password"
            label="Confirm new password"
            placeholder="Repeat new password"
            :error="error"
          />
        </div>

        <p v-if="successMsg" class="text-sm text-pep-green-light font-bold text-center animate-pulse">
          {{ successMsg }}
        </p>
      </div>

      <div class="pt-6">
        <PepButton @click="handleChangePassword" :disabled="isLoading || !oldPassword || !newPassword || !confirmPassword || !!error" class="w-full">
          {{ isLoading ? 'Updating...' : 'Update Password' }}
        </PepButton>
      </div>
    </div>
  </div>
</template>
