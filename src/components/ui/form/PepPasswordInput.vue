<script setup lang="ts">
import { ref, inject, computed, type ComputedRef } from 'vue';

interface Props {
  modelValue: string | number | null;
  label?: string;
  id: string;
  placeholder?: string;
  error?: string;
  autofocus?: boolean;
  inputClass?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autofocus: false,
  inputClass: '',
  disabled: false,
  placeholder: 'Enter your password'
});
defineEmits(['update:modelValue']);

const formDisabled = inject<ComputedRef<boolean>>(
  'isFormDisabled',
  computed(() => false)
);
const isDisabled = computed(() => props.disabled || formDisabled.value);

const showPassword = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

// Expose focus method to parent
defineExpose({
  focus: () => inputRef.value?.focus()
});
</script>

<template>
  <PepInputGroup :label="label" :id="id">
    <div class="grid grid-cols-1">
      <input
        :id="id"
        ref="inputRef"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :autofocus="autofocus"
        :disabled="isDisabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="isDisabled ? '' : placeholder"
        class="text-offwhite focus:outline-pep-green col-start-1 row-start-1 block w-full rounded-md bg-white/5 py-1.5 pr-10 pl-3 text-base outline-1 -outline-offset-1 outline-white/10 transition-all placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        :class="[
          {
            'text-red-400 outline-red-500/50 placeholder:text-red-400/70 focus:outline-red-400':
              error && !isDisabled
          },
          inputClass
        ]"
        :aria-invalid="!!error"
        :aria-describedby="`${id}-error`"
      />

      <div class="pointer-events-none col-start-1 row-start-1 flex items-center justify-end pr-3">
        <PepIcon v-if="error && !isDisabled" name="error" class="text-red-400" size="16" />

        <button
          v-else
          type="button"
          @click="showPassword = !showPassword"
          :disabled="isDisabled"
          class="pointer-events-auto flex cursor-pointer items-center justify-center text-gray-500 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          tabindex="-1"
        >
          <PepIcon :name="showPassword ? 'eye' : 'eye-slash'" size="16" />
        </button>
      </div>
    </div>
    <p
      :id="`${id}-error`"
      class="mt-2 text-left text-sm font-medium text-red-400 transition-opacity duration-200"
      :class="error ? 'opacity-100' : 'pointer-events-none opacity-0 select-none'"
    >
      {{ error || '&nbsp;' }}
    </p>
  </PepInputGroup>
</template>
