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

// SINGLE SOURCE OF TRUTH: props.ribbits.
//
// `displayText` is the canonical text rendering of ribbits in the current mode.
// `editBuffer` is non-null only while the user is mid-edit. It overrides the
// displayed value so transient/imprecise input ("1.", "0.50000000") survives
// across the user→ribbits→display round-trip without the cursor jumping.
//
// External writes (MAX click, currency toggle, parent prop change) replace the
// displayed value via `displayText` and never round-trip through parsing.

const editBuffer = ref<string | null>(null);

const pepString = computed(() => {
  if (props.ribbits === 0) return '';
  const s = props.ribbits.toString().padStart(9, '0');
  const integerPart = s.slice(0, -8).replace(/^0+(?=\d)/, '');
  const decimalPart = s.slice(-8).replace(/0+$/, '');
  return decimalPart ? `${integerPart || '0'}.${decimalPart}` : integerPart || '0';
});

const displayText = computed(() => {
  if (props.ribbits === 0) return '';
  if (props.isFiatMode) {
    return formatFiat((props.ribbits / RIBBITS_PER_PEP) * props.price);
  }
  return pepString.value;
});

const inputValue = computed(() => editBuffer.value ?? displayText.value);

function decimalPattern() {
  const maxDecimals = props.isFiatMode ? 2 : 8;
  return new RegExp(`^\\d*(\\.\\d{0,${maxDecimals}})?$`);
}

function parseToRibbits(text: string): number {
  const numeric = parseFloat(text);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  const pepVal = props.isFiatMode && props.price > 0 ? numeric / props.price : numeric;
  return Math.round(pepVal * RIBBITS_PER_PEP);
}

// Block invalid characters at the source so they never enter the field
// (e.g. "x" or "e" — parseFloat would silently truncate "1x" back to 1).
function handleBeforeInput(e: Event) {
  const ev = e as InputEvent;
  if (!ev.data) return; // deletions, IME composition end, etc.

  const target = ev.target as HTMLInputElement;
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? target.value.length;
  const inserted = ev.data.replace(/,/g, '.');
  const next = target.value.slice(0, start) + inserted + target.value.slice(end);

  if (next !== '' && !decimalPattern().test(next)) {
    ev.preventDefault();
  }
}

function handleInput(text: string) {
  // Programmatic / paste fallback: beforeinput catches typed garbage, but
  // pasted strings (and tests using setValue) bypass it.
  const normalized = text.replace(/,/g, '.');
  if (normalized !== '' && !decimalPattern().test(normalized)) {
    // Reject by snapping back to whatever the user had before this edit.
    editBuffer.value = editBuffer.value ?? displayText.value;
    return;
  }

  editBuffer.value = normalized;
  emit('update:ribbits', parseToRibbits(normalized));
  emit('change-max', false);
}

function handleBlur() {
  // Drop the buffer so the canonical display takes over (re-formats e.g.
  // "1.50" → "1.5", drops trailing dots).
  editBuffer.value = null;
}

// External writes invalidate any in-flight edit buffer:
//   - currency toggle: text representation changes meaning entirely
//   - prop ribbits change that didn't originate from our last keystroke (MAX,
//     parent reset). When the parent simply echoes our emit, the buffer's
//     parsed ribbits matches props.ribbits and we keep it (cursor preserved).
watch(
  () => props.isFiatMode,
  () => {
    editBuffer.value = null;
  }
);

watch(
  () => props.ribbits,
  (newRibbits) => {
    if (editBuffer.value === null) return;
    if (parseToRibbits(editBuffer.value) === newRibbits) return;
    editBuffer.value = null;
  }
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
      :modelValue="inputValue"
      placeholder="0.00"
      inputmode="decimal"
      :disabled="disabled"
      inputClass="font-bold"
      @update:modelValue="handleInput"
      @beforeinput="handleBeforeInput"
      @blur="handleBlur"
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
