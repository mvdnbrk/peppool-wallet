import { useRouter, useRoute } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { useAccountStore } from '@/stores/account';

/**
 * Core application hook to provide access to the router, wallet store,
 * and account store with common helpers.
 */
export function useApp() {
  const router = useRouter();
  const route = useRoute();
  const wallet = useWalletStore();
  const account = useAccountStore();

  return {
    router,
    route,
    wallet,
    account
  };
}
