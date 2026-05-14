<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">
      {{ label }}
    </span>
    <div class="mt-1">
      <slot />
    </div>
  </div>
</template>
