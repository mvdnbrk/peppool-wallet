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
      
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button 
          v-for="opt in options" 
          :key="opt.id"
          @click="selectExplorer(opt.id)"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 last:border-0 text-left cursor-pointer group"
        >
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-offwhite tracking-wide">{{ opt.name }}</span>
          </div>
          <PepIcon 
            v-if="walletStore.selectedExplorer === opt.id"
            name="checkmark-circle"
            size="18"
            class="text-pep-green"
          />
        </button>
      </div>
    </div>
  </div>
</template>
