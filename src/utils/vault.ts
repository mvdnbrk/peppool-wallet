import { CHROME_STORAGE_KEYS, STORAGE_PREFIX } from '@/constants/storage';

const LEGACY_VAULT_KEY = `${STORAGE_PREFIX}vault`;

let vault: string | null = null;

/**
 * Load the encrypted vault from chrome.storage.local into memory.
 * Must be called before Pinia stores initialize.
 *
 * Migrates the vault from localStorage on first run for users upgrading
 * from versions that stored the vault synchronously.
 */
export async function loadVault(): Promise<void> {
  const data = await chrome.storage.local.get(CHROME_STORAGE_KEYS.VAULT);
  const stored = data[CHROME_STORAGE_KEYS.VAULT] as string | undefined;

  if (stored) {
    vault = stored;
    return;
  }

  const legacy = localStorage.getItem(LEGACY_VAULT_KEY);
  if (legacy) {
    vault = legacy;
    await chrome.storage.local.set({ [CHROME_STORAGE_KEYS.VAULT]: legacy });
    localStorage.removeItem(LEGACY_VAULT_KEY);
    return;
  }

  vault = null;
}

export function getVault(): string | null {
  return vault;
}

export async function saveVault(encrypted: string): Promise<void> {
  vault = encrypted;
  await chrome.storage.local.set({ [CHROME_STORAGE_KEYS.VAULT]: encrypted });
}

export async function clearVault(): Promise<void> {
  vault = null;
  await chrome.storage.local.remove(CHROME_STORAGE_KEYS.VAULT);
}

/**
 * Reset in-memory vault. Used in test teardown to prevent state leaking.
 */
export function resetVaultState(): void {
  vault = null;
}
