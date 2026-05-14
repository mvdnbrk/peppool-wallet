<script setup lang="ts">
import HeroCard from './HeroCard.vue';
import InscriptionLine from './InscriptionLine.vue';
import type { PsbtScenario } from '@/utils/psbtScenario';

defineProps<{ scenario: Extract<PsbtScenario, { kind: 'self-send' }> }>();
</script>

<template>
  <HeroCard label="You will move">
    <InscriptionLine :inscription="scenario.inscription" />
  </HeroCard>
</template>
