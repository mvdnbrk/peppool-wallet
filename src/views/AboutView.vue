<script setup lang="ts">
import pkg from '../../package.json';
</script>

<template>
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="About" />

    <div class="mt-16 flex-1 space-y-4">
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-slate-400">Version</span>
          <span class="text-offwhite font-bold">{{ pkg.version }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-slate-400">Network</span>
          <span class="text-pep-green-light font-bold">Pepecoin Mainnet</span>
        </div>
        <div class="flex justify-between text-sm pt-1">
          <span class="text-slate-400">Website</span>
          <a href="https://peppool.space" target="_blank" class="text-pep-green-light hover:text-pep-green font-semibold transition-colors">peppool.space</a>
        </div>
      </div>
    </div>
  </div>
</template>
