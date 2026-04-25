import { defineStore } from 'pinia';
import { getSettings, saveSettings } from '@/utils/settings';
import { EXPLORERS, type ExplorerId } from '@/utils/explorer';

export const useSettingsStore = defineStore('settings', () => {
  const settings = getSettings();

  async function setCurrency(currency: 'USD' | 'EUR') {
    await saveSettings({ currency });
  }

  async function setExplorer(explorer: ExplorerId) {
    await saveSettings({ explorer });
  }

  async function setLockDuration(minutes: number) {
    await saveSettings({ lockDuration: minutes });
  }

  return {
    settings,
    EXPLORERS,
    setCurrency,
    setExplorer,
    setLockDuration
  };
});
