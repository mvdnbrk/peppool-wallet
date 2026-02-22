import { useRouter, useRoute } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';

/**
 * Core application hook to provide access to the router and wallet store
 * with common helpers.
 */
export function useApp() {
  const router = useRouter();
  const route = useRoute();
  const wallet = useWalletStore();

  return {
    router,
    route,
    wallet
  };
}
