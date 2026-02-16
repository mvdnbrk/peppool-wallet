<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import { EXPLORERS, type ExplorerId } from '../utils/explorer';

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
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="Preferred explorer" />

    <div class="mt-16 flex-1 space-y-2">
      <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 mb-4">Select Explorer</p>
      
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
