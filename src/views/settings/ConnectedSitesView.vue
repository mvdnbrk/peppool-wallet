<script setup lang="ts">
import { useConnectedSites } from '@/composables/useConnectedSites';
import { onMounted } from 'vue';

const { connectedSites, isLoading, loadConnectedSites, revokeAccess } = useConnectedSites();

function domainFrom(origin: string): string {
  return origin.replace(/^https?:\/\//, '');
}

onMounted(async () => {
  await loadConnectedSites();
});
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Connected Sites" backTo="/settings" />
    </template>

    <div class="space-y-6">
      <div v-if="isLoading" class="flex justify-center py-12">
        <PepSpinner size="32" />
      </div>

      <div
        v-else-if="connectedSites.length === 0"
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <p class="text-sm text-slate-400">Sites you've connected to will appear here.</p>
      </div>

      <div v-else class="space-y-2">
        <PepCard
          v-for="site in connectedSites"
          :key="site"
          class="group flex items-center justify-between p-4"
        >
          <p class="min-w-0 truncate text-sm font-medium text-white">
            {{ domainFrom(site) }}
          </p>

          <button
            @click="revokeAccess(site)"
            class="flex-shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-400/10 hover:text-red-400"
            title="Revoke access"
          >
            <PepIcon name="clear" size="18" />
          </button>
        </PepCard>
      </div>
    </div>
  </PepMainLayout>
</template>
