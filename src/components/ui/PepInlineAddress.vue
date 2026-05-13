<script setup lang="ts">
import { computed } from 'vue';
import { truncateId } from '@/utils/constants';
import { useWalletStore } from '@/stores/wallet';

const props = defineProps<{
  address: string | null;
}>();

const walletStore = useWalletStore();

const truncated = computed(() => (props.address ? truncateId(props.address) : null));
const isMyAddress = computed(() => !!props.address && props.address === walletStore.address);
</script>

<template>
  <span class="flex min-w-0 flex-col gap-0.5">
    <span v-if="isMyAddress" class="text-pepe-green text-[10px] font-bold tracking-wider uppercase">
      My Address
    </span>
    <span
      v-if="truncated"
      class="inline-flex min-w-0 font-mono text-xs text-slate-300"
      :title="truncated.full"
    >
      <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{{
        truncated.start
      }}</span>
      <span class="whitespace-nowrap">{{ truncated.end }}</span>
    </span>
    <span v-else class="text-xs text-slate-500 italic">Non-standard script</span>
  </span>
</template>
