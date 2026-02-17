<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  minLoadingMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
  minLoadingMs: 0
});

const displayedLoading = ref(false);
let startTimestamp = 0;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(() => props.loading, (isLoading) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  if (isLoading) {
    startTimestamp = Date.now();
    displayedLoading.value = true;
    return;
  }

  // Not loading anymore, but check if we need to hold the spinner
  const elapsed = Date.now() - startTimestamp;
  const remaining = props.minLoadingMs - elapsed;

  if (remaining > 0) {
    timeoutId = setTimeout(() => {
      displayedLoading.value = false;
      timeoutId = null;
    }, remaining);
  } else {
    displayedLoading.value = false;
  }
}, { immediate: true });

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || displayedLoading"
    class="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[40px]"
    :class="[
      {
        'bg-pep-green text-offwhite hover:bg-pep-green-light focus-visible:outline-pep-green': variant === 'primary',
        'bg-red-600 text-offwhite hover:bg-red-500 focus-visible:outline-red-600': variant === 'danger',
        'bg-slate-800 text-offwhite hover:bg-slate-700 border border-slate-700': variant === 'secondary',
        'bg-transparent text-slate-500 hover:text-white': variant === 'ghost',
        'cursor-pointer': !disabled && !displayedLoading
      }
    ]"
  >
    <PepSpinner v-if="displayedLoading" size="20" />
    <span v-else><slot /></span>
  </button>
</template>
