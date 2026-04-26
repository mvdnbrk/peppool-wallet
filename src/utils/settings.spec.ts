import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadSettings,
  getSettings,
  getWalletState,
  saveSettings,
  saveWalletState,
  clearAllSettings,
  resetSettingsState
} from './settings';

describe('Settings Module', () => {
  beforeEach(() => {
    resetSettingsState();
    vi.mocked(chrome.storage.local.get).mockResolvedValue({});
    vi.mocked(chrome.storage.local.set).mockResolvedValue(undefined);
    vi.mocked(chrome.storage.local.remove).mockResolvedValue(undefined);
  });

  describe('getSettings', () => {
    it('should return defaults before loadSettings is called', () => {
      const s = getSettings();
      expect(s.currency).toBe('USD');
      expect(s.explorer).toBe('peppool');
      expect(s.lockDuration).toBe(15);
    });
  });

  describe('getWalletState', () => {
    it('should return defaults before loadSettings is called', () => {
      const ws = getWalletState();
      expect(ws.accounts).toEqual([]);
      expect(ws.activeAccountIndex).toBe(0);
    });
  });

  describe('loadSettings', () => {
    it('should load settings from chrome.storage.local', async () => {
      vi.mocked(chrome.storage.local.get).mockResolvedValue({
        peppool_settings: { currency: 'EUR', explorer: 'pepeblocks', lockDuration: 30 }
      });

      await loadSettings();

      const s = getSettings();
      expect(s.currency).toBe('EUR');
      expect(s.explorer).toBe('pepeblocks');
      expect(s.lockDuration).toBe(30);
    });

    it('should load wallet state from chrome.storage.local', async () => {
      const accounts = [{ address: 'P1', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
      vi.mocked(chrome.storage.local.get).mockResolvedValue({
        peppool_accounts: JSON.stringify(accounts),
        peppool_active_account: '0'
      });

      await loadSettings();

      const ws = getWalletState();
      expect(ws.accounts).toEqual(accounts);
      expect(ws.activeAccountIndex).toBe(0);
    });

    it('should merge partial settings with defaults', async () => {
      vi.mocked(chrome.storage.local.get).mockResolvedValue({
        peppool_settings: { currency: 'EUR' }
      });

      await loadSettings();

      const s = getSettings();
      expect(s.currency).toBe('EUR');
      expect(s.explorer).toBe('peppool');
      expect(s.lockDuration).toBe(15);
    });

    it('should use defaults when chrome.storage.local is empty', async () => {
      await loadSettings();

      const s = getSettings();
      expect(s.currency).toBe('USD');
      expect(s.explorer).toBe('peppool');
      expect(s.lockDuration).toBe(15);
    });
  });

  describe('saveSettings', () => {
    it('should update in-memory settings and persist to chrome.storage.local', async () => {
      await saveSettings({ currency: 'EUR' });

      expect(getSettings().currency).toBe('EUR');
      expect(getSettings().explorer).toBe('peppool');
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        peppool_settings: { currency: 'EUR', explorer: 'peppool', lockDuration: 15 }
      });
    });
  });

  describe('saveWalletState', () => {
    it('should persist accounts to chrome.storage.local', async () => {
      const accounts = [{ address: 'P1', path: "m/44'/3434'/0'/0/0", label: 'Test' }];
      await saveWalletState({ accounts });

      expect(getWalletState().accounts).toEqual(accounts);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        peppool_accounts: JSON.stringify(accounts)
      });
    });

    it('should persist activeAccountIndex to chrome.storage.local', async () => {
      await saveWalletState({ activeAccountIndex: 2 });

      expect(getWalletState().activeAccountIndex).toBe(2);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        peppool_active_account: '2'
      });
    });
  });

  describe('clearAllSettings', () => {
    it('should reset state and remove from chrome.storage.local', async () => {
      await saveSettings({ currency: 'EUR', lockDuration: 30 });
      await saveWalletState({
        accounts: [{ address: 'P1', path: 'm/0', label: 'X' }],
        activeAccountIndex: 1
      });

      await clearAllSettings();

      expect(getSettings().currency).toBe('USD');
      expect(getSettings().lockDuration).toBe(15);
      expect(getWalletState().accounts).toEqual([]);
      expect(getWalletState().activeAccountIndex).toBe(0);
      expect(chrome.storage.local.remove).toHaveBeenCalledWith([
        'peppool_settings',
        'peppool_accounts',
        'peppool_active_account'
      ]);
    });
  });
});
