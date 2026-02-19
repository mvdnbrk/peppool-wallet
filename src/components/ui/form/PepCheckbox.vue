<script setup lang="ts">
import { inject, computed, type ComputedRef } from 'vue';

interface Props {
  modelValue: boolean;
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
defineEmits(['update:modelValue']);

const formDisabled = inject<ComputedRef<boolean>>(
  'isFormDisabled',
  computed(() => false)
);
const isDisabled = computed(() => props.disabled || formDisabled.value);
</script>

<template>
  <div class="flex gap-3 transition-opacity duration-200" :class="{ 'opacity-50': isDisabled }">
    <div class="flex h-6 shrink-0 items-center">
      <div class="group grid size-5 grid-cols-1">
        <input
          :id="id"
          type="checkbox"
          :checked="modelValue"
          :disabled="isDisabled"
          @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
          class="checked:border-pep-green checked:bg-pep-green focus-visible:outline-pep-green hover:border-pep-green-light col-start-1 row-start-1 cursor-pointer appearance-none rounded-md border border-white/40 bg-white/5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
        />
        <div
          class="pointer-events-none col-start-1 row-start-1 flex size-4 items-center justify-center self-center justify-self-center"
        >
          <PepIcon
            name="check"
            size="16"
            class="text-offwhite transition-opacity"
            :class="modelValue ? 'opacity-100' : 'opacity-0'"
          />
        </div>
      </div>
    </div>
    <div class="text-sm/6">
      <label
        :for="id"
        class="text-offwhite font-medium"
        :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        >{{ label }}</label
      >
      <p v-if="description" class="text-xs text-slate-500">{{ description }}</p>
    </div>
  </div>
</template>
