import { ref, type Ref } from 'vue';
import { decryptWithKey, importKey } from '@/utils/encryption';

interface UseSessionOptions {
  encryptedMnemonic: Ref<string | null>;
  getLockDuration: () => number;
}

async function setAutoLockAlarm(delayMinutes: number) {
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    try {
      await chrome.runtime.sendMessage({ type: 'set-auto-lock', delayMinutes });
    } catch {
      /* background worker unavailable */
    }
  }
}

async function clearAutoLockAlarm() {
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    try {
      await chrome.runtime.sendMessage({ type: 'clear-auto-lock' });
    } catch {
      /* background worker unavailable */
    }
  }
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

export function useSession(opts: UseSessionOptions) {
  let sessionKey: CryptoKey | null = null;
  const hasSessionKey = ref(false);
  const isUnlocked = ref(false);

  let lockTimer: ReturnType<typeof setTimeout> | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function cacheKeyBytes(keyBytes: Uint8Array) {
    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      await chrome.storage.session.set({ dataKey: toHex(keyBytes) });
    }
    sessionKey = await importKey(keyBytes.buffer as ArrayBuffer, ['decrypt']);
    hasSessionKey.value = true;
    keyBytes.fill(0);
  }

  async function resetLockTimer() {
    if (!isUnlocked.value) return;

    const durationMs = opts.getLockDuration() * 60 * 1000;

    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      await chrome.storage.session.set({ sessionStartTime: Date.now() });
    }

    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = setTimeout(() => lock(), durationMs);
    await setAutoLockAlarm(opts.getLockDuration());
  }

  async function debouncedResetLockTimer() {
    if (!isUnlocked.value || debounceTimer) return;
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
    }, 1000);
    await resetLockTimer();
  }

  async function checkSession(): Promise<boolean> {
    if (typeof chrome === 'undefined' || !chrome.storage?.session) return false;

    const sessionData = await chrome.storage.session.get(['sessionStartTime', 'dataKey']);
    const sessionStart = sessionData.sessionStartTime as number | undefined;
    const hex = sessionData.dataKey as string | undefined;

    if (!sessionStart || !hex) return false;

    const elapsed = Date.now() - sessionStart;
    if (elapsed >= opts.getLockDuration() * 60 * 1000) {
      await chrome.storage.session.clear();
      return false;
    }

    try {
      const rawBytes = fromHex(hex);
      sessionKey = await importKey(rawBytes.buffer as ArrayBuffer, ['decrypt']);
      rawBytes.fill(0);
      hasSessionKey.value = true;
      isUnlocked.value = true;
    } catch {
      isUnlocked.value = false;
      return false;
    }

    await resetLockTimer();
    return true;
  }

  async function withMnemonic<T>(fn: (mnemonic: string) => T | Promise<T>): Promise<T> {
    if (!sessionKey || !opts.encryptedMnemonic.value) {
      throw new Error('Wallet is locked');
    }
    const mnemonic = await decryptWithKey(opts.encryptedMnemonic.value, sessionKey);
    return fn(mnemonic);
  }

  async function lock() {
    isUnlocked.value = false;
    sessionKey = null;
    hasSessionKey.value = false;
    if (typeof chrome !== 'undefined' && chrome.storage?.session) {
      await chrome.storage.session.clear();
    }
    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = null;
    await clearAutoLockAlarm();
  }

  function markUnlocked() {
    isUnlocked.value = true;
  }

  return {
    hasSessionKey,
    isUnlocked,
    cacheKeyBytes,
    resetLockTimer,
    debouncedResetLockTimer,
    checkSession,
    withMnemonic,
    lock,
    markUnlocked
  };
}
