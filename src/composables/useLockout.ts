import { computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';

/**
 * Composable to handle the wallet lockout timer state and formatting.
 */
export function useLockout() {
  const wallet = useWalletStore();

  const isLockedOut = computed(() => wallet.isLockedOut);

  const secondsRemaining = computed(() => {
    if (!wallet.lockoutUntil) return 0;
    return Math.max(0, Math.ceil((wallet.lockoutUntil - Date.now()) / 1000));
  });

  const lockoutError = computed(() => {
    if (!isLockedOut.value) return '';
    return `Too many failed attempts. Locked for ${secondsRemaining.value}s.`;
  });

  return {
    isLockedOut,
    secondsRemaining,
    lockoutError
  };
}
