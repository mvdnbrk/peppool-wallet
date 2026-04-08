<script setup lang="ts" generic="T extends string | number">
import PepIcon from '@/components/ui/PepIcon.vue';

interface Option<T> {
  label: string;
  value: T;
  description?: string;
}

defineProps<{
  modelValue: T;
  options: Option<T>[];
  name: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: T];
}>();
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30">
    <label
      v-for="opt in options"
      :key="opt.value"
      class="group relative flex cursor-pointer items-center justify-between border-b border-slate-700/50 p-4 transition-all last:border-0 hover:bg-slate-800"
      :class="{ 'bg-slate-800/50': modelValue === opt.value }"
    >
      <input
        type="radio"
        :name="name"
        :value="opt.value"
        :checked="modelValue === opt.value"
        class="peer sr-only"
        @change="emit('update:modelValue', opt.value)"
      />

      <div class="flex flex-col">
        <span class="text-offwhite text-sm font-semibold transition-colors group-hover:text-white">
          {{ opt.label }}
        </span>
        <span v-if="opt.description" class="mt-0.5 text-[10px] leading-tight text-slate-500">
          {{ opt.description }}
        </span>
      </div>

      <div class="flex items-center">
        <div
          v-if="modelValue === opt.value"
          class="bg-pep-green text-offwhite flex h-5 w-5 scale-110 items-center justify-center rounded-full transition-all duration-200"
        >
          <PepIcon name="checkmark-circle" size="14" />
        </div>
      </div>
    </label>
  </div>
</template>
