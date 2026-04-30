import { reactive } from 'vue';
import type { ExplorerId } from './explorer';
import type { Account } from '@/stores/wallet';
import { CHROME_STORAGE_KEYS } from '@/constants/storage';

export interface Settings {
  currency: 'USD' | 'EUR';
  explorer: ExplorerId;
  lockDuration: number;
}

export interface WalletState {
  accounts: Account[];
  activeAccountIndex: number;
}

const SETTINGS_DEFAULTS: Settings = { currency: 'USD', explorer: 'peppool', lockDuration: 15 };
const WALLET_STATE_DEFAULTS: WalletState = { accounts: [], activeAccountIndex: 0 };

const settings: Settings = reactive({ ...SETTINGS_DEFAULTS });
const walletState: WalletState = reactive({ ...WALLET_STATE_DEFAULTS });

/**
 * Load settings and wallet state from chrome.storage.local into memory.
 * Must be called before Pinia stores initialize.
 */
export async function loadSettings(): Promise<void> {
  const data = await chrome.storage.local.get([
    CHROME_STORAGE_KEYS.SETTINGS,
    CHROME_STORAGE_KEYS.ACCOUNTS,
    CHROME_STORAGE_KEYS.ACTIVE_ACCOUNT
  ]);

  if (data[CHROME_STORAGE_KEYS.SETTINGS]) {
    Object.assign(settings, SETTINGS_DEFAULTS, data[CHROME_STORAGE_KEYS.SETTINGS]);
  }

  if (data[CHROME_STORAGE_KEYS.ACCOUNTS]) {
    const raw = data[CHROME_STORAGE_KEYS.ACCOUNTS];
    walletState.accounts = typeof raw === 'string' ? JSON.parse(raw) : raw;
  }

  if (data[CHROME_STORAGE_KEYS.ACTIVE_ACCOUNT] != null) {
    walletState.activeAccountIndex =
      parseInt(String(data[CHROME_STORAGE_KEYS.ACTIVE_ACCOUNT])) || 0;
  }
}

export function getSettings(): Settings {
  return settings;
}

export function getWalletState(): WalletState {
  return walletState;
}

export async function saveSettings(partial: Partial<Settings>): Promise<void> {
  Object.assign(settings, partial);
  await chrome.storage.local.set({ [CHROME_STORAGE_KEYS.SETTINGS]: { ...settings } });
}

export async function saveWalletState(state: Partial<WalletState>): Promise<void> {
  Object.assign(walletState, state);
  const update: Record<string, any> = {};
  if (state.accounts !== undefined) {
    update[CHROME_STORAGE_KEYS.ACCOUNTS] = JSON.stringify(walletState.accounts);
  }
  if (state.activeAccountIndex !== undefined) {
    update[CHROME_STORAGE_KEYS.ACTIVE_ACCOUNT] = walletState.activeAccountIndex.toString();
  }
  await chrome.storage.local.set(update);
}

export async function clearAllSettings(): Promise<void> {
  resetSettingsState();
  await chrome.storage.local.remove([
    CHROME_STORAGE_KEYS.SETTINGS,
    CHROME_STORAGE_KEYS.ACCOUNTS,
    CHROME_STORAGE_KEYS.ACTIVE_ACCOUNT
  ]);
}

/**
 * Reset in-memory settings to defaults. Used by clearAllSettings()
 * and in test teardown to prevent state leaking between tests.
 */
export function resetSettingsState(): void {
  Object.assign(settings, SETTINGS_DEFAULTS);
  walletState.accounts = [];
  walletState.activeAccountIndex = 0;
}
