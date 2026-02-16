<script setup lang="ts">
import pkg from '../../package.json';
</script>

<template>
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="About" />

    <div class="mt-16 flex-1 space-y-4">
      <PepList>
        <PepListItem 
          label="Peppool.space" 
          href="https://peppool.space" 
          target="_blank" 
          icon="external-link" 
        />
        <PepListItem 
          label="Privacy policy" 
          href="https://github.com/mvdnbrk/peppool-wallet/blob/main/PRIVACY.md" 
          target="_blank" 
          icon="external-link" 
        />
        <PepListItem 
          label="Source code" 
          href="https://github.com/mvdnbrk/peppool-wallet" 
          target="_blank" 
          icon="external-link" 
        />
      </PepList>
      
      <PepCard class="p-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-slate-400 font-semibold">Version</span>
          <span class="text-offwhite font-bold">{{ pkg.version }}</span>
        </div>
        <div class="flex justify-between text-sm pt-1">
          <span class="text-slate-400 font-semibold">Network</span>
          <span class="text-pep-green-light font-bold">Pepecoin Mainnet</span>
        </div>
      </PepCard>
    </div>
    
    <PepFooter />
  </div>
</template>
