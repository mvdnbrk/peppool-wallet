<script setup lang="ts">
import { useApp } from '@/composables/useApp';

const { router, wallet: walletStore } = useApp();

function handleLock() {
  walletStore.lock();
  router.push('/');
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Settings" back-to="/dashboard" />
    </template>

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
          id="settings-connected-sites-item"
          label="Connected sites"
          icon="chevron-right"
          @click="router.push('/settings/connected-sites')"
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
        <PepButton variant="secondary" class="w-full" @click="handleLock"> Lock Wallet </PepButton>
      </div>
    </div>
  </PepMainLayout>
</template>
