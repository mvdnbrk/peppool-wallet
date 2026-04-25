import { useRouter, useRoute } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { useSettingsStore } from '@/stores/settings';

/**
 * Core application hook to provide access to the router, wallet store,
 * and settings store with common helpers.
 */
export function useApp() {
  const router = useRouter();
  const route = useRoute();
  const wallet = useWalletStore();
  const settings = useSettingsStore();

  return {
    router,
    route,
    wallet,
    settings
  };
}
