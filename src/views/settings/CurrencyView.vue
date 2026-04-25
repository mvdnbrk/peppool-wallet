<script setup lang="ts">
import { useApp } from '@/composables/useApp';

const { router, settings: settingsStore } = useApp();

const options = [
  { label: 'US DOLLAR', value: 'USD' },
  { label: 'EURO', value: 'EUR' }
] as const;

function selectCurrency(code: 'USD' | 'EUR') {
  settingsStore.setCurrency(code);
  setTimeout(() => router.back(), 200);
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Display currency" />
    </template>
    <div class="mt-0 flex-1 space-y-2">
      <p class="mb-4 px-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        Select Currency
      </p>

      <PepRadioList
        :modelValue="settingsStore.settings.currency"
        :options="options"
        name="currency"
        @update:modelValue="selectCurrency"
      />
    </div>
  </PepMainLayout>
</template>
