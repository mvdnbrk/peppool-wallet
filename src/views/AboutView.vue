<script setup lang="ts">
import pkg from '../../package.json';
</script>

<template>
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="About" />

    <div class="mt-16 flex-1 space-y-4">
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <a 
          href="https://peppool.space" 
          target="_blank" 
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 text-left cursor-pointer"
        >
          <span class="text-sm font-semibold text-white">Peppool.space</span>
          <PepIcon name="external-link" class="text-white" size="18" />
        </a>

        <a 
          href="https://github.com/mvdnbrk/peppool-wallet/blob/main/PRIVACY.md" 
          target="_blank" 
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 text-left cursor-pointer"
        >
          <span class="text-sm font-semibold text-white">Privacy policy</span>
          <PepIcon name="external-link" class="text-white" size="18" />
        </a>

        <a 
          href="https://github.com/mvdnbrk/peppool-wallet" 
          target="_blank" 
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors text-left cursor-pointer"
        >
          <span class="text-sm font-semibold text-white">Source code</span>
          <PepIcon name="external-link" class="text-white" size="18" />
        </a>
      </div>

      <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-slate-400 font-semibold">Version</span>
          <span class="text-white font-bold">{{ pkg.version }}</span>
        </div>
        <div class="flex justify-between text-sm pt-1">
          <span class="text-slate-400 font-semibold">Network</span>
          <span class="text-pep-green-light font-bold">Pepecoin Mainnet</span>
        </div>
      </div>
    </div>
    
    <PepFooter />
  </div>
</template>
