<script setup lang="ts">
import PepSpinner from './PepSpinner.vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="flex min-h-[40px] items-center justify-center rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      {
        'bg-pep-green text-offwhite hover:bg-pep-green-light focus-visible:outline-pep-green':
          variant === 'primary',
        'text-offwhite bg-red-600 hover:bg-red-500 focus-visible:outline-red-600':
          variant === 'danger',
        'text-offwhite border border-slate-700 bg-slate-800 hover:bg-slate-700':
          variant === 'secondary',
        'cursor-pointer': !disabled && !loading
      }
    ]"
  >
    <PepSpinner v-if="loading" size="20" />
    <span v-else><slot /></span>
  </button>
</template>
