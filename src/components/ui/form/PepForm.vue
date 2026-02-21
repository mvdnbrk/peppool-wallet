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
  <form :id="id" @submit.prevent="handleSubmit" class="flex flex-1 flex-col gap-6">
    <div class="flex-1 space-y-6">
      <slot />
    </div>

    <div v-if="$slots.actions" class="pt-0">
      <slot name="actions" />
    </div>
  </form>
</template>
