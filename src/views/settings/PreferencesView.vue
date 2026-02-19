<script setup lang="ts">
import { useApp } from '@/composables/useApp';

import { EXPLORERS } from '@/utils/explorer';

const { router, wallet: walletStore } = useApp();

function getDurationLabel(val: number) {
  if (val < 60) return `${val} Minutes`;
  return `${val / 60} Hour${val > 60 ? 's' : ''}`;
}
</script>

<template>
  <div class="relative flex h-full flex-col p-6">
    <PepPageHeader title="Preferences" />

    <div class="mt-0 flex-1 space-y-2">
      <PepList>
        <PepListItem
          label="Currency"
          icon="chevron-right"
          @click="router.push('/settings/currency')"
        >
          <template #right>
            <span class="text-offwhite text-sm font-medium uppercase">{{
              walletStore.selectedCurrency
            }}</span>
          </template>
        </PepListItem>

        <PepListItem
          label="Preferred explorer"
          icon="chevron-right"
          @click="router.push('/settings/explorer')"
        >
          <template #right>
            <span class="text-offwhite text-sm font-medium">{{
              EXPLORERS[walletStore.selectedExplorer].name
            }}</span>
          </template>
        </PepListItem>

        <PepListItem
          label="Auto-Lock"
          icon="chevron-right"
          @click="router.push('/settings/auto-lock')"
        >
          <template #right>
            <span class="text-offwhite text-sm font-medium">{{
              getDurationLabel(walletStore.lockDuration)
            }}</span>
          </template>
        </PepListItem>
      </PepList>
    </div>
  </div>
</template>
