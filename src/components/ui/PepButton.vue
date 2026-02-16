<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
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
    class="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[40px]"
    :class="[
      {
        'bg-pep-green text-offwhite hover:bg-pep-green-light focus-visible:outline-pep-green': variant === 'primary',
        'bg-red-600 text-offwhite hover:bg-red-500 focus-visible:outline-red-600': variant === 'danger',
        'bg-slate-800 text-offwhite hover:bg-slate-700 border border-slate-700': variant === 'secondary',
        'bg-transparent text-slate-500 hover:text-white': variant === 'ghost',
        'cursor-pointer': !disabled && !loading
      }
    ]"
  >
    <PepSpinner v-if="loading" size="20" />
    <span v-else><slot /></span>
  </button>
</template>
