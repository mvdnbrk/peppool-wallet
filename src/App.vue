<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const showHeader = computed(() => {
  return !['/', '/create', '/import', '/reset-wallet', '/forgot-password'].includes(route.path);
});
</script>

<template>
  <div class="flex h-full flex-col bg-slate-900">
    <PepGlobalHeader v-if="showHeader" />

    <main class="flex-1 overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
