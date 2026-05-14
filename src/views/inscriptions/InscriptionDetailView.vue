<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useApp } from '@/composables/useApp';
import { useInscriptionStore } from '@/stores/inscriptions';
import { fetchInscription } from '@/utils/api';
import { RIBBITS_PER_PEP } from '@/utils/constants';
import * as price from '@/utils/price';
import { pepeExplorer } from '@/utils/explorer';
import type { Inscription } from '@/models/Inscription';

const { router, route, settings: settingsStore } = useApp();
const inscriptionStore = useInscriptionStore();

const id = route.params.id as string;

const fetched = ref<Inscription | null>(null);
const isLoading = ref(false);
const error = ref('');

const inscription = computed(() => inscriptionStore.inscriptions[id] || fetched.value);

const title = computed(() => (inscription.value?.properties?.title as string) || null);

const traits = computed(() => {
  const raw = inscription.value?.properties?.traits as Record<string, string> | undefined;
  return raw ? Object.entries(raw) : [];
});

const valuePep = computed(() =>
  inscription.value ? price.formatAmount(inscription.value.value / RIBBITS_PER_PEP) : '-'
);

const dateLabel = computed(() => {
  if (!inscription.value) return '-';
  return new Date(inscription.value.timestamp * 1000).toLocaleString();
});

const contentLengthLabel = computed(() => {
  const len = inscription.value?.contentLength ?? 0;
  if (len < 1024) return `${len} B`;
  if (len < 1024 * 1024) return `${(len / 1024).toFixed(1)} KB`;
  return `${(len / 1024 / 1024).toFixed(2)} MB`;
});

onMounted(async () => {
  if (inscription.value) return;
  isLoading.value = true;
  try {
    fetched.value = await fetchInscription(id);
  } catch (e: any) {
    error.value = e?.message || 'Failed to load inscription';
  } finally {
    isLoading.value = false;
  }
});

function openExplorer() {
  pepeExplorer.openInscription(settingsStore.settings.explorer, id);
}

function goToSend() {
  router.push(`/inscription/${id}/send`);
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Inscription" :on-back="() => router.push('/inscriptions')" />
    </template>

    <div class="flex min-h-0 flex-1 flex-col">
      <div v-if="isLoading" class="flex flex-1 flex-col items-center justify-center space-y-4">
        <PepSpinner size="32" class="text-pep-green" />
        <p class="text-sm font-bold tracking-widest text-slate-500 uppercase">Loading...</p>
      </div>

      <div
        v-else-if="error"
        class="flex flex-1 flex-col items-center justify-center space-y-4 text-center"
      >
        <p class="font-bold text-red-400">{{ error }}</p>
      </div>

      <div v-else-if="inscription" class="flex-1 space-y-4 overflow-y-auto pr-1 pb-4">
        <div class="aspect-square w-full overflow-hidden rounded-2xl border border-slate-700">
          <PepInscription
            :id="inscription.id"
            :content-type="inscription.contentType"
            :interactive="true"
          />
        </div>

        <h3 v-if="title" class="text-offwhite px-1 text-lg font-bold break-words">
          {{ title }}
        </h3>

        <PepCard v-if="traits.length" class="space-y-2 p-3">
          <div
            v-for="([key, value], i) in traits"
            :key="key"
            class="flex items-baseline justify-between"
            :class="{ 'border-t border-slate-700/30 pt-2': i > 0 }"
          >
            <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">{{ key }}</span>
            <span class="text-offwhite truncate pl-2 text-xs font-semibold">{{ value }}</span>
          </div>
        </PepCard>

        <PepCard class="space-y-2 p-3">
          <div class="flex items-baseline justify-between">
            <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">Number</span>
            <span class="text-offwhite text-xs font-semibold">{{ inscription.number }}</span>
          </div>
          <div class="flex items-baseline justify-between border-t border-slate-700/30 pt-2">
            <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">Type</span>
            <span class="text-offwhite truncate pl-2 text-xs font-semibold">
              {{ inscription.contentType }}
            </span>
          </div>
          <div class="flex items-baseline justify-between border-t border-slate-700/30 pt-2">
            <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">Size</span>
            <span class="text-offwhite text-xs font-semibold">{{ contentLengthLabel }}</span>
          </div>
          <div class="flex items-baseline justify-between border-t border-slate-700/30 pt-2">
            <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">Block</span>
            <span class="text-offwhite text-xs font-semibold">{{ inscription.height }}</span>
          </div>
          <div class="flex items-baseline justify-between border-t border-slate-700/30 pt-2">
            <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">Postage</span>
            <span class="text-offwhite text-xs font-semibold">{{ valuePep }} PEP</span>
          </div>
          <div class="flex items-baseline justify-between border-t border-slate-700/30 pt-2">
            <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">Date</span>
            <span class="text-offwhite text-xs font-semibold">{{ dateLabel }}</span>
          </div>
        </PepCard>

        <PepCopyableId :id="inscription.id" label="Inscription ID" />
      </div>
    </div>

    <template #actions>
      <div v-if="inscription" class="w-full space-y-3">
        <PepButton id="send-inscription" class="w-full" @click="goToSend"> Send </PepButton>
        <PepButton id="view-on-explorer" variant="secondary" class="w-full" @click="openExplorer">
          View on Explorer
        </PepButton>
      </div>
    </template>
  </PepMainLayout>
</template>
