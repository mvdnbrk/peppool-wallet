<script setup lang="ts">
import { computed } from 'vue';
import { inscriptionContentUrl, classifyContentType } from '@/utils/inscriptions';

interface Props {
  id: string;
  contentType?: string | null;
  /**
   * When true, renders rich content (HTML scripts, video controls, audio playback).
   * Grid tiles use the default (false) for safety and performance.
   */
  interactive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  contentType: '',
  interactive: false
});

const url = computed(() => inscriptionContentUrl(props.id));
const kind = computed(() => classifyContentType(props.contentType));

const sandboxValue = computed(() => (props.interactive ? 'allow-scripts allow-pointer-lock' : ''));
</script>

<template>
  <div class="bg-slate-900/40">
    <img
      v-if="kind === 'image'"
      :src="url"
      :alt="`Inscription ${id}`"
      loading="lazy"
      class="h-full w-full object-contain"
    />

    <video
      v-else-if="kind === 'video'"
      :src="url"
      :controls="interactive"
      :autoplay="false"
      muted
      playsinline
      preload="metadata"
      class="h-full w-full object-contain"
    />

    <audio
      v-else-if="kind === 'audio' && interactive"
      :src="url"
      controls
      preload="metadata"
      class="w-full"
    />

    <iframe
      v-else-if="kind === 'html'"
      :src="url"
      :sandbox="sandboxValue"
      loading="lazy"
      referrerpolicy="no-referrer"
      class="h-full w-full border-0 bg-white"
      :title="`Inscription ${id}`"
    />

    <div
      v-else
      class="flex h-full w-full flex-col items-center justify-center gap-1 p-3 text-center"
    >
      <span class="text-pep-green-light text-[10px] font-bold tracking-widest uppercase">
        {{ kind }}
      </span>
      <span class="truncate text-[10px] font-semibold text-slate-500">
        {{ contentType || 'unknown' }}
      </span>
    </div>
  </div>
</template>
