/**
 * All persistent storage keys used by the wallet.
 *
 * Centralizing keys here prevents cross-file drift (e.g. a wipe path that
 * misses a renamed key) and makes the storage surface easy to audit.
 *
 * Session storage keys (chrome.storage.session) are intentionally excluded —
 * they are short-lived, scoped to a single composable's call sites, and
 * don't share the cross-file consumer pattern.
 */

export const STORAGE_PREFIX = 'peppool_';

// Persisted in browser localStorage (synchronous, survives extension reload).
export const LOCAL_STORAGE_KEYS = {
  APP_VERSION: 'peppool_app_version',
  AUTH_ADDRESS: 'peppool_auth_address',
  AUTH_EXPIRES: 'peppool_auth_expires',
  AUTH_TOKEN: 'peppool_auth_token',
  BALANCE: 'peppool_balance',
  INSCRIPTIONS: 'peppool_inscriptions',
  PRICES: 'peppool_prices',
  TRANSACTIONS: 'peppool_transactions'
} as const;

// Persisted in chrome.storage.local (async, accessible from background worker,
// not subject to browser storage eviction).
export const CHROME_STORAGE_KEYS = {
  ACCOUNTS: 'peppool_accounts',
  ACTIVE_ACCOUNT: 'peppool_active_account',
  LOCKOUT: 'peppool_lockout',
  PERMISSIONS: 'peppool_permissions',
  SETTINGS: 'peppool_settings',
  VAULT: 'peppool_vault'
} as const;
