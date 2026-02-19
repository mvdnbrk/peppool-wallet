<script setup lang="ts">
import { useApp } from '@/composables/useApp';

const { router } = useApp();
</script>

<template>
  <div class="relative flex h-full flex-col p-6">
    <PepPageHeader title="Security" />

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
  </div>
</template>
