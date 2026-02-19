<script setup lang="ts">
import { Transaction } from '@/models/Transaction';
import PepListItem from './PepListItem.vue';

interface Props {
  tx: Transaction;
}

defineProps<Props>();
</script>

<template>
  <PepListItem label="" class="mb-2 !rounded-xl !border !border-slate-700/50 !bg-slate-800/30 !p-3">
    <template #left>
      <p class="text-sm leading-tight font-bold" :class="tx.statusColor">
        {{ tx.statusLabel }}
      </p>
      <p class="font-mono text-[10px] text-slate-500">
        {{ tx.txidShort }}
      </p>
    </template>

    <template #right>
      <div class="text-right">
        <p class="text-offwhite text-sm leading-tight font-bold">{{ tx.formattedAmount }} PEP</p>
        <p class="text-[10px] text-slate-500">
          {{ tx.isConfirmed ? 'Confirmed' : 'In Mempool' }}
        </p>
      </div>
    </template>
  </PepListItem>
</template>
