<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useWalletStore } from '../../../stores/wallet';
import { RIBBITS_PER_PEP, formatFiat } from '../../../utils/constants';
import PepInput from './PepInput.vue';
import PepIcon from '../PepIcon.vue';

interface Props {
  ribbits: number;
  price: number; // Price of 1 PEP in current fiat
  isFiatMode: boolean;
  disabled?: boolean;
  label?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  label: 'Amount',
  id: 'amount',
  isFiatMode: false
});

const emit = defineEmits<{
  'update:ribbits': [val: number];
  'update:isFiatMode': [val: boolean];
  'change-max': [isMax: boolean];
}>();

const walletStore = useWalletStore();
const inputAmount = ref('');
let isInternalSync = false;

// Helpers
const ribbitsToPep = (r: number) => r / RIBBITS_PER_PEP;
const pepToRibbits = (p: number) => Math.round(p * RIBBITS_PER_PEP);

const pepString = computed(() => {
  if (props.ribbits === 0) return '';
  const s = props.ribbits.toString().padStart(9, '0');
  const integerPart = s.slice(0, -8).replace(/^0+(?=\d)/, '');
  const decimalPart = s.slice(-8).replace(/0+$/, '');
  return decimalPart ? `${integerPart || '0'}.${decimalPart}` : integerPart || '0';
});

// Sync EXTERNAL ribbits to INTERNAL text input
watch(
  [() => props.ribbits, () => props.isFiatMode],
  ([newRibbits, fiatMode]) => {
    if (isInternalSync) return;

    if (newRibbits === 0) {
      inputAmount.value = '';
      return;
    }

    if (fiatMode) {
      inputAmount.value = formatFiat(ribbitsToPep(newRibbits) * props.price);
    } else {
      inputAmount.value = pepString.value;
    }
  },
  { immediate: true }
);

// Sync INTERNAL text input to EXTERNAL ribbits
watch(inputAmount, (newVal, oldVal) => {
  // Normalize comma to dot
  if (newVal.includes(',')) {
    inputAmount.value = newVal.replace(',', '.');
    return;
  }

  isInternalSync = true;
  const numeric = parseFloat(newVal);

  if (isNaN(numeric) || numeric <= 0) {
    emit('update:ribbits', 0);
  } else {
    const pepVal = props.isFiatMode ? numeric / props.price : numeric;
    emit('update:ribbits', pepToRibbits(pepVal));
  }

  // If user is typing, we are no longer in "MAX" state
  if (newVal !== oldVal) {
    emit('change-max', false);
  }

  isInternalSync = false;
});

function toggleMode() {
  emit('update:isFiatMode', !props.isFiatMode);
}
</script>

<template>
  <div class="space-y-1">
    <div class="flex items-end justify-between px-1">
      <label :for="id" class="text-offwhite block text-sm font-medium">{{ label }}</label>
      <div v-if="$slots.extra" class="flex items-center space-x-2">
        <slot name="extra" />
      </div>
    </div>

    <PepInput
      :id="id"
      v-model="inputAmount"
      placeholder="0.00"
      inputmode="decimal"
      :disabled="disabled"
      inputClass="font-bold"
    >
      <template #prefix>
        <span class="font-bold text-slate-500">
          {{ isFiatMode ? walletStore.selectedCurrency : 'PEP' }}
        </span>
      </template>

      <template #suffix>
        <button
          type="button"
          @click="toggleMode"
          :disabled="disabled"
          class="hover:text-pep-green-light mr-1 shrink-0 cursor-pointer rounded p-1 text-slate-500 transition-colors disabled:cursor-not-allowed"
          title="Switch currency"
          tabindex="-1"
        >
          <PepIcon name="swap" size="16" />
        </button>
      </template>
    </PepInput>
  </div>
</template>
