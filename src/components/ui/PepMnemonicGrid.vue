<script setup lang="ts">
interface Props {
  mnemonic: string;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-3 gap-2 rounded-xl border border-slate-700 bg-slate-800 p-4">
    <div
      v-for="(word, index) in mnemonic.split(' ')"
      :key="index"
      class="rounded bg-slate-900 p-2 text-center"
    >
      <span class="text-pep-green-light mb-1 block text-[10px] leading-none font-bold">{{
        index + 1
      }}</span>
      <span class="text-offwhite text-sm font-semibold">{{ word }}</span>
    </div>
  </div>
</template>
