<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-1 flex-col items-center pt-12 text-center">
    <div class="w-full flex-1 space-y-8">
      <PepIcon name="checkmark-circle" size="80" class="text-pep-green-light mx-auto" />
      <div class="space-y-2">
        <h3 class="text-offwhite text-xl font-bold">{{ title }}</h3>
        <p v-if="description" class="text-sm text-slate-400">{{ description }}</p>
      </div>

      <!-- Extra content (like Transaction ID) -->
      <slot />
    </div>
  </div>
</template>
