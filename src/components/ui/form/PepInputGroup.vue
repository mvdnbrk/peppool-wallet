<script setup lang="ts">
interface Props {
  label?: string;
  id?: string;
  labelClass?: string;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  labelClass: 'text-sm font-medium text-offwhite text-left'
});
</script>

<template>
  <div class="relative">
    <label v-if="label" :for="id" class="block" :class="labelClass">{{ label }}</label>
    <div :class="{ 'mt-2': label }">
      <slot />
    </div>
    <p
      v-if="error"
      class="animate-in fade-in slide-in-from-top-1 mt-2 text-sm font-medium text-red-400 duration-200"
    >
      {{ error }}
    </p>
  </div>
</template>
