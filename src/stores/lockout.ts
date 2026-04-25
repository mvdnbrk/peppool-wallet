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
const STORAGE_KEY = 'peppool_lockout';

function hasChromeStorage() {
  return typeof chrome !== 'undefined' && chrome.storage?.local;
}

async function loadState(): Promise<{ attempts: number; until: number }> {
  if (hasChromeStorage()) {
    const data = await chrome.storage.local.get(STORAGE_KEY);
    const lockout = data[STORAGE_KEY] as { attempts?: number; until?: number } | undefined;
    if (lockout) {
      return { attempts: Number(lockout.attempts) || 0, until: Number(lockout.until) || 0 };
    }
    return { attempts: 0, until: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const lockout = JSON.parse(raw);
      return { attempts: Number(lockout.attempts) || 0, until: Number(lockout.until) || 0 };
    }
  } catch {
    /* ignore */
  }
  return { attempts: 0, until: 0 };
}

async function saveState(attempts: number, until: number) {
  const lockout = { attempts, until };
  if (hasChromeStorage()) {
    await chrome.storage.local.set({ [STORAGE_KEY]: lockout });
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lockout));
  }
}

async function clearState() {
  if (hasChromeStorage()) {
    await chrome.storage.local.remove(STORAGE_KEY);
  } else {
    localStorage.removeItem(STORAGE_KEY);
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
   * Check if currently locked out. Returns true if still locked.
   */
  function checkLocked(): boolean {
    const currentNow = Date.now();
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
