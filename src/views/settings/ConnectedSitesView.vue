<script setup lang="ts">
import { onMounted } from 'vue';
import { useConnectedSites } from '@/composables/useConnectedSites';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepCard from '@/components/ui/PepCard.vue';
import PepIcon from '@/components/ui/PepIcon.vue';
import PepSpinner from '@/components/ui/PepSpinner.vue';

const { connectedSites, isLoading, loadConnectedSites, revokeAccess } = useConnectedSites();

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

      <div v-else-if="connectedSites.length === 0" class="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
          <PepIcon name="external-link" size="32" />
        </div>
        <div class="space-y-1">
          <h3 class="text-white font-medium">No connected sites</h3>
          <p class="text-sm text-slate-400 max-w-[240px]">Websites you've connected to will appear here.</p>
        </div>
      </div>

      <div v-else class="space-y-3">
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          Authorized Websites
        </p>
        
        <div class="space-y-2">
          <PepCard v-for="site in connectedSites" :key="site" class="p-4 flex items-center justify-between group">
            <div class="flex items-center space-x-3 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 flex-shrink-0">
                <span class="text-pepe-green font-bold text-xs">{{ site.replace(/^https?:\/\//, '').charAt(0).toUpperCase() }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ site.replace(/^https?:\/\//, '') }}</p>
                <p class="text-[10px] text-slate-500 truncate">{{ site }}</p>
              </div>
            </div>
            
            <button 
              @click="revokeAccess(site)"
              class="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"
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
