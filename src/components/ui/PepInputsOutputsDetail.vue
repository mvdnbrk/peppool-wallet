<script setup lang="ts">
import { formatPep } from '@/utils/price';
import PepInlineAddress from '@/components/ui/PepInlineAddress.vue';
import type { Inscription } from '@/models/Inscription';

export interface InputOutputRow {
  address: string | null;
  amountRibbits: number | null;
  inscription?: Inscription | null;
}

defineProps<{
  title: string;
  rows: InputOutputRow[];
}>();
</script>

<template>
  <details class="group rounded-xl border border-slate-800 bg-slate-900">
    <summary
      class="flex cursor-pointer list-none items-center justify-between p-4 [&::-webkit-details-marker]:hidden"
    >
      <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">
        {{ title }}
      </span>
      <svg
        class="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <div class="space-y-2 px-4 pb-4">
      <div
        v-for="(row, i) in rows"
        :key="i"
        class="flex items-center justify-between gap-3 border-t border-slate-800 pt-2 first:border-t-0 first:pt-0"
      >
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <PepInlineAddress :address="row.address" />
          <span
            v-if="row.inscription"
            class="bg-pepe-green/10 text-pepe-green shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-widest uppercase"
          >
            #{{ row.inscription.number }}
          </span>
        </div>
        <span class="shrink-0 text-xs font-bold text-slate-200">
          {{ row.amountRibbits === null ? '—' : formatPep(row.amountRibbits) }}
        </span>
      </div>
    </div>
  </details>
</template>
