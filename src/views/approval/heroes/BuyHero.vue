<script setup lang="ts">
import { formatPep } from '@/utils/price';
import HeroCard from './HeroCard.vue';
import InscriptionLine from './InscriptionLine.vue';
import type { PsbtScenario } from '@/utils/psbtScenario';

defineProps<{ scenario: Extract<PsbtScenario, { kind: 'buy' }> }>();
</script>

<template>
  <div class="space-y-3">
    <HeroCard label="You will buy">
      <InscriptionLine :inscription="null" />
    </HeroCard>
    <HeroCard label="You will pay">
      <p class="text-lg font-bold">{{ formatPep(scenario.priceRibbits) }}</p>
    </HeroCard>
  </div>
</template>
