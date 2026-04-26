import { APP_VERSION } from './constants';

const VERSION_KEY = 'peppool_app_version';

/**
 * Keys to preserve on version change. Settings and wallet state live in
 * chrome.storage.local — only the vault and version marker remain in localStorage.
 */
const KEEP_KEYS = ['peppool_vault', 'peppool_app_version'];

function shouldKeep(key: string): boolean {
  return KEEP_KEYS.includes(key);
}

/**
 * Compare stored app version against current. If different, wipe all
 * derived/cached localStorage keys (balance, transactions, prices, etc.)
 * while preserving user data and settings. Must run before Pinia stores
 * initialize, since they read from localStorage in their setup functions.
 */
export function wipeCacheOnVersionChange(): boolean {
  const storedVersion = localStorage.getItem(VERSION_KEY);

  if (storedVersion === APP_VERSION) return false;

  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith('peppool_') && !shouldKeep(key)) {
      localStorage.removeItem(key);
    }
  }

  localStorage.setItem(VERSION_KEY, APP_VERSION);
  return true;
}
