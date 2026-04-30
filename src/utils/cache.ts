import { APP_VERSION } from './constants';
import { LOCAL_STORAGE_KEYS, STORAGE_PREFIX } from '@/constants/storage';

/**
 * Keys to preserve on version change. Settings and wallet state live in
 * chrome.storage.local — only the vault and version marker remain in localStorage.
 */
const KEEP_KEYS: string[] = [LOCAL_STORAGE_KEYS.VAULT, LOCAL_STORAGE_KEYS.APP_VERSION];

/**
 * Compare stored app version against current. If different, wipe all
 * derived/cached localStorage keys (balance, transactions, prices, etc.)
 * while preserving user data and settings. Must run before Pinia stores
 * initialize, since they read from localStorage in their setup functions.
 */
export function wipeCacheOnVersionChange(): boolean {
  const storedVersion = localStorage.getItem(LOCAL_STORAGE_KEYS.APP_VERSION);

  if (storedVersion === APP_VERSION) return false;

  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith(STORAGE_PREFIX) && !KEEP_KEYS.includes(key)) {
      localStorage.removeItem(key);
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEYS.APP_VERSION, APP_VERSION);
  return true;
}
