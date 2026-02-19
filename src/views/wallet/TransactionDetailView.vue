<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApp } from '@/composables/useApp';
import { fetchTransaction } from '@/utils/api';
import { Transaction } from '@/models/Transaction';

const { router, route, wallet: walletStore } = useApp();

const txid = route.params.txid as string;
const txModel = ref<Transaction | null>(null);
const isLoading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const rawTx = await fetchTransaction(txid);
    txModel.value = new Transaction(rawTx, walletStore.address!);
  } catch (e: any) {
    error.value = e.message || 'Failed to load transaction';
  } finally {
    isLoading.value = false;
  }
});

function openExplorer() {
  walletStore.openExplorerTx(txid);
}
</script>

<template>
  <PepMainLayout showFooter>
    <template #header>
      <PepPageHeader title="Transaction" :onBack="() => router.push('/dashboard')" />
    </template>

    <div class="flex min-h-0 flex-1 flex-col">
      <div v-if="isLoading" class="flex flex-1 flex-col items-center justify-center space-y-4">
        <PepSpinner size="32" class="text-pep-green" />
        <p class="text-sm font-bold tracking-widest text-slate-500 uppercase">Loading Details...</p>
      </div>

      <div
        v-else-if="error"
        class="flex flex-1 flex-col items-center justify-center space-y-4 text-center"
      >
        <p class="font-bold text-red-400">{{ error }}</p>
      </div>

      <div v-else-if="txModel" class="flex-1 space-y-6 overflow-y-auto pr-1 pb-4 text-center">
        <div class="flex flex-col items-center space-y-1">
          <p class="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            {{ txModel.isOutgoing ? 'Sent' : 'Received' }}
          </p>
          <h3
            class="text-4xl font-bold"
            :class="txModel.isOutgoing ? 'text-offwhite' : 'text-pep-green-light'"
          >
            {{ txModel.formattedAmount }} PEP
          </h3>
        </div>

        <div class="space-y-4 text-left">
          <PepCard class="space-y-2 p-3">
            <div class="flex items-baseline justify-between">
              <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">Status</span>
              <span
                class="text-xs font-bold tracking-wider uppercase"
                :class="txModel.isConfirmed ? 'text-pep-green-light' : 'text-yellow-500'"
              >
                {{ txModel.isConfirmed ? 'Confirmed' : 'In Mempool' }}
              </span>
            </div>
            <div class="flex items-baseline justify-between border-t border-slate-700/30 pt-2">
              <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">Date</span>
              <span class="text-offwhite text-xs font-semibold">{{ txModel.date || '-' }}</span>
            </div>
            <div class="flex items-baseline justify-between border-t border-slate-700/30 pt-2">
              <span class="text-xs font-bold tracking-wider text-slate-500 uppercase">Block</span>
              <span class="text-offwhite text-xs font-semibold">{{
                txModel.blockHeight ?? '-'
              }}</span>
            </div>
            <div class="flex items-baseline justify-between border-t border-slate-700/30 pt-2">
              <span class="text-xs font-bold tracking-wider text-slate-500 uppercase"
                >Network Fee</span
              >
              <span class="text-offwhite text-xs font-semibold">{{ txModel.fee }} PEP</span>
            </div>
          </PepCard>

          <PepCopyableId label="Transaction ID" :id="txModel.txid" />

          <PepButton @click="openExplorer" class="w-full"> View on Explorer </PepButton>
        </div>
      </div>
    </div>
  </PepMainLayout>
</template>
