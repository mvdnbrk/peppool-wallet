<script setup lang="ts">
import { useApp } from '@/composables/useApp';

const { router, wallet: walletStore } = useApp();

const options = [
  { label: '15 Minutes', value: 15 },
  { label: '30 Minutes', value: 30 },
  { label: '1 Hour', value: 60 },
  { label: '3 Hours', value: 180 }
];

function selectDuration(val: number) {
  walletStore.setLockDuration(val);
  setTimeout(() => router.back(), 200);
}
</script>

<template>
  <div class="relative flex h-full flex-col p-6">
    <PepPageHeader title="Auto-Lock" />

    <div class="mt-0 flex-1 space-y-6">
      <p class="px-1 text-sm text-slate-400">
        Select the desired duration before the extension locks.
      </p>

      <PepRadioList
        v-model="walletStore.lockDuration"
        :options="options"
        name="auto-lock"
        @update:modelValue="selectDuration"
      />
    </div>
  </div>
</template>
