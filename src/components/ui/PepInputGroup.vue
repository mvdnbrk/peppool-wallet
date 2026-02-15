<script setup lang="ts">
interface Props {
  label?: string;
  id?: string;
  labelClass?: string;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  labelClass: 'text-sm font-medium text-white'
});
</script>

<template>
  <div class="relative">
    <label 
      v-if="label" 
      :for="id" 
      class="block" 
      :class="labelClass"
    >{{ label }}</label>
    <div :class="{ 'mt-2': label }">
      <slot />
    </div>
    <p 
      v-if="error"
      class="mt-2 text-sm font-medium text-red-400 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      {{ error }}
    </p>
  </div>
</template>
