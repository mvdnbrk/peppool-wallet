<script setup lang="ts">
import { computed } from 'vue';
import { truncateId } from '@/utils/constants';

const props = defineProps<{
  id: string;
  label?: string;
}>();

const truncated = computed(() => truncateId(props.id));
</script>

<template>
  <PepInputGroup
    v-if="label"
    :label="label"
    :id="id"
    labelClass="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1 text-left"
  >
    <div class="flex items-center gap-2">
      <div
        class="flex h-[38px] flex-1 items-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-left"
      >
        <span class="inline-flex max-w-full min-w-0 font-mono text-[11px] text-slate-400">
          <span class="flex min-w-0">
            <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{{ truncated.start }}</span>
          </span>
          <span class="whitespace-nowrap">{{ truncated.end }}</span>
        </span>
      </div>

      <el-copyable :id="id" class="group inline-flex">
        <span class="hidden">{{ id }}</span>
        <button
          :id="`${id}-copy`"
          type="button"
          command="--copy"
          :commandfor="id"
          aria-label="Copy ID"
          class="text-offwhite copied:text-pep-green-light copied:hover:text-pep-green-light inline-flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-700 bg-slate-800 transition-colors hover:text-white"
        >
          <PepIcon name="copy" class="copied:hidden h-5 w-5" />
          <PepIcon name="check" class="copied:block hidden h-5 w-5" />
        </button>
      </el-copyable>
    </div>
  </PepInputGroup>

  <div v-else class="flex items-center gap-2">
    <div
      class="flex h-[38px] flex-1 items-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-left"
    >
      <span class="inline-flex max-w-full min-w-0 font-mono text-[11px] text-slate-400">
        <span class="flex min-w-0">
          <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{{ start }}</span>
        </span>
        <span class="whitespace-nowrap">{{ end }}</span>
      </span>
    </div>

    <el-copyable :id="id" class="group inline-flex">
      <span class="hidden">{{ id }}</span>
      <button
        :id="`${id}-copy`"
        type="button"
        command="--copy"
        :commandfor="id"
        aria-label="Copy ID"
        class="text-offwhite copied:text-pep-green-light copied:hover:text-pep-green-light inline-flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-700 bg-slate-800 transition-colors hover:text-white"
      >
        <PepIcon name="copy" class="copied:hidden h-5 w-5" />
        <PepIcon name="check" class="copied:block hidden h-5 w-5" />
      </button>
    </el-copyable>
  </div>
</template>
