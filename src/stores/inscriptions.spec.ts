import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useInscriptionStore } from './inscriptions';
import type { Inscription } from '@/models/Inscription';

vi.mock('@/utils/api', () => ({
  fetchAddressInscriptions: vi.fn(),
  fetchInscription: vi.fn()
}));

import { fetchAddressInscriptions, fetchInscription } from '@/utils/api';

const mockInscription = (id: string): Inscription => ({
  id,
  number: 1,
  contentType: 'image/png',
  contentLength: 100,
  height: 500000,
  value: 100000,
  satpoint: `${id.replace('i0', '')}:0:0`,
  timestamp: 1700000000,
  properties: null
});

describe('Inscription Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('skips sync when tipHeight matches lastSyncedHeight', async () => {
    const store = useInscriptionStore();

    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0'],
      total: 1
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('abc123i0'));

    await store.sync('Paddr1', 100);
    expect(fetchAddressInscriptions).toHaveBeenCalledTimes(1);

    // Same height — should skip
    await store.sync('Paddr1', 100);
    expect(fetchAddressInscriptions).toHaveBeenCalledTimes(1);
  });

  it('syncs when tipHeight changes', async () => {
    const store = useInscriptionStore();

    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0'],
      total: 1
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('abc123i0'));

    await store.sync('Paddr1', 100);
    expect(fetchAddressInscriptions).toHaveBeenCalledTimes(1);

    // New block height — should sync again
    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0'],
      total: 1
    });

    await store.sync('Paddr1', 101);
    expect(fetchAddressInscriptions).toHaveBeenCalledTimes(2);
    // No new inscription IDs, so fetchInscription should not be called again
    expect(fetchInscription).toHaveBeenCalledTimes(1);
  });

  it('fetches details only for new inscriptions', async () => {
    const store = useInscriptionStore();

    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0'],
      total: 1
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('abc123i0'));

    await store.sync('Paddr1', 100);
    expect(fetchInscription).toHaveBeenCalledWith('abc123i0');

    // New block adds a second inscription
    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0', 'def456i0'],
      outputs: ['abc123:0', 'def456:0'],
      total: 2
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('def456i0'));

    await store.sync('Paddr1', 101);
    // Should only fetch the new one
    expect(fetchInscription).toHaveBeenCalledTimes(2);
    expect(fetchInscription).toHaveBeenLastCalledWith('def456i0');
  });

  it('removes inscriptions no longer in the remote list', async () => {
    const store = useInscriptionStore();

    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0', 'def456i0'],
      outputs: ['abc123:0', 'def456:0'],
      total: 2
    });
    vi.mocked(fetchInscription)
      .mockResolvedValueOnce(mockInscription('abc123i0'))
      .mockResolvedValueOnce(mockInscription('def456i0'));

    await store.sync('Paddr1', 100);
    expect(Object.keys(store.inscriptions)).toHaveLength(2);

    // Inscription transferred away
    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0'],
      total: 1
    });

    await store.sync('Paddr1', 101);
    expect(Object.keys(store.inscriptions)).toHaveLength(1);
    expect(store.inscriptions['abc123i0']).toBeDefined();
    expect(store.inscriptions['def456i0']).toBeUndefined();
  });

  it('returns cached outputs as a Set for UTXO exclusion', async () => {
    const store = useInscriptionStore();

    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0', 'def456:1'],
      total: 1
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('abc123i0'));

    await store.sync('Paddr1', 100);
    const set = await store.getOutputsSet('Paddr1');
    expect(set.has('abc123:0')).toBe(true);
    expect(set.has('def456:1')).toBe(true);
    expect(set.has('xyz789:0')).toBe(false);
  });

  it('persists to and loads from localStorage', async () => {
    const store1 = useInscriptionStore();

    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0'],
      total: 1
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('abc123i0'));

    await store1.sync('Paddr1', 100);

    // Create fresh store and load from storage
    setActivePinia(createPinia());
    const store2 = useInscriptionStore();
    store2.load('Paddr1');
    expect(store2.lastSyncedHeight).toBe(100);
    expect(Object.keys(store2.inscriptions)).toHaveLength(1);
  });

  it('handles API errors gracefully without clearing existing data', async () => {
    const store = useInscriptionStore();

    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0'],
      total: 1
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('abc123i0'));

    await store.sync('Paddr1', 100);
    expect(Object.keys(store.inscriptions)).toHaveLength(1);

    // API fails on next sync
    vi.mocked(fetchAddressInscriptions).mockRejectedValue(new Error('Network error'));
    await store.sync('Paddr1', 101);

    // Data should remain intact
    expect(Object.keys(store.inscriptions)).toHaveLength(1);
    expect(store.lastSyncedHeight).toBe(100); // Not updated
  });

  it('clears all data on clear()', async () => {
    const store = useInscriptionStore();

    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0'],
      total: 1
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('abc123i0'));

    await store.sync('Paddr1', 100);
    store.clear();

    expect(Object.keys(store.inscriptions)).toHaveLength(0);
    expect(store.outputs).toHaveLength(0);
    expect(store.lastSyncedHeight).toBe(0);
  });

  it('reloads data when switching to a different address', async () => {
    const store = useInscriptionStore();

    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['abc123i0'],
      outputs: ['abc123:0'],
      total: 1
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('abc123i0'));

    await store.sync('Paddr1', 100);

    // Switch to addr2 (no cached data)
    vi.mocked(fetchAddressInscriptions).mockResolvedValue({
      inscriptions: ['xyz789i0'],
      outputs: ['xyz789:0'],
      total: 1
    });
    vi.mocked(fetchInscription).mockResolvedValue(mockInscription('xyz789i0'));

    await store.sync('Paddr2', 100);
    expect(store.inscriptions['xyz789i0']).toBeDefined();
    expect(store.inscriptions['abc123i0']).toBeUndefined();
  });
});
