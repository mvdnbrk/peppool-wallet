<script setup lang="ts">
import { useWalletStore } from '../stores/wallet';
import { formatFiat } from '../utils/constants';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';

const walletStore = useWalletStore();
const router = useRouter();

onMounted(async () => {
  if (walletStore.isUnlocked) {
    await walletStore.refreshBalance();
    walletStore.startPolling();
  }
});

onUnmounted(() => {
  walletStore.stopPolling();
});

function openDetail(txid: string) {
  router.push(`/tx/${txid}`);
}
</script>

<template>
  <div class="flex flex-col h-full px-6 pt-4 pb-0" @mousedown="walletStore.resetLockTimer" @keydown="walletStore.resetLockTimer">
    <!-- Balance Card -->
    <div class="bg-slate-800 rounded-2xl p-6 text-center space-y-2 border border-slate-700 relative group mb-4">
      <p class="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Balance</p>
      <div class="flex items-baseline justify-center space-x-2">
        <span class="text-4xl font-bold text-offwhite">{{ parseFloat(walletStore.balance.toFixed(8)) }}</span>
        <span class="text-pep-green-light font-bold">PEP</span>
      </div>
      <p class="text-slate-500 text-sm font-bold">{{ walletStore.currencySymbol }}{{ formatFiat(walletStore.balanceFiat) }} {{ walletStore.selectedCurrency }}</p>
    </div>

    <!-- Actions -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <PepButton @click="router.push('/send')">
        Send
      </PepButton>
      <PepButton @click="router.push('/receive')" variant="secondary">
        Receive
      </PepButton>
    </div>

    <!-- Recent Activity -->
    <div class="flex-1 space-y-3 overflow-hidden flex flex-col min-h-0">
      <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Recent Activity</h3>

      <div v-if="walletStore.transactions.length === 0" class="flex-1 flex flex-col items-center justify-center text-slate-600">
        <p class="text-sm">No transactions yet</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto pr-1 space-y-2 pb-4">
        <div
          v-for="tx in walletStore.transactions"
          :key="tx.txid"
          @click="openDetail(tx.txid)"
          class="bg-slate-800/30 border border-slate-700/50 rounded-xl p-3 flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div class="flex items-center space-x-3">
            <div>
              <p
                class="text-sm font-bold leading-tight"
                :class="tx.isOutgoing ? 'text-offwhite' : 'text-pep-green-light'"
              >
                {{ tx.isOutgoing ? 'Sent' : 'Received' }}
              </p>
              <p class="text-[10px] text-slate-500 font-mono">
                {{ tx.txidShort }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold leading-tight text-offwhite">
              {{ tx.formattedAmount }} PEP
            </p>
            <p class="text-[10px] text-slate-500">
              {{ tx.isConfirmed ? 'Confirmed' : 'In Mempool' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <PepFooter />
  </div>
</template>
