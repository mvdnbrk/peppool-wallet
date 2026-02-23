<script setup lang="ts">
import { useApp } from '@/composables/useApp';

const { router } = useApp();
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Security" />
    </template>
    <div class="mt-0 flex-1 space-y-2">
      <PepList id="security-menu-list">
        <PepListItem
          id="security-change-password-item"
          label="Change password"
          icon="chevron-right"
          @click="router.push('/change-password')"
        />
        <PepListItem
          id="security-show-mnemonic-item"
          label="Show secret phrase"
          icon="chevron-right"
          @click="router.push('/show-mnemonic')"
        />
        <PepListItem
          id="security-connected-sites-item"
          label="Connected sites"
          icon="chevron-right"
          @click="router.push('/settings/connected-sites')"
        />
      </PepList>

      <div class="pt-6">
        <PepButton
          id="security-reset-wallet-button"
          @click="router.push('/reset-wallet')"
          variant="secondary"
          class="w-full !text-red-400"
        >
          Reset wallet
        </PepButton>
      </div>
    </div>
  </PepMainLayout>
</template>
