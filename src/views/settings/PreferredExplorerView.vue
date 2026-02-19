<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { EXPLORERS, type ExplorerId } from '@/utils/explorer';

const router = useRouter();
const walletStore = useWalletStore();

const options = Object.entries(EXPLORERS).map(([id, data]) => ({
  value: id as ExplorerId,
  label: data.name
}));

function selectExplorer(id: ExplorerId) {
  walletStore.setExplorer(id);
  setTimeout(() => router.back(), 200);
}
</script>

<template>
  <div class="relative flex h-full flex-col p-6">
    <PepPageHeader title="Preferred explorer" />

    <div class="mt-0 flex-1 space-y-2">
      <p class="mb-4 px-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        Select Explorer
      </p>

      <PepRadioList
        v-model="walletStore.selectedExplorer"
        :options="options"
        name="explorer"
        @update:modelValue="selectExplorer"
      />
    </div>
  </div>
</template>
