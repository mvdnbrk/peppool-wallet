<script setup lang="ts">
import { useApp } from '@/composables/useApp';

const { router, wallet: walletStore } = useApp();

function handleLock() {
  walletStore.lock();
  router.push('/');
}
</script>

<template>
  <div class="relative flex h-full flex-col p-6">
    <PepPageHeader title="Settings" backTo="/dashboard" />

    <div class="mt-0 flex-1 space-y-2">
      <PepList id="settings-menu-list">
        <PepListItem
          id="settings-accounts-item"
          label="Accounts"
          icon="chevron-right"
          @click="router.push('/settings/accounts')"
        />
        <PepListItem
          id="settings-preferences-item"
          label="Preferences"
          icon="chevron-right"
          @click="router.push('/settings/preferences')"
        />
        <PepListItem
          id="settings-security-item"
          label="Security"
          icon="chevron-right"
          @click="router.push('/settings/security')"
        />
        <PepListItem
          id="settings-about-item"
          label="About"
          icon="chevron-right"
          @click="router.push('/settings/about')"
        />
      </PepList>

      <div class="pt-6">
        <PepButton @click="handleLock" variant="secondary" class="w-full"> Lock Wallet </PepButton>
      </div>
    </div>
  </div>
</template>
