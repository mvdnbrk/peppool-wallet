import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useConnectedSites } from './useConnectedSites';
import { flushPromises } from '@vue/test-utils';

describe('useConnectedSites Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    (global.chrome.storage.local.get as any).mockResolvedValue({});
    (global.chrome.storage.local.set as any).mockResolvedValue(undefined);
  });

  it('should load connected sites from storage', async () => {
    (global.chrome.storage.local.get as any).mockResolvedValue({
      peppool_permissions: {
        'https://site1.com': ['connect'],
        'https://site2.io': ['connect']
      }
    });

    const { connectedSites, loadConnectedSites, isLoading } = useConnectedSites();
    
    expect(isLoading.value).toBe(false);
    const promise = loadConnectedSites();
    expect(isLoading.value).toBe(true);
    
    await promise;
    
    expect(isLoading.value).toBe(false);
    expect(connectedSites.value).toEqual(['https://site1.com', 'https://site2.io']);
  });

  it('should revoke access and update local state', async () => {
    (global.chrome.storage.local.get as any).mockResolvedValue({
      peppool_permissions: {
        'https://site1.com': ['connect'],
        'https://site2.io': ['connect']
      }
    });

    const { connectedSites, loadConnectedSites, revokeAccess } = useConnectedSites();
    await loadConnectedSites();
    
    expect(connectedSites.value).toHaveLength(2);

    await revokeAccess('https://site1.com');

    // Verify storage call
    expect(global.chrome.storage.local.set).toHaveBeenCalledWith({
      peppool_permissions: {
        'https://site2.io': ['connect']
      }
    });

    // Verify state update
    expect(connectedSites.value).toEqual(['https://site2.io']);
  });

  it('should handle errors gracefully during load', async () => {
    (global.chrome.storage.local.get as any).mockRejectedValue(new Error('Storage error'));

    const { connectedSites, loadConnectedSites, error } = useConnectedSites();
    await loadConnectedSites();

    expect(connectedSites.value).toEqual([]);
    expect(error.value).toBe('Storage error');
  });
});
