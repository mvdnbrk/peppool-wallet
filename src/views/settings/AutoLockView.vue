<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';

const router = useRouter();
const walletStore = useWalletStore();

const options = [
  { label: '15 Minutes', val: 15 },
  { label: '30 Minutes', val: 30 },
  { label: '1 Hour', val: 60 },
  { label: '3 Hours', val: 180 }
];

function selectDuration(val: number) {
  walletStore.setLockDuration(val);
  setTimeout(() => router.back(), 200);
}
</script>

<template>
  <div class="relative flex h-full flex-col p-6">
    <PepPageHeader title="Auto-Lock" />

    <div class="mt-0 flex-1 space-y-6">
      <p class="px-1 text-sm text-slate-400">
        Select the desired duration before the extension locks.
      </p>

      <PepList>
        <PepListItem
          v-for="opt in options"
          :key="opt.val"
          :label="opt.label"
          :selected="walletStore.lockDuration === opt.val"
          @click="selectDuration(opt.val)"
        />
      </PepList>
    </div>
  </div>
</template>
