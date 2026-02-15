<script setup lang="ts">
interface Props {
  modelValue: boolean;
  id: string;
  label: string;
  description?: string;
}

defineProps<Props>();
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex gap-3">
    <div class="flex h-6 shrink-0 items-center">
      <div class="group grid size-4 grid-cols-1">
        <input
          :id="id"
          type="checkbox"
          :checked="modelValue"
          @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
          class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-pep-green checked:bg-pep-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pep-green disabled:border-gray-300 disabled:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:checked:border-pep-green-light dark:checked:bg-pep-green-light dark:focus-visible:outline-pep-green-light dark:disabled:border-white/5 dark:disabled:bg-white/10 forced-colors:appearance-auto cursor-pointer"
        />
        <div class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center flex items-center justify-center">
          <PepIcon 
            name="check" 
            size="14" 
            class="text-white transition-opacity" 
            :class="modelValue ? 'opacity-100' : 'opacity-0'" 
          />
        </div>
      </div>
    </div>
    <div class="text-sm/6">
      <label :for="id" class="font-medium text-white cursor-pointer">{{ label }}</label>
      <p v-if="description" class="text-xs text-slate-500">{{ description }}</p>
    </div>
  </div>
</template>
