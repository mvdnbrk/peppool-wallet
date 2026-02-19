<script setup lang="ts">
interface Props {
  showFooter?: boolean;
}

withDefaults(defineProps<Props>(), {
  showFooter: false
});
</script>

<template>
  <div class="relative flex min-h-full flex-col p-6">
    <!-- Header Area -->
    <header v-if="$slots.header" class="z-20">
      <slot name="header" />
    </header>

    <!-- Main Content (scrolls) -->
    <main
      class="flex flex-1 flex-col overflow-y-auto"
      :class="{ 'pt-4': !$slots.header }"
    >
      <slot />
    </main>

    <!-- Actions Area (stuck to bottom) -->
    <div v-if="$slots.actions" class="pt-6">
      <slot name="actions" />
    </div>

    <!-- Footer Area -->
    <footer v-if="$slots.footer || showFooter" class="pt-4">
      <slot name="footer">
        <PepFooter v-if="showFooter" />
      </slot>
    </footer>
  </div>
</template>
