<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useApp } from '@/composables/useApp';

import { RIBBITS_PER_PEP } from '@/utils/constants';
import { formatFiat } from '@/utils/price';
import PepInput from './PepInput.vue';
import PepIcon from '@/components/ui/PepIcon.vue';

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

const { settings: settingsStore } = useApp();

const inputAmount = ref('');
let isInternalSync = false;
let isExternalWrite = false;

function decimalPattern() {
  const maxDecimals = props.isFiatMode ? 2 : 8;
  return new RegExp(`^\\d*(\\.\\d{0,${maxDecimals}})?$`);
}

// Block invalid characters at the source so they never enter the field
// (e.g. typing "x" or "e" into "1" must not produce "1x" or "1e", which
// parseFloat would silently truncate back to "1").
function handleBeforeInput(e: Event) {
  const ev = e as InputEvent;
  // Allow deletions and other non-insertion edits.
  if (!ev.data) return;

  const target = ev.target as HTMLInputElement;
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? target.value.length;
  const inserted = ev.data.replace(',', '.');
  const next = target.value.slice(0, start) + inserted + target.value.slice(end);

  if (next !== '' && !decimalPattern().test(next)) {
    ev.preventDefault();
  }
}

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

    const next =
      newRibbits === 0
        ? ''
        : fiatMode
          ? formatFiat(ribbitsToPep(newRibbits) * props.price)
          : pepString.value;
    if (next === inputAmount.value) return;
    isExternalWrite = true;
    inputAmount.value = next;
    // The sync internal watcher (set up below) clears the flag on fire, but
    // on the immediate mount-tick it isn't subscribed yet. Reset defensively.
    isExternalWrite = false;
  },
  { immediate: true }
);

// Sync INTERNAL text input to EXTERNAL ribbits.
// flush: 'sync' so the isExternalWrite flag set by the external watcher is read
// in the same tick — without it, multiple synchronous changes batch and the flag
// leaks onto a subsequent user edit.
watch(
  inputAmount,
  (newVal, oldVal) => {
    // External writes (MAX, currency toggle, prop sync) trust the formatted value
    // even if it exceeds the per-mode decimal cap (e.g. formatFiat may emit
    // "0.0023" for tiny amounts). Validation only applies to user-driven edits.
    const fromExternal = isExternalWrite;
    isExternalWrite = false;

    // Normalize comma to dot (covers paste — beforeinput rewrites typed commas).
    if (!fromExternal && newVal.includes(',')) {
      inputAmount.value = newVal.replace(/,/g, '.');
      return;
    }

    // Pasted text may still contain garbage; strip it back to the last valid value.
    if (!fromExternal && newVal !== '' && !decimalPattern().test(newVal)) {
      inputAmount.value = oldVal;
      return;
    }

    isInternalSync = true;
    const numeric = parseFloat(newVal);

    if (isNaN(numeric) || numeric <= 0) {
      emit('update:ribbits', 0);
    } else {
      const pepVal = props.isFiatMode && props.price > 0 ? numeric / props.price : numeric;
      emit('update:ribbits', pepToRibbits(pepVal));
    }

    // If user is typing, we are no longer in "MAX" state. External writes
    // (including the MAX click itself) must not clear the MAX flag.
    if (!fromExternal && newVal !== oldVal) {
      emit('change-max', false);
    }

    isInternalSync = false;
  },
  { flush: 'sync' }
);

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
      @beforeinput="handleBeforeInput"
    >
      <template #prefix>
        <span class="font-bold text-slate-500">
          {{ isFiatMode ? settingsStore.settings.currency : 'PEP' }}
        </span>
      </template>

      <template #suffix>
        <button
          :id="`${id}-currency-toggle`"
          type="button"
          @click="toggleMode"
          :disabled="disabled"
          class="hover:text-pep-green-light mr-1 shrink-0 cursor-pointer rounded p-1 text-slate-500 transition-colors disabled:cursor-not-allowed"
          aria-label="Switch currency"
          title="Switch currency"
          tabindex="-1"
        >
          <PepIcon name="swap" size="16" />
        </button>
      </template>
    </PepInput>
  </div>
</template>
