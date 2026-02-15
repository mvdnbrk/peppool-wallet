<script setup lang="ts">
interface Props {
  label?: string;
  id?: string;
  labelClass?: string;
}

withDefaults(defineProps<Props>(), {
  labelClass: 'text-sm font-medium text-white'
});
</script>

<template>
  <div>
    <label 
      v-if="label" 
      :for="id" 
      class="block" 
      :class="labelClass"
    >{{ label }}</label>
    <div :class="{ 'mt-2': label }">
      <slot />
    </div>
  </div>
</template>
