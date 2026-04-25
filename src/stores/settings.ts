import { defineStore } from 'pinia';
import { getSettings, saveSettings, type Settings } from '@/utils/settings';

export const useSettingsStore = defineStore('settings', () => {
  const settings = getSettings();

  async function setCurrency(currency: Settings['currency']) {
    await saveSettings({ currency });
  }

  async function setExplorer(explorer: Settings['explorer']) {
    await saveSettings({ explorer });
  }

  async function setLockDuration(minutes: number) {
    await saveSettings({ lockDuration: minutes });
  }

  return {
    settings,
    setCurrency,
    setExplorer,
    setLockDuration
  };
});
