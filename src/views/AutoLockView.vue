<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';

const router = useRouter();
const walletStore = useWalletStore();

const options = [
  { label: '15 Minutes', val: 15 },
  { label: '30 Minutes', val: 30 },
  { label: '1 Hour', val: 60 },
  { label: '3 Hours', val: 180 }
];

function selectDuration(val: number) {
  walletStore.setLockDuration(val);
  setTimeout(() => router.back(), 200);
}
</script>

<template>
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="Auto-Lock" />

    <div class="mt-16 flex-1 space-y-4">
      <div class="px-1 space-y-1">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Inactivity Timeout</p>
        <p class="text-[10px] text-slate-500 leading-tight">Select the desired duration before the extension locks.</p>
      </div>
      
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button 
          v-for="opt in options" 
          :key="opt.val"
          @click="selectDuration(opt.val)"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 last:border-0 text-left cursor-pointer group"
        >
          <span class="text-sm font-semibold text-white">{{ opt.label }}</span>
          <div 
            v-if="walletStore.lockDuration === opt.val"
            class="w-5 h-5 rounded-full bg-pep-green flex items-center justify-center text-white text-[10px]"
          >
            ✓
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
