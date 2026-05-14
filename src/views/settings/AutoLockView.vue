<script setup lang="ts">
import { useApp } from '@/composables/useApp';

const { router, wallet: walletStore, settings: settingsStore } = useApp();

const options = [
  { label: '15 Minutes', value: 15 },
  { label: '30 Minutes', value: 30 },
  { label: '1 Hour', value: 60 },
  { label: '3 Hours', value: 180 }
];

async function selectDuration(val: number) {
  await settingsStore.setLockDuration(val);
  walletStore.resetLockTimer();
  setTimeout(() => router.back(), 200);
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Auto-Lock" />
    </template>
    <div class="mt-0 flex-1 space-y-6">
      <p class="px-1 text-sm text-slate-400">
        Select the desired duration before the extension locks.
      </p>

      <PepRadioList
        :model-value="settingsStore.settings.lockDuration"
        :options="options"
        name="auto-lock"
        @update:model-value="selectDuration"
      />
    </div>
  </PepMainLayout>
</template>
