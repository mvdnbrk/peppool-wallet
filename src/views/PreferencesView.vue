<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';

const router = useRouter();
const walletStore = useWalletStore();

function getDurationLabel(val: number) {
  if (val < 60) return `${val} Minutes`;
  return `${val / 60} Hour${val > 60 ? 's' : ''}`;
}
</script>

<template>
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="Preferences" />

    <div class="mt-16 flex-1 space-y-2">
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button 
          @click="router.push('/settings/currency')"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 text-left cursor-pointer group"
        >
          <span class="text-sm font-semibold text-white">Currency</span>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-offwhite uppercase">{{ walletStore.selectedCurrency }}</span>
            <PepIcon name="chevron-right" class="text-slate-600 group-hover:text-slate-400 transition-colors" size="16" />
          </div>
        </button>

        <button 
          @click="router.push('/settings/auto-lock')"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors text-left cursor-pointer group"
        >
          <span class="text-sm font-semibold text-white">Auto-Lock</span>
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-offwhite">{{ getDurationLabel(walletStore.lockDuration) }}</span>
            <PepIcon name="chevron-right" class="text-slate-600 group-hover:text-slate-400 transition-colors" size="16" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
