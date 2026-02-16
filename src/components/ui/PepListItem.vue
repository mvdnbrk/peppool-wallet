<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label: string;
  description?: string;
  icon?: 'chevron-right' | 'external-link';
  selected?: boolean;
  href?: string;
  target?: string;
}

const props = defineProps<Props>();

const isAnchor = computed(() => !!props.href);
const componentType = computed(() => isAnchor.value ? 'a' : 'button');
</script>

<template>
  <component
    :is="componentType"
    :href="href"
    :target="target"
    class="w-full flex items-center justify-between p-4 hover:bg-slate-800 transition-colors border-b border-slate-700/50 last:border-0 text-left cursor-pointer group"
  >
    <div class="flex flex-col">
      <span class="text-sm font-semibold text-offwhite">{{ label }}</span>
      <span v-if="description" class="text-[10px] text-slate-500 leading-tight mt-0.5">{{ description }}</span>
    </div>

    <div class="flex items-center space-x-2">
      <slot name="right" />
      
      <PepIcon 
        v-if="icon" 
        :name="icon" 
        :size="icon === 'external-link' ? 18 : 16"
        class="text-slate-600 transition-colors"
        :class="{ 'group-hover:text-slate-400': icon === 'chevron-right', 'text-offwhite': icon === 'external-link' }"
      />

      <div 
        v-if="selected"
        class="w-5 h-5 rounded-full bg-pep-green flex items-center justify-center text-offwhite text-[10px]"
      >
        <PepIcon name="checkmark-circle" size="18" class="text-pep-green" v-if="false" />
        <!-- Keeping the specific checkmark style from AutoLockView/CurrencyView -->
        ✓
      </div>
    </div>
  </component>
</template>
