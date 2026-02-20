import { ref, computed, onUnmounted } from 'vue';
import { useWalletStore } from '@/stores/wallet';

/**
 * Composable to handle the wallet lockout timer state and formatting.
 */
export function useLockout() {
  const wallet = useWalletStore();
  const now = ref(Date.now());

  // Update the 'now' timestamp every second to drive the computed properties
  const ticker = setInterval(() => {
    now.value = Date.now();
  }, 1000);

  onUnmounted(() => {
    clearInterval(ticker);
  });

  const isLockedOut = computed(() => {
    if (wallet.lockoutUntil === 0) return false;
    return wallet.lockoutUntil > now.value;
  });

  const secondsRemaining = computed(() => {
    if (!isLockedOut.value) return 0;
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
