<script setup lang="ts">
import { formatPep } from '@/utils/price';
import HeroCard from './HeroCard.vue';
import PepInlineAddress from '@/components/ui/PepInlineAddress.vue';
import type { PsbtScenario } from '@/utils/psbtScenario';

defineProps<{ scenario: Extract<PsbtScenario, { kind: 'send-pep' }> }>();
</script>

<template>
  <div class="space-y-3">
    <HeroCard label="You will send">
      <p class="text-lg font-bold">{{ formatPep(scenario.amountRibbits) }}</p>
    </HeroCard>
    <HeroCard label="To">
      <PepInlineAddress :address="scenario.recipient" />
    </HeroCard>
  </div>
</template>
