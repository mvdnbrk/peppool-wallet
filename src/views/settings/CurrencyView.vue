<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../../stores/wallet';

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
  <div class="relative flex h-full flex-col p-6">
    <PepHeader title="Display currency" />

    <div class="mt-16 flex-1 space-y-2">
      <p class="mb-4 px-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        Select Currency
      </p>

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
