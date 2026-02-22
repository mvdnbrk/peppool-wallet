<script setup lang="ts">
import { formatFiat, formatAmount } from '@/utils/constants';
import { useApp } from '@/composables/useApp';
import { onMounted, onUnmounted, computed, ref } from 'vue';

const { router, wallet: walletStore } = useApp();

const isLoadingMore = ref(false);

const balanceFontSize = computed(() => {
  const len = formatAmount(walletStore.balance).length;

  switch (true) {
    case len > 16:
      return 'text-xl';
    case len > 12:
      return 'text-2xl';
    case len > 10:
      return 'text-3xl';
    default:
      return 'text-4xl';
  }
});

onMounted(async () => {
  if (walletStore.isUnlocked) {
    await walletStore.refreshBalance();
  }
});

onUnmounted(() => {
  // No-op - polling handled by App.vue
});

function openDetail(txid: string) {
  router.push(`/tx/${txid}`);
}

async function handleLoadMore() {
  if (isLoadingMore.value) return;
  isLoadingMore.value = true;
  try {
    await walletStore.fetchMoreTransactions();
  } catch (e) {
    // Error handled in store
  } finally {
    isLoadingMore.value = false;
  }
}
</script>

<template>
  <PepMainLayout>
    <!-- Balance Card -->
    <div
      class="group relative mb-4 space-y-2 rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center"
    >
      <p class="text-sm font-bold tracking-wider text-slate-400 uppercase">Total Balance</p>
      <div class="flex items-baseline justify-center space-x-2">
        <span class="text-offwhite font-bold transition-all duration-300" :class="balanceFontSize">
          {{ formatAmount(walletStore.balance) }}
        </span>
        <span class="text-pep-green-light font-bold">PEP</span>
      </div>
      <p class="text-sm font-bold text-slate-500">
        {{ walletStore.currencySymbol }}{{ formatFiat(walletStore.balanceFiat) }}
        {{ walletStore.selectedCurrency }}
      </p>
    </div>

    <!-- Actions -->
    <div class="mb-6 grid grid-cols-2 gap-4">
      <PepButton @click="router.push('/send')"> Send </PepButton>
      <PepButton @click="router.push('/receive')" variant="secondary"> Receive </PepButton>
    </div>

    <!-- Recent Activity -->
    <div
      v-if="walletStore.transactions.length > 0"
      class="flex min-h-0 flex-1 flex-col space-y-3 overflow-hidden"
    >
      <h3 class="ml-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        Recent Activity
      </h3>

      <div class="flex-1 overflow-y-auto pr-1 pb-4">
        <div class="space-y-2">
          <PepTransactionItem
            v-for="tx in walletStore.transactions"
            :key="tx.txid"
            :tx="tx"
            @click="openDetail(tx.txid)"
          />
        </div>

        <div v-if="walletStore.canLoadMore" class="mt-4 flex justify-center">
          <button
            type="button"
            @click="handleLoadMore"
            :disabled="isLoadingMore"
            class="text-pep-green-light hover:text-pep-green cursor-pointer text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isLoadingMore ? 'Loading...' : 'Load more' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-1 flex-col items-center justify-center text-slate-600">
      <p class="text-sm">No transactions yet</p>
    </div>
  </PepMainLayout>
</template>
