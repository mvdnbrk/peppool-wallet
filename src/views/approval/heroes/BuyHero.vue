<script setup lang="ts">
import { formatPep } from '@/utils/price';
import HeroCard from './HeroCard.vue';
import InscriptionLine from './InscriptionLine.vue';
import PepNetworkFee from '@/components/ui/PepNetworkFee.vue';
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
    <div
      v-if="scenario.feeRibbits !== null"
      class="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
    >
      <PepNetworkFee :fee="formatPep(scenario.feeRibbits)" layout="inline" />
    </div>
  </div>
</template>
