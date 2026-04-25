import { defineStore } from 'pinia';
import { computed } from 'vue';
import { getSettings, saveSettings } from '@/utils/settings';
import { EXPLORERS, type ExplorerId } from '@/utils/explorer';

export const useSettingsStore = defineStore('settings', () => {
  const settings = getSettings();

  const currencySymbol = computed(() => (settings.currency === 'USD' ? '$' : '€'));

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
    currencySymbol,
    setCurrency,
    setExplorer,
    setLockDuration
  };
});
