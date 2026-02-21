<script setup lang="ts">
import { useApp } from '@/composables/useApp';

defineProps<{
  form: any;
  tx: any;
  displayFee: string;
}>();

defineEmits(['send', 'cancel']);
const { wallet: walletStore } = useApp();
</script>

<template>
  <div class="flex flex-1 flex-col">
    <PepForm
      id="send-transaction-form"
      :loading="form.isProcessing"
      @submit="$emit('send')"
      class="flex flex-1 flex-col"
    >
      <div class="space-y-4 rounded-2xl border border-slate-700 bg-slate-800 p-4 text-left">
        <div class="flex flex-col space-y-0.5">
          <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
            >Sending</span
          >
          <span class="text-offwhite text-xl font-bold">{{ tx.amountPep }} PEP</span>
        </div>

        <div class="flex flex-col space-y-0.5">
          <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">To</span>
          <span class="font-mono text-xs leading-relaxed break-all text-slate-300">{{
            form.recipient
          }}</span>
        </div>

        <div class="flex flex-col space-y-0.5">
          <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
            >Network Fee</span
          >
          <span class="text-sm font-bold text-slate-400">{{ displayFee }}</span>
        </div>
      </div>

      <div v-if="!walletStore.isMnemonicLoaded" class="mt-0">
        <PepPasswordInput
          v-model="form.password"
          id="confirm-password"
          label="Enter Password to Confirm"
          placeholder="Enter your password"
          :error="form.errors.general"
        />
      </div>

      <div v-if="walletStore.isMnemonicLoaded" class="mt-2 flex h-6 items-center justify-center">
        <p
          class="text-center text-sm font-medium text-red-400 transition-opacity duration-200"
          :class="form.hasError() ? 'opacity-100' : 'pointer-events-none opacity-0 select-none'"
        >
          {{ form.errors.general }}
        </p>
      </div>
    </PepForm>
  </div>
</template>
