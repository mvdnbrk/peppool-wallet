<script setup lang="ts">
import { provide, computed } from 'vue';

interface Props {
  id: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits(['submit']);

const isFormDisabled = computed(() => props.loading);

// Provide the disabled state to all child inputs
provide('isFormDisabled', isFormDisabled);

function handleSubmit(e: Event) {
  if (props.loading) {
    e.preventDefault();
    return;
  }
  emit('submit', e);
}
</script>

<template>
  <form :id="id" class="flex flex-1 flex-col gap-6" @submit.prevent="handleSubmit">
    <div class="flex-1 space-y-6">
      <slot />
    </div>
  </form>
</template>
