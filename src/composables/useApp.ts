import { useRouter, useRoute } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { onMounted } from 'vue';

/**
 * Core application hook to provide access to the router and wallet store
 * with common helpers.
 */
export function useApp() {
  const router = useRouter();
  const route = useRoute();
  const wallet = useWalletStore();

  /**
   * Helper to ensure the wallet is unlocked before accessing a view.
   * Redirects to home if locked.
   */
  function requireUnlock() {
    onMounted(() => {
      if (!wallet.isUnlocked) {
        router.replace('/');
      }
    });
  }

  return {
    router,
    route,
    wallet,
    requireUnlock
  };
}
