import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from './settings';
import { resetSettingsState } from '@/utils/settings';
import { pepeExplorer } from '@/utils/explorer';

describe('Settings Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    resetSettingsState();
    vi.clearAllMocks();
  });

  it('should initialize with defaults', () => {
    const store = useSettingsStore();
    expect(store.settings.currency).toBe('USD');
    expect(store.settings.explorer).toBe('peppool');
    expect(store.currencySymbol).toBe('$');
  });

  it('should handle currency changes correctly', async () => {
    const store = useSettingsStore();
    expect(store.settings.currency).toBe('USD');

    await store.setCurrency('EUR');
    expect(store.settings.currency).toBe('EUR');
    expect(store.currencySymbol).toBe('€');
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({ peppool_settings: expect.objectContaining({ currency: 'EUR' }) })
    );
  });

  it('should handle explorer changes correctly', async () => {
    const store = useSettingsStore();
    expect(store.settings.explorer).toBe('peppool');

    await store.setExplorer('pepeblocks');
    expect(store.settings.explorer).toBe('pepeblocks');
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        peppool_settings: expect.objectContaining({ explorer: 'pepeblocks' })
      })
    );
  });

  it('should open explorer links based on selected explorer', async () => {
    const store = useSettingsStore();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    pepeExplorer.openTx(store.settings.explorer, 'tx123');
    expect(openSpy).toHaveBeenCalledWith('https://peppool.space/tx/tx123', '_blank');

    await store.setExplorer('pepeblocks');
    pepeExplorer.openAddress(store.settings.explorer, 'addr123');
    expect(openSpy).toHaveBeenCalledWith('https://pepeblocks.com/address/addr123', '_blank');

    openSpy.mockRestore();
  });
});
