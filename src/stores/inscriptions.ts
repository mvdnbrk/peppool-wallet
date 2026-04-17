import { defineStore } from 'pinia';
import { ref, readonly } from 'vue';
import { fetchAddressInscriptions, fetchInscription } from '@/utils/api';
import type { Inscription } from '@/models/Inscription';

const BATCH_SIZE = 5;

interface PersistedData {
  inscriptions: Record<string, Inscription>;
  outputs: string[];
  lastSyncedHeight: number;
}

function storageKey(address: string): string {
  return `peppool_inscriptions_${address}`;
}

function loadFromStorage(address: string): PersistedData {
  try {
    const raw = localStorage.getItem(storageKey(address));
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt data */
  }
  return { inscriptions: {}, outputs: [], lastSyncedHeight: 0 };
}

function saveToStorage(address: string, data: PersistedData): void {
  localStorage.setItem(storageKey(address), JSON.stringify(data));
}

export const useInscriptionStore = defineStore('inscriptions', () => {
  const inscriptions = ref<Record<string, Inscription>>({});
  const outputs = ref<string[]>([]);
  const lastSyncedHeight = ref(0);
  const syncing = ref(false);

  let loadedAddress: string | null = null;

  function load(address: string): void {
    const data = loadFromStorage(address);
    inscriptions.value = data.inscriptions;
    outputs.value = data.outputs;
    lastSyncedHeight.value = data.lastSyncedHeight;
    loadedAddress = address;
  }

  function persist(): void {
    if (!loadedAddress) return;
    saveToStorage(loadedAddress, {
      inscriptions: inscriptions.value,
      outputs: outputs.value,
      lastSyncedHeight: lastSyncedHeight.value
    });
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
   * Returns the cached inscription outputs as a Set for UTXO exclusion.
   */
  function getOutputsSet(): Set<string> {
    return new Set(outputs.value);
  }

  /**
   * Clear all inscription data (called on wallet reset/lock).
   */
  function clear(): void {
    inscriptions.value = {};
    outputs.value = [];
    lastSyncedHeight.value = 0;
    loadedAddress = null;
  }

  return {
    inscriptions: readonly(inscriptions),
    outputs: readonly(outputs),
    lastSyncedHeight: readonly(lastSyncedHeight),
    syncing: readonly(syncing),
    load,
    sync,
    getOutputsSet,
    clear
  };
});
