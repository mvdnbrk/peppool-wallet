<script setup lang="ts">
interface Props {
  mnemonic: string;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-3 gap-2 bg-slate-800 p-4 rounded-xl border border-slate-700">
    <div v-for="(word, index) in mnemonic.split(' ')" :key="index" class="bg-slate-900 rounded p-2 text-center">
      <span class="text-[10px] text-pep-green-light font-bold block leading-none mb-1">{{ index + 1 }}</span>
      <span class="text-sm font-semibold text-offwhite">{{ word }}</span>
    </div>
  </div>
</template>
