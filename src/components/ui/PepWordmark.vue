<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

withDefaults(defineProps<Props>(), {
  size: 'md'
});
</script>

<template>
  <h1 
    class="italic tracking-wide text-white flex items-baseline"
    :class="{
      'text-xl': size === 'sm',
      'text-2xl': size === 'md',
      'text-3xl': size === 'lg',
      'text-4xl': size === 'xl'
    }"
  >
    <span class="text-pep-green-light font-ubuntu font-bold italic inline-block transform scale-x-[1.08] origin-left">Pep</span>
    <span class="font-ubuntu italic inline-block transform scale-x-[1.08] origin-left ml-1.5">pool</span>
    <span 
      class="font-ubuntu italic ml-1.5"
      :class="size === 'xl' ? 'text-xl' : 'text-xs'"
    >wallet</span>
  </h1>
</template>
