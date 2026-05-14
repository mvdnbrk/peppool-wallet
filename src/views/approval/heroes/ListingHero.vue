<script setup lang="ts">
import { formatPep } from '@/utils/price';
import HeroCard from './HeroCard.vue';
import InscriptionLine from './InscriptionLine.vue';
import type { PsbtScenario } from '@/utils/psbtScenario';

defineProps<{ scenario: Extract<PsbtScenario, { kind: 'listing' }> }>();
</script>

<template>
  <div class="space-y-3">
    <HeroCard label="You will list">
      <InscriptionLine :inscription="scenario.inscription" />
    </HeroCard>
    <HeroCard label="You will receive">
      <p class="text-lg font-bold">{{ formatPep(scenario.priceRibbits) }}</p>
    </HeroCard>
  </div>
</template>
