<script setup lang="ts">
import HeroCard from './HeroCard.vue';
import InscriptionLine from './InscriptionLine.vue';
import PepInlineAddress from '@/components/ui/PepInlineAddress.vue';
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
  </div>
</template>
