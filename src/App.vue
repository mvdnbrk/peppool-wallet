<script setup lang="ts">
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';

const router = useRouter();
const route = useRoute();
const wallet = useWalletStore();

const publicRoutes = ['/', '/create', '/import', '/forgot-password'];

watch(
  () => wallet.isUnlocked,
  (unlocked) => {
    if (!unlocked && !publicRoutes.includes(route.path)) {
      router.replace('/');
    }
  }
);
</script>

<template>
  <div
    class="flex h-full flex-col bg-slate-900"
    @mousedown="wallet.resetLockTimer"
    @keydown="wallet.resetLockTimer"
  >
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
