<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';

const router = useRouter();
const walletStore = useWalletStore();

const options = [
  { label: 'US DOLLAR', code: 'USD' },
  { label: 'EURO', code: 'EUR' }
] as const;

function selectCurrency(code: 'USD' | 'EUR') {
  walletStore.setCurrency(code);
  setTimeout(() => router.back(), 200);
}
</script>

<template>
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="Display currency" />

    <div class="mt-16 flex-1 space-y-2">
      <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 mb-4">Select Currency</p>
      
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button 
          v-for="opt in options" 
          :key="opt.code"
          @click="selectCurrency(opt.code)"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 last:border-0 text-left cursor-pointer group"
        >
          <span class="text-sm font-semibold text-white tracking-wide">{{ opt.label }}</span>
          <PepIcon 
            v-if="walletStore.selectedCurrency === opt.code"
            name="checkmark-circle"
            size="18"
            class="text-pep-green"
          />
        </button>
      </div>
    </div>
  </div>
</template>
