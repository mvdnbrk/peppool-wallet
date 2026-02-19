<script setup lang="ts">
import { useApp } from '@/composables/useApp';

const { router, wallet: walletStore } = useApp();

const options = [
  { label: 'US DOLLAR', value: 'USD' },
  { label: 'EURO', value: 'EUR' }
] as const;

function selectCurrency(code: 'USD' | 'EUR') {
  walletStore.setCurrency(code);
  setTimeout(() => router.back(), 200);
}
</script>

<template>
  <div class="relative flex h-full flex-col p-6">
    <PepPageHeader title="Display currency" />

    <div class="mt-0 flex-1 space-y-2">
      <p class="mb-4 px-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        Select Currency
      </p>

      <PepRadioList
        v-model="walletStore.selectedCurrency"
        :options="options"
        name="currency"
        @update:modelValue="selectCurrency"
      />
    </div>
  </div>
</template>
