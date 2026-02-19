<script setup lang="ts">
import { ref } from 'vue';
import { useApp } from '@/composables/useApp';

const { router, wallet: walletStore } = useApp();

const confirmedBackup = ref(false);

function handleReset() {
  walletStore.resetWallet();
  router.push('/');
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Forgot password" />
    </template>
    <div class="flex-1 space-y-8">
      <div class="space-y-4 text-sm text-slate-400">
        <p class="text-offwhite font-bold">
          Peppool Wallet does not keep a copy of your password.
        </p>
        <p>
          If you're unable to access your account, you will need to reset your wallet and input
          the secret phrase you used when you generated your wallet.
        </p>
        <div
          class="rounded-lg border border-red-900/20 bg-red-900/10 p-3 font-semibold text-red-400"
        >
          <p>
            This will reset your wallet from this browser. Make sure you have your secret phrase
            backed up.
          </p>
        </div>
      </div>

      <div class="pt-2">
        <PepCheckbox
          v-model="confirmedBackup"
          id="confirm-backup"
          label="I have backed up my secret phrase."
        />
      </div>
    </div>

    <template #actions>
      <PepButton
        @click="handleReset"
        :disabled="!confirmedBackup"
        variant="danger"
        class="w-full"
      >
        Reset wallet
      </PepButton>
    </template>
  </PepMainLayout>
</template>
