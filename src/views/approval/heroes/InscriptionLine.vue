<script setup lang="ts">
import PepInscription from '@/components/ui/PepInscription.vue';
import type { Inscription } from '@/models/Inscription';

defineProps<{ inscription: Inscription | null }>();
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-700">
      <PepInscription
        v-if="inscription"
        :id="inscription.id"
        :content-type="inscription.contentType"
      />
    </div>
    <span class="text-offwhite text-base font-bold">
      {{ inscription ? `Inscription ${inscription.number}` : 'Inscription' }}
    </span>
  </div>
</template>
