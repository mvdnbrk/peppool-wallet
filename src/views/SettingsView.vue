<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';

const router = useRouter();
const walletStore = useWalletStore();

function handleLock() {
  walletStore.lock();
  router.push('/');
}
</script>

<template>
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="Settings" backTo="/dashboard" />

    <div class="mt-16 flex-1 space-y-2">
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button 
          @click="router.push('/settings/preferences')"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 text-left cursor-pointer group"
        >
          <span class="text-sm font-semibold text-white">Preferences</span>
          <PepIcon name="chevron-right" class="text-slate-600 group-hover:text-slate-400 transition-colors" size="16" />
        </button>

        <button 
          @click="router.push('/settings/security')"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 text-left cursor-pointer group"
        >
          <span class="text-sm font-semibold text-white">Security</span>
          <PepIcon name="chevron-right" class="text-slate-600 group-hover:text-slate-400 transition-colors" size="16" />
        </button>

        <button 
          @click="router.push('/settings/about')"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors text-left cursor-pointer group"
        >
          <span class="text-sm font-semibold text-white">About</span>
          <PepIcon name="chevron-right" class="text-slate-600 group-hover:text-slate-400 transition-colors" size="16" />
        </button>
      </div>

      <div class="pt-6">
        <PepButton @click="handleLock" variant="secondary" class="w-full">
          Lock Wallet
        </PepButton>
      </div>
    </div>

    <PepFooter />
  </div>
</template>
