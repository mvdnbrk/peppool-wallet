<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import { fetchTransaction } from '../utils/api';
import { Transaction } from '../models/Transaction';
import { truncateId } from '../utils/constants';

const route = useRoute();
const router = useRouter();
const walletStore = useWalletStore();

const txid = route.params.txid as string;
const txModel = ref<Transaction | null>(null);
const isLoading = ref(true);
const error = ref('');

const txidStart = computed(() => truncateId(txid).start);
const txidEnd = computed(() => truncateId(txid).end);

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
  <div class="flex flex-col h-full px-6 pt-4 pb-0 relative">
    <PepHeader title="Transaction" :onBack="() => router.push('/dashboard')" />

    <div class="mt-16 flex-1 flex flex-col min-h-0">
      <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center space-y-4">
        <PepSpinner size="32" class="text-pep-green" />
        <p class="text-slate-500 text-sm font-bold uppercase tracking-widest">Loading Details...</p>
      </div>

      <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
        <p class="text-red-400 font-bold">{{ error }}</p>
      </div>

      <div v-else-if="txModel" class="flex-1 overflow-y-auto pr-1 text-center space-y-6 pb-4">
        <div class="flex flex-col items-center space-y-1">
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
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
          <PepCard class="p-3 space-y-2">
            <div class="flex justify-between items-baseline">
              <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">Status</span>
              <span class="text-xs font-bold uppercase tracking-wider" :class="txModel.isConfirmed ? 'text-pep-green-light' : 'text-yellow-500'">
                {{ txModel.isConfirmed ? 'Confirmed' : 'In Mempool' }}
              </span>
            </div>
            <div class="flex justify-between items-baseline pt-2 border-t border-slate-700/30">
              <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">Date</span>
              <span class="text-xs text-offwhite font-semibold">{{ txModel.date || '-' }}</span>
            </div>
            <div class="flex justify-between items-baseline pt-2 border-t border-slate-700/30">
              <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">Block</span>
              <span class="text-xs text-offwhite font-semibold">{{ txModel.blockHeight ?? '-' }}</span>
            </div>
            <div class="flex justify-between items-baseline pt-2 border-t border-slate-700/30">
              <span class="text-xs text-slate-500 font-bold uppercase tracking-wider">Network Fee</span>
              <span class="text-xs text-offwhite font-semibold">{{ txModel.fee }} PEP</span>
            </div>
          </PepCard>

          <PepInputGroup label="Transaction ID" id="txid-value" labelClass="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">
            <div class="flex items-center gap-2">
              <div class="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 overflow-hidden flex items-center h-[38px]">
                <span class="inline-flex max-w-full min-w-0 text-[11px] font-mono text-slate-400">
                  <span class="flex min-w-0">
                    <span class="overflow-hidden text-ellipsis whitespace-nowrap min-w-0">{{ txidStart }}</span>
                  </span>
                  <span class="whitespace-nowrap">{{ txidEnd }}</span>
                </span>
              </div>
              
              <span class="inline-flex">
                <el-copyable id="txid-value" class="hidden">{{ txModel.txid }}</el-copyable>
                <button 
                  type="button" 
                  command="--copy" 
                  commandfor="txid-value" 
                  class="group inline-flex items-center justify-center w-[38px] h-[38px] rounded-lg bg-slate-800 border border-slate-700 text-offwhite hover:text-white copied:text-pep-green-light copied:hover:text-pep-green-light transition-colors cursor-pointer shrink-0"
                >
                  <PepIcon name="copy" class="w-5 h-5 copied:hidden" />
                  <PepIcon name="check" class="w-5 h-5 hidden copied:block" />
                </button>
              </span>
            </div>
          </PepInputGroup>

          <PepButton @click="openExplorer" class="w-full">
            View on Explorer
          </PepButton>
        </div>
      </div>
    </div>
    <PepFooter />
  </div>
</template>
