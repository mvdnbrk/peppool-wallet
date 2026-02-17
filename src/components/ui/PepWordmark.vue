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
    class="text-offwhite flex items-baseline tracking-wide italic"
    :class="{
      'text-xl': size === 'sm',
      'text-2xl': size === 'md',
      'text-3xl': size === 'lg',
      'text-4xl': size === 'xl'
    }"
  >
    <span
      class="text-pep-green-light font-ubuntu inline-block origin-left scale-x-[1.08] transform font-bold italic"
      >Pep</span
    >
    <span class="font-ubuntu ml-1.5 inline-block origin-left scale-x-[1.08] transform italic"
      >pool</span
    >
    <span class="font-ubuntu ml-1.5 italic" :class="size === 'xl' ? 'text-xl' : 'text-xs'"
      >wallet</span
    >
  </h1>
</template>
