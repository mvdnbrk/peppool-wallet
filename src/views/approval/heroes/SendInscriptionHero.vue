<script setup lang="ts">
import { formatPep } from '@/utils/price';
import HeroCard from './HeroCard.vue';
import InscriptionLine from './InscriptionLine.vue';
import PepInlineAddress from '@/components/ui/PepInlineAddress.vue';
import PepNetworkFee from '@/components/ui/PepNetworkFee.vue';
import type { PsbtScenario } from '@/utils/psbtScenario';

defineProps<{ scenario: Extract<PsbtScenario, { kind: 'send-inscription' }> }>();
</script>

<template>
  <div class="space-y-3">
    <HeroCard label="You will send">
      <InscriptionLine :inscription="scenario.inscription" />
    </HeroCard>
    <HeroCard label="To">
      <PepInlineAddress :address="scenario.recipient" />
    </HeroCard>
    <div class="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
      <PepNetworkFee :fee="formatPep(scenario.feeRibbits)" layout="inline" />
    </div>
  </div>
</template>
