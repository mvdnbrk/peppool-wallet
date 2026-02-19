<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { EXPLORERS, type ExplorerId } from '@/utils/explorer';

const router = useRouter();
const walletStore = useWalletStore();

const options = Object.entries(EXPLORERS).map(([id, data]) => ({
  id: id as ExplorerId,
  name: data.name,
  url: data.url
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

      <PepList>
        <PepListItem
          v-for="opt in options"
          :key="opt.id"
          :label="opt.name"
          :selected="walletStore.selectedExplorer === opt.id"
          @click="selectExplorer(opt.id)"
        />
      </PepList>
    </div>
  </div>
</template>
