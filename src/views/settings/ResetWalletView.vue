<script setup lang="ts">
import { ref } from 'vue';
import { useApp } from '@/composables/useApp';

import { UX_DELAY_NORMAL } from '@/utils/constants';

const { router, wallet: walletStore } = useApp();

const confirmedBackup = ref(false);
const isProcessing = ref(false);

async function handleReset() {
  isProcessing.value = true;
  walletStore.resetWallet();
  router.push('/');
}
</script>

<template>
  <div class="relative flex min-h-full flex-col p-6">
    <PepPageHeader title="Reset wallet" />

    <div class="flex flex-1 flex-col pt-0">
      <PepForm @submit="handleReset" class="flex flex-1 flex-col">
        <div class="space-y-4 text-sm text-slate-400">
          <p class="text-offwhite font-bold">
            This will completely wipe your wallet data from this browser.
          </p>
          <div
            class="rounded-lg border border-red-900/20 bg-red-900/10 p-3 font-semibold text-red-400"
          >
            <p>
              Ensure you have your secret phrase backed up. Without it, you will lose access to your
              funds permanently.
            </p>
          </div>
        </div>

        <div class="pt-0">
          <PepCheckbox
            v-model="confirmedBackup"
            id="confirm-backup"
            label="I have backed up my secret phrase."
          />
        </div>

        <template #actions>
          <PepLoadingButton
            type="submit"
            :loading="isProcessing"
            :minLoadingMs="UX_DELAY_NORMAL"
            :disabled="!confirmedBackup"
            variant="danger"
            class="w-full"
          >
            Reset wallet
          </PepLoadingButton>
        </template>
      </PepForm>
    </div>
  </div>
</template>
