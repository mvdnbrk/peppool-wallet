<script setup lang="ts">
defineProps<{
  id?: string;
}>();
</script>

<template>
  <div :id="id" class="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50">
    <slot />
  </div>
</template>
