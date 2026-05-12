<script setup lang="ts">
withDefaults(
  defineProps<{
    fee: string;
    layout?: 'stacked' | 'inline';
  }>(),
  { layout: 'stacked' }
);
</script>

<template>
  <div v-if="layout === 'inline'" class="flex items-center justify-between">
    <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">Network Fee</span>
    <span class="text-xs font-bold text-slate-300">{{ fee }}</span>
  </div>
  <div v-else class="px-1">
    <div class="flex flex-col">
      <span class="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Network Fee</span>
      <span class="text-xs font-bold text-slate-300">{{ fee }}</span>
    </div>
  </div>
</template>
