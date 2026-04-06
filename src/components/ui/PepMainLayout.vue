<script setup lang="ts">
import { useGlobalHeader } from '@/composables/useGlobalHeader';

const { isVisible: showGlobalHeader } = useGlobalHeader();
</script>

<template>
  <div class="flex h-full flex-col">
    <header v-if="showGlobalHeader">
      <PepGlobalHeader />
    </header>

    <nav v-if="$slots.header" class="px-6 pt-6">
      <slot name="header" />
    </nav>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-6">
      <slot />
    </main>

    <footer v-if="$slots.actions" class="px-6 pt-6 pb-6">
      <slot name="actions" />
    </footer>
  </div>
</template>
