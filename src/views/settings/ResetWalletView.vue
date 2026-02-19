<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '../../stores/wallet';
import PepLoadingButton from '../../components/ui/PepLoadingButton.vue';
import { UX_DELAY_NORMAL } from '../../utils/constants';

const router = useRouter();
const walletStore = useWalletStore();
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
    <PepPageHeader title="Reset wallet" :absolute="false" />

    <div class="flex flex-1 flex-col pt-4">
      <div class="flex-1 space-y-8">
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

        <div class="pt-2">
          <PepCheckbox
            v-model="confirmedBackup"
            id="confirm-backup"
            label="I have backed up my secret phrase."
          />
        </div>
      </div>

      <div class="pt-6">
        <PepLoadingButton
          @click="handleReset"
          :loading="isProcessing"
          :min-loading-ms="UX_DELAY_NORMAL"
          :disabled="!confirmedBackup"
          variant="danger"
          class="w-full"
        >
          Reset wallet
        </PepLoadingButton>
      </div>
    </div>
  </div>
</template>
