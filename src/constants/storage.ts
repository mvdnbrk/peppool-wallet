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
  VAULT: 'peppool_vault',
  TRANSACTIONS: 'peppool_transactions',
  BALANCE: 'peppool_balance',
  PRICES: 'peppool_prices',
  INSCRIPTIONS: 'peppool_inscriptions',
  APP_VERSION: 'peppool_app_version',
  AUTH_TOKEN: 'peppool_auth_token',
  AUTH_EXPIRES: 'peppool_auth_expires',
  AUTH_ADDRESS: 'peppool_auth_address'
} as const;

// Persisted in chrome.storage.local (async, accessible from background worker).
export const CHROME_STORAGE_KEYS = {
  LOCKOUT: 'peppool_lockout',
  PERMISSIONS: 'peppool_permissions',
  SETTINGS: 'peppool_settings',
  ACCOUNTS: 'peppool_accounts',
  ACTIVE_ACCOUNT: 'peppool_active_account'
} as const;
