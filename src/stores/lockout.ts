import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// ── Escalating lockout tiers ───────────────────────────────────────────────
// Each tier defines when it activates and how long the lockout lasts.
// After 12 failures the wallet is wiped, forcing re-import from seed phrase.
interface FailureTier {
  threshold: number;
  durationMs: number;
  wipe?: boolean;
}

export const FAILURE_TIERS: FailureTier[] = [
  { threshold: 3, durationMs: 30 * 1000 }, //  3 failures →  30 seconds
  { threshold: 6, durationMs: 5 * 60 * 1000 }, //  6 failures →   5 minutes
  { threshold: 9, durationMs: 30 * 60 * 1000 }, //  9 failures →  30 minutes
  { threshold: 12, durationMs: 0, wipe: true } // 12 failures →  wallet wipe
];

function getFailureTier(attempts: number): FailureTier | null {
  for (let i = FAILURE_TIERS.length - 1; i >= 0; i--) {
    if (attempts >= FAILURE_TIERS[i]!.threshold) return FAILURE_TIERS[i]!;
  }
  return null;
}

// ── Storage helpers (chrome.storage.local with localStorage fallback) ─────
const LOCKOUT_KEYS = {
  attempts: 'peppool_failed_attempts',
  until: 'peppool_lockout_until'
} as const;

function hasChromeStorage() {
  return typeof chrome !== 'undefined' && chrome.storage?.local;
}

async function loadState(): Promise<{ attempts: number; until: number }> {
  if (hasChromeStorage()) {
    const data = await chrome.storage.local.get([LOCKOUT_KEYS.attempts, LOCKOUT_KEYS.until]);
    return {
      attempts: Number(data[LOCKOUT_KEYS.attempts]) || 0,
      until: Number(data[LOCKOUT_KEYS.until]) || 0
    };
  }
  return {
    attempts: Number(localStorage.getItem(LOCKOUT_KEYS.attempts)) || 0,
    until: Number(localStorage.getItem(LOCKOUT_KEYS.until)) || 0
  };
}

async function saveState(attempts: number, until: number) {
  if (hasChromeStorage()) {
    await chrome.storage.local.set({
      [LOCKOUT_KEYS.attempts]: attempts,
      [LOCKOUT_KEYS.until]: until
    });
  } else {
    localStorage.setItem(LOCKOUT_KEYS.attempts, attempts.toString());
    localStorage.setItem(LOCKOUT_KEYS.until, until.toString());
  }
}

async function clearState() {
  if (hasChromeStorage()) {
    await chrome.storage.local.remove([LOCKOUT_KEYS.attempts, LOCKOUT_KEYS.until]);
  } else {
    localStorage.removeItem(LOCKOUT_KEYS.attempts);
    localStorage.removeItem(LOCKOUT_KEYS.until);
  }
}

export const useLockoutStore = defineStore('lockout', () => {
  const failedAttempts = ref(0);
  const lockoutUntil = ref(0);
  const now = ref(Date.now());

  // Tick every second to drive reactive lockout check
  setInterval(() => {
    now.value = Date.now();
  }, 1000);

  const isLockedOut = computed(() => lockoutUntil.value > now.value);

  const attemptsRemaining = computed(() => {
    const nextTier = FAILURE_TIERS.find((t) => failedAttempts.value < t.threshold);
    return nextTier ? nextTier.threshold - failedAttempts.value : 0;
  });

  async function restore() {
    const state = await loadState();
    failedAttempts.value = state.attempts;
    lockoutUntil.value = state.until;
  }

  async function reset() {
    failedAttempts.value = 0;
    lockoutUntil.value = 0;
    await clearState();
  }

  /**
   * Record a failed unlock attempt. Returns { wipe: true } if the wallet
   * should be wiped, or { wipe: false } otherwise.
   */
  async function recordFailure(): Promise<{ wipe: boolean }> {
    const currentNow = Date.now();

    // Auto-reset if lockout has expired
    if (lockoutUntil.value > 0 && currentNow >= lockoutUntil.value) {
      failedAttempts.value = 0;
      lockoutUntil.value = 0;
    }

    failedAttempts.value++;
    await saveState(failedAttempts.value, lockoutUntil.value);

    const tier = getFailureTier(failedAttempts.value);
    if (tier) {
      if (tier.wipe) {
        await reset();
        return { wipe: true };
      }
      const until = currentNow + tier.durationMs;
      lockoutUntil.value = until;
      await saveState(failedAttempts.value, until);
    }

    return { wipe: false };
  }

  /**
   * Check if currently locked out. If the lockout has expired, auto-resets
   * and returns false. Returns true if still locked.
   */
  function checkLocked(): boolean {
    const currentNow = Date.now();
    if (lockoutUntil.value > 0 && currentNow >= lockoutUntil.value) {
      failedAttempts.value = 0;
      lockoutUntil.value = 0;
      clearState();
      return false;
    }
    return currentNow < lockoutUntil.value;
  }

  return {
    failedAttempts,
    lockoutUntil,
    isLockedOut,
    attemptsRemaining,
    restore,
    reset,
    recordFailure,
    checkLocked
  };
});
