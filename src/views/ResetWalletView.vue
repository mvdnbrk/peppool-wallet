<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';

const router = useRouter();
const walletStore = useWalletStore();
const confirmedBackup = ref(false);

function handleReset() {
  walletStore.resetWallet();
  router.push('/');
}
</script>

<template>
  <div class="flex flex-col min-h-full p-6 relative">
    <PepHeader title="Reset wallet" :absolute="false" />

    <div class="flex-1 flex flex-col pt-4">
      <div class="space-y-8 flex-1">
        <div class="space-y-4 text-slate-400 text-sm">
          <p class="text-white font-bold">This will completely wipe your wallet data from this browser.</p>
          <div class="bg-red-900/10 border border-red-900/20 p-3 rounded-lg text-red-400 font-semibold">
            <p>Ensure you have your secret phrase backed up. Without it, you will lose access to your funds permanently.</p>
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
        <PepButton 
          @click="handleReset"
          :disabled="!confirmedBackup"
          variant="danger"
          class="w-full"
        >
          Reset wallet
        </PepButton>
      </div>
    </div>
  </div>
</template>
