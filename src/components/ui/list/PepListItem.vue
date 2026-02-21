<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label: string;
  description?: string;
  icon?: 'chevron-right' | 'external-link';
  selected?: boolean;
  href?: string;
  target?: string;
  id?: string;
}

const props = defineProps<Props>();

const isAnchor = computed(() => !!props.href);
const componentType = computed(() => (isAnchor.value ? 'a' : 'button'));
</script>

<template>
  <component
    :is="componentType"
    :id="id"
    :href="href"
    :target="target"
    class="group flex w-full cursor-pointer items-center justify-between border-b border-slate-700/50 p-4 text-left transition-colors last:border-0 hover:bg-slate-800"
  >
    <div class="flex flex-col">
      <slot name="left">
        <span class="text-offwhite text-sm font-semibold">{{ label }}</span>
        <span v-if="description" class="mt-0.5 text-[10px] leading-tight text-slate-500">{{
          description
        }}</span>
      </slot>
    </div>

    <div class="flex items-center space-x-2">
      <slot name="right">
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
          class="bg-pep-green text-offwhite flex h-5 w-5 items-center justify-center rounded-full"
        >
          <PepIcon name="checkmark-circle" size="14" />
        </div>
      </slot>
    </div>
  </component>
</template>
