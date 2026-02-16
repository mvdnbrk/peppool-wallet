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
      
      <PepList>
        <PepListItem 
          v-for="opt in options" 
          :key="opt.code"
          :label="opt.label"
          :selected="walletStore.selectedCurrency === opt.code"
          @click="selectCurrency(opt.code)"
        />
      </PepList>
    </div>
  </div>
</template>
