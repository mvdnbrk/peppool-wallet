import { ref } from 'vue';
import { loadPermissions, savePermissions, revokeOrigin } from '@/utils/permissions';

export function useConnectedSites() {
  const connectedSites = ref<string[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadConnectedSites() {
    isLoading.value = true;
    error.value = null;
    try {
      const permissions = await loadPermissions();
      connectedSites.value = Object.keys(permissions);
    } catch (err) {
      console.error('Failed to load connected sites', err);
      error.value = err instanceof Error ? err.message : 'Failed to load connected sites';
    } finally {
      isLoading.value = false;
    }
  }

  async function revokeAccess(origin: string) {
    try {
      const permissions = await loadPermissions();

      if (permissions[origin]) {
        await savePermissions(revokeOrigin(permissions, origin));
        connectedSites.value = connectedSites.value.filter((site) => site !== origin);
      }
    } catch (err) {
      console.error('Failed to revoke access', err);
      error.value = err instanceof Error ? err.message : 'Failed to revoke access';
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
