import { ref } from 'vue';

export interface Permissions {
  [origin: string]: string[];
}

export function useConnectedSites() {
  const connectedSites = ref<string[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadConnectedSites() {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await chrome.storage.local.get('peppool_permissions');
      const permissions = (data.peppool_permissions || {}) as Permissions;
      connectedSites.value = Object.keys(permissions);
    } catch (err: any) {
      console.error('Failed to load connected sites', err);
      error.value = err.message || 'Failed to load connected sites';
    } finally {
      isLoading.value = false;
    }
  }

  async function revokeAccess(origin: string) {
    try {
      const data = await chrome.storage.local.get('peppool_permissions');
      const permissions = (data.peppool_permissions || {}) as Permissions;
      
      if (permissions[origin]) {
        delete permissions[origin];
        await chrome.storage.local.set({ peppool_permissions: permissions });
        connectedSites.value = connectedSites.value.filter(site => site !== origin);
      }
    } catch (err: any) {
      console.error('Failed to revoke access', err);
      error.value = err.message || 'Failed to revoke access';
    }
  }

  return {
    connectedSites,
    isLoading,
    error,
    loadConnectedSites,
    revokeAccess
  };
}
