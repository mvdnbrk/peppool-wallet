<script setup lang="ts">
import { watch } from 'vue';
import { useApp } from '@/composables/useApp';
import PepGlobalHeader from '@/components/ui/PepGlobalHeader.vue';

const { wallet, router, route } = useApp();

// Global Security Watcher: Kick to home if wallet locks while on protected route
watch(
  () => wallet.isUnlocked,
  (isUnlocked) => {
    const publicRoutes = ['/', '/create', '/import', '/forgot-password'];
    if (!isUnlocked && !publicRoutes.includes(route.path)) {
      router.replace('/');
    }
  }
);
</script>

<template>
  <div class="flex h-full flex-col bg-slate-900">
    <PepGlobalHeader />

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
