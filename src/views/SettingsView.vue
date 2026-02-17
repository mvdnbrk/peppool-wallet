<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';

const router = useRouter();
const walletStore = useWalletStore();

function handleLock() {
  walletStore.lock();
  router.push('/');
}
</script>

<template>
  <div class="relative flex h-full flex-col p-6">
    <PepHeader title="Settings" backTo="/dashboard" />

    <div class="mt-16 flex-1 space-y-2">
      <PepList>
        <PepListItem
          label="Preferences"
          icon="chevron-right"
          @click="router.push('/settings/preferences')"
        />
        <PepListItem
          label="Security"
          icon="chevron-right"
          @click="router.push('/settings/security')"
        />
        <PepListItem label="About" icon="chevron-right" @click="router.push('/settings/about')" />
      </PepList>

      <div class="pt-6">
        <PepButton @click="handleLock" variant="secondary" class="w-full"> Lock Wallet </PepButton>
      </div>
    </div>

    <PepFooter />
  </div>
</template>
