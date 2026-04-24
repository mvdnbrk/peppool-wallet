import type { ExplorerId } from './explorer';
import type { Account } from '@/stores/wallet';

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

let settings: Settings = { ...SETTINGS_DEFAULTS };
let walletState: WalletState = { ...WALLET_STATE_DEFAULTS };

function hasChromeStorage(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local;
}

/**
 * Load settings and wallet state from chrome.storage.local into memory.
 * Must be called before Pinia stores initialize.
 */
export async function loadSettings(): Promise<void> {
  if (!hasChromeStorage()) return;

  const data = await chrome.storage.local.get([
    'peppool_settings',
    'peppool_accounts',
    'peppool_active_account'
  ]);

  if (data.peppool_settings) {
    settings = { ...SETTINGS_DEFAULTS, ...data.peppool_settings };
  }

  if (data.peppool_accounts) {
    const raw = data.peppool_accounts;
    walletState.accounts = typeof raw === 'string' ? JSON.parse(raw) : raw;
  }

  if (data.peppool_active_account != null) {
    walletState.activeAccountIndex = parseInt(String(data.peppool_active_account)) || 0;
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
  if (hasChromeStorage()) {
    await chrome.storage.local.set({ peppool_settings: { ...settings } });
  }
}

export async function saveWalletState(state: Partial<WalletState>): Promise<void> {
  Object.assign(walletState, state);
  if (hasChromeStorage()) {
    const update: Record<string, any> = {};
    if (state.accounts !== undefined) {
      update.peppool_accounts = JSON.stringify(walletState.accounts);
    }
    if (state.activeAccountIndex !== undefined) {
      update.peppool_active_account = walletState.activeAccountIndex.toString();
    }
    await chrome.storage.local.set(update);
  }
}

export async function clearAllSettings(): Promise<void> {
  resetSettingsState();
  if (hasChromeStorage()) {
    await chrome.storage.local.remove([
      'peppool_settings',
      'peppool_accounts',
      'peppool_active_account'
    ]);
  }
}

/**
 * Reset in-memory settings to defaults. Used by clearAllSettings()
 * and in test teardown to prevent state leaking between tests.
 */
export function resetSettingsState(): void {
  settings = { ...SETTINGS_DEFAULTS };
  walletState = { ...WALLET_STATE_DEFAULTS };
}
