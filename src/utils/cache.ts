import { APP_VERSION } from './constants';

const VERSION_KEY = 'peppool_app_version';

/**
 * Keys that hold user data or settings — never wiped on version change.
 * Everything else with a `peppool_` prefix is treated as derived/cached data.
 */
const KEEP_PREFIXES = [
  'peppool_vault',
  'peppool_accounts',
  'peppool_active_account',
  'peppool_currency',
  'peppool_explorer',
  'peppool_lock_duration',
  'peppool_failed_attempts',
  'peppool_lockout_until',
  'peppool_app_version'
];

function shouldKeep(key: string): boolean {
  return KEEP_PREFIXES.some((prefix) => key === prefix);
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
