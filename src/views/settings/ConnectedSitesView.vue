<script setup lang="ts">
import { onMounted } from 'vue';
import { useConnectedSites } from '@/composables/useConnectedSites';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepCard from '@/components/ui/PepCard.vue';
import PepIcon from '@/components/ui/PepIcon.vue';
import PepSpinner from '@/components/ui/PepSpinner.vue';

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
      <PepPageHeader title="Connected Sites" backTo="/settings/security" />
    </template>

    <div class="space-y-6">
      <div v-if="isLoading" class="flex justify-center py-12">
        <PepSpinner size="32" />
      </div>

      <div
        v-else-if="connectedSites.length === 0"
        class="flex flex-col items-center justify-center space-y-4 py-12 text-center"
      >
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-500"
        >
          <PepIcon name="external-link" size="32" />
        </div>
        <div class="space-y-1">
          <h3 class="font-medium text-white">No connected sites</h3>
          <p class="max-w-[240px] text-sm text-slate-400">
            Websites you've connected to will appear here.
          </p>
        </div>
      </div>

      <div v-else class="space-y-3">
        <p class="px-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Authorized Websites
        </p>

        <div class="space-y-2">
          <PepCard
            v-for="site in connectedSites"
            :key="site"
            class="group flex items-center justify-between p-4"
          >
            <div class="flex min-w-0 items-center space-x-3">
              <div
                class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800"
              >
                <span class="text-pepe-green text-xs font-bold">{{
                  domainFrom(site).charAt(0).toUpperCase()
                }}</span>
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-white">
                  {{ domainFrom(site) }}
                </p>
                <p class="truncate text-[10px] text-slate-500">{{ site }}</p>
              </div>
            </div>

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
    </div>
  </PepMainLayout>
</template>
