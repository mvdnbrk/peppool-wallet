<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import PepButton from './PepButton.vue';

interface Props {
  loading?: boolean;
  minLoadingMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  minLoadingMs: 0
});

const displayedLoading = ref(false);
let startTimestamp = 0;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.loading,
  (isLoading) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (isLoading) {
      startTimestamp = Date.now();
      displayedLoading.value = true;
      return;
    }

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
  },
  { immediate: true }
);

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<template>
  <PepButton v-bind="$attrs" :loading="displayedLoading">
    <slot />
  </PepButton>
</template>
