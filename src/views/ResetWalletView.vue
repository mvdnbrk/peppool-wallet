<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';

const router = useRouter();
const walletStore = useWalletStore();
const confirmedBackup = ref(false);

function handleReset() {
  walletStore.resetWallet(); // Wipes local storage
  router.push('/');
}
</script>

<template>
  <div class="flex flex-col min-h-full p-6 relative">
    <PepHeader title="Reset Wallet" :absolute="false" />

    <div class="flex-1 flex flex-col pt-4">
      <div class="space-y-8 flex-1">
        <div class="space-y-4 text-slate-400 text-sm">
          <p class="text-white font-bold">Peppool Wallet does not keep a copy of your password.</p>
          <p>If you're unable to access your account, you will need to reset your wallet and input the seed phrase you used when you generated your wallet.</p>
          <div class="bg-red-900/10 border border-red-900/20 p-3 rounded-lg text-red-400 font-semibold">
            <p>This will reset your wallet from this browser. Make sure you have your seed phrase backed up.</p>
          </div>
        </div>

        <div class="pt-2">
          <PepCheckbox
            v-model="confirmedBackup"
            id="confirm-backup"
            label="I have backed up my seed phrase."
          />
        </div>
      </div>

      <div class="pt-6">
        <button 
          @click="handleReset"
          :disabled="!confirmedBackup"
          class="w-full rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-red-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset Wallet
        </button>
      </div>
    </div>
  </div>
</template>
