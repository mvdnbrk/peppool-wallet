import { describe, it, expect, vi, beforeEach } from 'vitest';
import { router } from './index';
import { useWalletStore } from '../stores/wallet';
import { setActivePinia, createPinia } from 'pinia';

// Mock Wallet Store
vi.mock('../stores/wallet', () => ({
  useWalletStore: vi.fn()
}));

describe('Router Logic', () => {
  let walletStore: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    // Default locked state
    walletStore = {
      isUnlocked: false,
      checkSession: vi.fn().mockResolvedValue(false)
    };
    vi.mocked(useWalletStore).mockReturnValue(walletStore);
    localStorage.clear();
  });

  it('should redirect from dashboard to root if wallet is locked', async () => {
    walletStore.isUnlocked = false;
    await router.push('/dashboard');
    expect(router.currentRoute.value.path).toBe('/');
  });

  it('should allow access to public routes even when locked', async () => {
    walletStore.isUnlocked = false;

    const publicRoutes = ['/', '/create', '/import', '/forgot-password'];
    for (const path of publicRoutes) {
      await router.push(path);
      expect(router.currentRoute.value.path).toBe(path);
    }
  });

  it('should redirect from root to dashboard if wallet is already unlocked', async () => {
    walletStore.isUnlocked = true;
    await router.push('/');
    expect(router.currentRoute.value.path).toBe('/dashboard');
  });

  it('should protect sensitive routes (send, receive, settings) when locked', async () => {
    walletStore.isUnlocked = false;

    const sensitiveRoutes = ['/send', '/receive', '/settings', '/settings/preferences'];
    for (const path of sensitiveRoutes) {
      await router.push(path);
      expect(router.currentRoute.value.path).toBe('/');
    }
  });
});
