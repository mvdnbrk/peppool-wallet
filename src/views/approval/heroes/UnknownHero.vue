<script setup lang="ts">
import { formatPep } from '@/utils/price';
import HeroCard from './HeroCard.vue';
import InscriptionLine from './InscriptionLine.vue';
import type { Inscription } from '@/models/Inscription';

type HeroSide =
  | { kind: 'pep'; amountRibbits: number }
  | { kind: 'inscription'; inscription: Inscription | null }
  | null;

defineProps<{
  transfer: HeroSide;
  receive: HeroSide;
}>();
</script>

<template>
  <div class="space-y-3">
    <HeroCard v-if="transfer" label="You will transfer">
      <InscriptionLine v-if="transfer.kind === 'inscription'" :inscription="transfer.inscription" />
      <p v-else class="text-lg font-bold">{{ formatPep(transfer.amountRibbits) }}</p>
    </HeroCard>
    <HeroCard v-if="receive" label="You will receive">
      <InscriptionLine v-if="receive.kind === 'inscription'" :inscription="receive.inscription" />
      <p v-else class="text-lg font-bold">{{ formatPep(receive.amountRibbits) }}</p>
    </HeroCard>
  </div>
</template>
