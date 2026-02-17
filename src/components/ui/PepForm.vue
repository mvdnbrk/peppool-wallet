<script setup lang="ts">
import { provide, computed } from 'vue';

interface Props {
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
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <slot />

    <div v-if="$slots.actions" class="pt-6">
      <slot name="actions" />
    </div>
  </form>
</template>
