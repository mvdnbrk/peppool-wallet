import { CHROME_STORAGE_KEYS } from '@/constants/storage';

/**
 * Per-origin permission entry.
 * `accounts` lists the addresses the user approved for this origin.
 * `permissions` lists granted capabilities (e.g. 'connect').
 *
 * Schema is multi-account ready — for now only one account is stored.
 */
export interface SitePermission {
  accounts: string[];
  permissions: string[];
}

export interface PermissionsMap {
  [origin: string]: SitePermission;
}

export async function loadPermissions(): Promise<PermissionsMap> {
  const data = await chrome.storage.local.get(CHROME_STORAGE_KEYS.PERMISSIONS);
  return (data[CHROME_STORAGE_KEYS.PERMISSIONS] || {}) as PermissionsMap;
}

export async function savePermissions(permissions: PermissionsMap): Promise<void> {
  await chrome.storage.local.set({ [CHROME_STORAGE_KEYS.PERMISSIONS]: permissions });
}

export function hasPermission(
  permissions: PermissionsMap,
  origin: string,
  permission: string
): boolean {
  return !!permissions[origin]?.permissions.includes(permission);
}

export function grantConnect(
  permissions: PermissionsMap,
  origin: string,
  accounts: string[]
): PermissionsMap {
  const existing = permissions[origin];
  if (existing) {
    // Merge accounts (deduplicate)
    const merged = [...new Set([...existing.accounts, ...accounts])];
    existing.accounts = merged;
    if (!existing.permissions.includes('connect')) {
      existing.permissions.push('connect');
    }
  } else {
    permissions[origin] = { accounts, permissions: ['connect'] };
  }
  return permissions;
}

export function revokeOrigin(permissions: PermissionsMap, origin: string): PermissionsMap {
  delete permissions[origin];
  return permissions;
}
