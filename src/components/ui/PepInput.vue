<script setup lang="ts">
import { inject, computed, type ComputedRef } from 'vue';

interface Props {
  modelValue: string | number | null;
  label?: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  autofocus?: boolean;
  inputClass?: string;
  clearable?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autofocus: false,
  inputClass: '',
  clearable: false,
  disabled: false
});
const emit = defineEmits(['update:modelValue', 'blur']);

const formDisabled = inject<ComputedRef<boolean>>(
  'isFormDisabled',
  computed(() => false)
);
const isDisabled = computed(() => props.disabled || formDisabled.value);

function handleClear() {
  if (isDisabled.value) return;
  emit('update:modelValue', '');
}
</script>

<template>
  <PepInputGroup :label="label" :id="id">
    <div
      class="flex items-center rounded-md bg-white/5 outline-1 -outline-offset-1 transition-opacity duration-200 focus-within:outline-2 focus-within:-outline-offset-2"
      :class="[
        error
          ? 'outline-red-500/50 focus-within:outline-red-400'
          : 'focus-within:outline-pep-green outline-white/10',
        isDisabled ? 'cursor-not-allowed opacity-50' : ''
      ]"
    >
      <div v-if="$slots.prefix" class="shrink-0 pl-3 text-sm text-slate-500 select-none">
        <slot name="prefix" />
      </div>
      <input
        :id="id"
        :type="type || 'text'"
        :value="modelValue"
        :autofocus="autofocus"
        :disabled="isDisabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        :placeholder="placeholder"
        class="text-offwhite block min-w-0 grow bg-transparent py-1.5 text-base placeholder:text-gray-500 focus:outline-none sm:text-sm"
        :class="[
          error ? 'text-red-400 placeholder:text-red-400/70' : '',
          $slots.prefix ? 'pl-1' : 'pl-3',
          isDisabled ? 'cursor-not-allowed' : '',
          inputClass
        ]"
        :aria-invalid="!!error"
        :aria-describedby="`${id}-error`"
      />

      <div
        class="flex shrink-0 items-center pr-3 pl-2"
        :class="{ 'pointer-events-none': !props.clearable || !modelValue || isDisabled }"
      >
        <button
          v-if="props.clearable && modelValue && !error"
          type="button"
          :disabled="isDisabled"
          @mousedown.prevent="handleClear"
          class="cursor-pointer text-slate-500 transition-colors hover:text-slate-300 disabled:cursor-not-allowed"
        >
          <PepIcon name="clear" size="16" />
        </button>
        <PepIcon v-else-if="error" name="error" class="text-red-400" size="16" />
        <div v-if="$slots.suffix && !error">
          <slot name="suffix" />
        </div>
      </div>
    </div>
    <p
      :id="`${id}-error`"
      class="mt-2 text-sm font-medium text-red-400 transition-opacity duration-200"
      :class="error ? 'opacity-100' : 'pointer-events-none opacity-0 select-none'"
    >
      {{ error || '&nbsp;' }}
    </p>
  </PepInputGroup>
</template>
