import { watch } from 'vue';

interface DraftEnvelope<T> {
  data: T;
  timestamp: number;
}

interface UseSessionDraftOptions<T> {
  key: string;
  data: () => T;
  ttlMs?: number;
}

export function useSessionDraft<T extends object>(opts: UseSessionDraftOptions<T>) {
  async function load(): Promise<T | null> {
    const result = await chrome.storage.session.get(opts.key);
    const envelope = result[opts.key] as DraftEnvelope<T> | undefined;
    if (!envelope || typeof envelope !== 'object' || !('data' in envelope)) return null;
    if (opts.ttlMs && Date.now() - (envelope.timestamp ?? 0) > opts.ttlMs) {
      await clear();
      return null;
    }
    return envelope.data;
  }

  async function save() {
    await chrome.storage.session.set({
      [opts.key]: { data: opts.data(), timestamp: Date.now() }
    });
  }

  async function clear() {
    await chrome.storage.session.remove(opts.key);
  }

  watch(opts.data, save);

  return { load, clear };
}
