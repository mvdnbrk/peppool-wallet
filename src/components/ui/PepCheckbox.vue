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
      <div class="group grid size-5 grid-cols-1">
        <input
          :id="id"
          type="checkbox"
          :checked="modelValue"
          @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
          class="col-start-1 row-start-1 appearance-none rounded-md border border-white/40 bg-white/5 checked:border-pep-green checked:bg-pep-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pep-green hover:border-pep-green-light transition-all cursor-pointer"
        />
        <div class="pointer-events-none col-start-1 row-start-1 size-4 self-center justify-self-center flex items-center justify-center">
          <PepIcon 
            name="check" 
            size="16" 
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
