<script setup lang="ts">
import { APP_VERSION } from '@/utils/constants';
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="About" />
    </template>

    <div class="mt-0 flex-1 space-y-4">
      <PepList id="about-links-list">
        <PepListItem
          label="Peppool.space"
          href="https://peppool.space"
          target="_blank"
          icon="external-link"
        />
        <PepListItem
          label="Terms of use"
          href="https://github.com/mvdnbrk/peppool-wallet/blob/main/TERMS_OF_USE.md"
          target="_blank"
          icon="external-link"
        />
        <PepListItem
          label="Privacy policy"
          href="https://github.com/mvdnbrk/peppool-wallet/blob/main/PRIVACY.md"
          target="_blank"
          icon="external-link"
        />
        <PepListItem
          label="Source code"
          href="https://github.com/mvdnbrk/peppool-wallet"
          target="_blank"
          icon="external-link"
        />
      </PepList>

      <PepCard class="space-y-3 p-4">
        <div class="flex justify-between text-sm">
          <span class="font-semibold text-slate-400">Version</span>
          <span class="text-offwhite font-bold">{{ APP_VERSION }}</span>
        </div>
        <div class="flex justify-between pt-1 text-sm">
          <span class="font-semibold text-slate-400">Network</span>
          <span class="text-pep-green-light font-bold">Pepecoin Mainnet</span>
        </div>
      </PepCard>
    </div>
  </PepMainLayout>
</template>
