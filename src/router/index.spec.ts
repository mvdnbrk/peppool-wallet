import { describe, it, expect, vi, beforeEach } from 'vitest';
import { router, resetSessionCheck } from './index';
import { useWalletStore } from '@/stores/wallet';
import { setActivePinia, createPinia } from 'pinia';

// Mock Wallet Store
vi.mock('@/stores/wallet', () => ({
  useWalletStore: vi.fn()
}));

describe('Router Logic', () => {
  let walletStore: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    // Reset sessionChecked internal state
    resetSessionCheck();

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

  it('should auto-unlock if checkSession returns true', async () => {
    walletStore.isUnlocked = false;
    walletStore.checkSession.mockImplementation(async () => {
      walletStore.isUnlocked = true;
      return true;
    });

    await router.push('/dashboard');
    expect(walletStore.checkSession).toHaveBeenCalled();
    expect(router.currentRoute.value.path).toBe('/dashboard');
  });

  it('should auto-restore last route if persistent and unlocked', async () => {
    localStorage.setItem('peppool_last_route', '/send');
    walletStore.isUnlocked = true;
    resetSessionCheck();

    // Trigger navigation to root which should trigger restore
    await router.push('/');
    expect(router.currentRoute.value.path).toBe('/send');
  });

  it('should NOT auto-restore if route is NOT persistent', async () => {
    localStorage.setItem('peppool_last_route', '/settings'); // settings has no persist:true
    walletStore.isUnlocked = true;
    resetSessionCheck();

    await router.push('/');
    expect(router.currentRoute.value.path).toBe('/dashboard');
    expect(localStorage.getItem('peppool_last_route')).toBeNull();
  });

  it('should auto-restore public persistent routes even if locked', async () => {
    localStorage.setItem('peppool_last_route', '/import'); // /import has persist:true
    walletStore.isUnlocked = false;
    resetSessionCheck();

    await router.push('/');
    expect(router.currentRoute.value.path).toBe('/import');
  });

  it('should redirect unknown paths to root', async () => {
    walletStore.isUnlocked = false;
    await router.push('/nonexistent-page');
    expect(router.currentRoute.value.path).toBe('/');
  });
});
