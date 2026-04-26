import { useRouter, useRoute } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { useAccountStore } from '@/stores/account';
import { useSettingsStore } from '@/stores/settings';

/**
 * Core application hook to provide access to the router, wallet store,
 * account store, and settings store with common helpers.
 */
export function useApp() {
  const router = useRouter();
  const route = useRoute();
  const wallet = useWalletStore();
  const account = useAccountStore();
  const settings = useSettingsStore();

  return {
    router,
    route,
    wallet,
    account,
    settings
  };
}
