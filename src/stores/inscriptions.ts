import { defineStore } from 'pinia';
import { ref, readonly } from 'vue';
import { fetchAddressInscriptions, fetchInscription, fetchInscriptionOutputs } from '@/utils/api';
import type { Inscription } from '@/models/Inscription';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage';

const BATCH_SIZE = 5;

interface PersistedData {
  inscriptions: Record<string, Inscription>;
  outputs: string[];
  lastSyncedHeight: number;
  utxoValueRibbits?: number;
}

function getCache(): Record<string, PersistedData> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.INSCRIPTIONS) || '{}');
  } catch {
    return {};
  }
}

function loadFromStorage(address: string): PersistedData {
  return getCache()[address] || { inscriptions: {}, outputs: [], lastSyncedHeight: 0 };
}

function saveToStorage(address: string, data: PersistedData): void {
  const cache = getCache();
  cache[address] = data;
  localStorage.setItem(LOCAL_STORAGE_KEYS.INSCRIPTIONS, JSON.stringify(cache));
}

export const useInscriptionStore = defineStore('inscriptions', () => {
  const inscriptions = ref<Record<string, Inscription>>({});
  const outputs = ref<string[]>([]);
  const lastSyncedHeight = ref(0);
  const utxoValueRibbits = ref(0);
  const syncing = ref(false);

  let loadedAddress: string | null = null;

  function load(address: string): void {
    const data = loadFromStorage(address);
    inscriptions.value = data.inscriptions;
    outputs.value = data.outputs;
    lastSyncedHeight.value = data.lastSyncedHeight;
    utxoValueRibbits.value = data.utxoValueRibbits ?? 0;
    loadedAddress = address;
  }

  function persist(): void {
    if (!loadedAddress) return;
    saveToStorage(loadedAddress, {
      inscriptions: inscriptions.value,
      outputs: outputs.value,
      lastSyncedHeight: lastSyncedHeight.value,
      utxoValueRibbits: utxoValueRibbits.value
    });
  }

  function setUtxoValueRibbits(ribbits: number): void {
    utxoValueRibbits.value = ribbits;
    persist();
  }

  /**
   * Sync inscriptions for the given address. Skips if tipHeight hasn't changed.
   * Called from wallet store after balance refresh.
   */
  async function sync(address: string, tipHeight: number): Promise<void> {
    if (syncing.value) return;

    // Load cached data if switching address
    if (loadedAddress !== address) {
      load(address);
    }

    // Skip if already synced at this height
    if (lastSyncedHeight.value === tipHeight && tipHeight > 0) return;

    syncing.value = true;
    try {
      const response = await fetchAddressInscriptions(address);
      const remoteIds = new Set(response.inscriptions);
      const localIds = new Set(Object.keys(inscriptions.value));

      // Find new inscription IDs (in remote but not local)
      const newIds = response.inscriptions.filter((id) => !localIds.has(id));

      // Remove gone inscriptions (in local but not remote)
      for (const id of localIds) {
        if (!remoteIds.has(id)) {
          delete inscriptions.value[id];
        }
      }

      // Fetch details for new inscriptions in batches
      for (let i = 0; i < newIds.length; i += BATCH_SIZE) {
        const batch = newIds.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map((id) => fetchInscription(id)));
        for (const inscription of results) {
          inscriptions.value[inscription.id] = inscription;
        }
      }

      outputs.value = response.outputs;
      lastSyncedHeight.value = tipHeight;
      persist();
    } catch (e) {
      console.error('Failed to sync inscriptions', e);
    } finally {
      syncing.value = false;
    }
  }

  /**
   * Returns inscription outputs as a Set for UTXO exclusion.
   * Uses cache if synced, otherwise fetches from API directly.
   */
  async function getOutputsSet(address: string): Promise<Set<string>> {
    if (lastSyncedHeight.value > 0) {
      return new Set(outputs.value);
    }
    const fresh = await fetchInscriptionOutputs(address).catch(() => [] as string[]);
    return new Set(fresh);
  }

  /**
   * Clear all inscription data (called on wallet reset/lock).
   */
  function clear(): void {
    inscriptions.value = {};
    outputs.value = [];
    lastSyncedHeight.value = 0;
    utxoValueRibbits.value = 0;
    loadedAddress = null;
  }

  return {
    inscriptions: readonly(inscriptions),
    outputs: readonly(outputs),
    lastSyncedHeight: readonly(lastSyncedHeight),
    utxoValueRibbits: readonly(utxoValueRibbits),
    syncing: readonly(syncing),
    load,
    sync,
    setUtxoValueRibbits,
    getOutputsSet,
    clear
  };
});
