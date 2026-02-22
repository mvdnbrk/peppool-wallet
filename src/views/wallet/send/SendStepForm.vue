<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  form: any;
  isLoadingRequirements: boolean;
  isInsufficientFunds: boolean;
  currentPrice: number;
  displayBalance: string;
  displayFee: string;
}>();

const emit = defineEmits(['address-blur', 'set-max', 'next']);

const recipientInput = ref<any>(null);

onMounted(() => {
  if (!props.form.recipient) {
    setTimeout(() => recipientInput.value?.focus(), 50);
  }
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <PepForm id="send-review-form" class="flex flex-1 flex-col" @submit="$emit('next')">
      <PepInput
        ref="recipientInput"
        v-model="form.recipient"
        id="recipient"
        label="Recipient Address"
        placeholder="Enter address"
        :error="form.errors.recipient"
        :disabled="form.isProcessing || isLoadingRequirements"
        clearable
        autofocus
        @blur="$emit('address-blur')"
      />

      <div class="space-y-4">
        <div class="px-1">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold tracking-wider text-slate-500 uppercase"
              >Available Balance</span
            >
            <span id="available-balance" class="text-xs font-bold text-slate-300">{{
              displayBalance
            }}</span>
          </div>
        </div>

        <PepAmountInput
          v-model:ribbits="form.amountRibbits"
          v-model:isFiatMode="form.isFiatMode"
          :price="currentPrice"
          :disabled="form.isProcessing || isLoadingRequirements"
          @change-max="form.isMax = $event"
        >
          <template #extra>
            <button
              id="send-max-button"
              type="button"
              @click="$emit('set-max')"
              :disabled="form.isProcessing || isLoadingRequirements"
              class="text-pep-green-light hover:text-pep-green cursor-pointer text-xs font-bold tracking-wider uppercase disabled:cursor-not-allowed disabled:opacity-50"
              tabindex="-1"
            >
              MAX
            </button>
          </template>
        </PepAmountInput>

        <div class="px-1">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold tracking-wider text-slate-500 uppercase"
              >Estimated Fee</span
            >
            <span class="text-xs font-bold text-slate-300">{{ displayFee }}</span>
          </div>
        </div>
      </div>

      <div class="mt-2 flex h-6 items-center justify-center">
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
