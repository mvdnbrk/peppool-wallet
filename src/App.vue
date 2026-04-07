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

    if (unlocked) {
      wallet.startPolling();
    } else {
      wallet.stopPolling();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="h-full bg-slate-900"
    @mousedown="wallet.resetLockTimer"
    @keydown="wallet.resetLockTimer"
  >
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
