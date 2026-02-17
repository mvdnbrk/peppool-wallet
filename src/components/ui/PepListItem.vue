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
const componentType = computed(() => (isAnchor.value ? 'a' : 'button'));
</script>

<template>
  <component
    :is="componentType"
    :href="href"
    :target="target"
    class="group flex w-full cursor-pointer items-center justify-between border-b border-slate-700/50 p-4 text-left transition-colors last:border-0 hover:bg-slate-800"
  >
    <div class="flex flex-col">
      <span class="text-offwhite text-sm font-semibold">{{ label }}</span>
      <span v-if="description" class="mt-0.5 text-[10px] leading-tight text-slate-500">{{
        description
      }}</span>
    </div>

    <div class="flex items-center space-x-2">
      <slot name="right" />

      <PepIcon
        v-if="icon"
        :name="icon"
        :size="icon === 'external-link' ? 18 : 16"
        class="text-slate-600 transition-colors"
        :class="{
          'group-hover:text-slate-400': icon === 'chevron-right',
          'text-offwhite': icon === 'external-link'
        }"
      />

      <div
        v-if="selected"
        class="bg-pep-green text-offwhite flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
      >
        <PepIcon name="checkmark-circle" size="18" class="text-pep-green" v-if="false" />
        <!-- Keeping the specific checkmark style from AutoLockView/CurrencyView -->
        ✓
      </div>
    </div>
  </component>
</template>
