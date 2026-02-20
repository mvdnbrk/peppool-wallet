import { vi } from 'vitest';
import { ref, computed } from 'vue';

export const useLockout = vi.fn(() => ({
  isLockedOut: ref(false),
  secondsRemaining: ref(0),
  lockoutError: computed(() => '')
}));
