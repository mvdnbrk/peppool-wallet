<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="Security" />

    <div class="mt-16 flex-1 space-y-2">
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button 
          @click="router.push('/change-password')"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 text-left cursor-pointer group"
        >
          <span class="text-sm font-semibold text-white">Change password</span>
          <PepIcon name="chevron-right" class="text-slate-600 group-hover:text-slate-400 transition-colors" size="16" />
        </button>

        <button 
          @click="router.push('/show-mnemonic')"
          class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors text-left cursor-pointer group"
        >
          <span class="text-sm font-semibold text-white">Show secret phrase</span>
          <PepIcon name="chevron-right" class="text-slate-600 group-hover:text-slate-400 transition-colors" size="16" />
        </button>
      </div>
    </div>
  </div>
</template>
