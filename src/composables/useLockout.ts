import { computed, ref, watchEffect } from 'vue';
import { useWalletStore } from '@/stores/wallet';

/**
 * Composable to handle the wallet lockout timer state and formatting.
 */
export function useLockout() {
  const wallet = useWalletStore();
  const now = ref(Date.now());

  watchEffect((onCleanup) => {
    if (wallet.isLockedOut) {
      now.value = Date.now();
      const timer = setInterval(() => { now.value = Date.now(); }, 1000);
      onCleanup(() => clearInterval(timer));
    }
  });

  const isLockedOut = computed(() => wallet.isLockedOut);

  const secondsRemaining = computed(() => {
    if (!wallet.lockoutUntil) return 0;
    return Math.max(0, Math.ceil((wallet.lockoutUntil - now.value) / 1000));
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
