<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useApp } from '@/composables/useApp';
import { useInscriptionStore } from '@/stores/inscriptions';

const { router, wallet: walletStore } = useApp();
const inscriptionStore = useInscriptionStore();

const items = computed(() => {
  const all = Object.values(inscriptionStore.inscriptions);
  return [...all].sort((a, b) => b.number - a.number);
});

const isEmpty = computed(() => items.value.length === 0);
const isInitialLoad = computed(() => isEmpty.value && inscriptionStore.syncing);

onMounted(async () => {
  if (walletStore.isUnlocked) {
    await walletStore.refreshBalance();
  }
});

function open(id: string) {
  router.push(`/inscription/${id}`);
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Inscriptions" :on-back="() => router.push('/dashboard')" />
    </template>

    <div class="flex min-h-0 flex-1 flex-col">
      <div v-if="isInitialLoad" class="flex flex-1 flex-col items-center justify-center space-y-4">
        <PepSpinner size="32" class="text-pep-green" />
        <p class="text-sm font-bold tracking-widest text-slate-500 uppercase">
          Loading Inscriptions...
        </p>
      </div>

      <div
        v-else-if="isEmpty"
        class="flex flex-1 flex-col items-center justify-center text-slate-500"
      >
        <p class="text-sm font-bold">No inscriptions yet</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto pr-1 pb-4">
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="group overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 text-left transition-colors hover:border-slate-600"
            @click="open(item.id)"
          >
            <div class="aspect-square w-full overflow-hidden">
              <PepInscription :id="item.id" :content-type="item.contentType" :interactive="false" />
            </div>
            <div class="border-t border-slate-700/50 px-3 py-2">
              <p class="text-offwhite truncate text-xs font-bold">#{{ item.number }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </PepMainLayout>
</template>
