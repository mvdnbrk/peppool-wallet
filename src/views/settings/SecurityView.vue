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
      <PepList>
        <PepListItem
          label="Change password"
          icon="chevron-right"
          @click="router.push('/change-password')"
        />
        <PepListItem
          label="Show secret phrase"
          icon="chevron-right"
          @click="router.push('/show-mnemonic')"
        />
      </PepList>

      <div class="pt-6">
        <PepButton
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
