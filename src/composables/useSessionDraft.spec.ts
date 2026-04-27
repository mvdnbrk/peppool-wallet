import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { useSessionDraft } from './useSessionDraft';

describe('useSessionDraft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves an envelope { data, timestamp } when data changes', async () => {
    const value = ref('');
    const { load: _load } = useSessionDraft({
      key: 'test_draft',
      data: () => ({ value: value.value })
    });

    value.value = 'hello';
    await flushPromises();

    expect(chrome.storage.session.set).toHaveBeenCalledWith(
      expect.objectContaining({
        test_draft: expect.objectContaining({
          data: { value: 'hello' },
          timestamp: expect.any(Number)
        })
      })
    );
    void _load;
  });

  it('load returns envelope.data when present', async () => {
    vi.mocked(chrome.storage.session.get).mockResolvedValueOnce({
      test_draft: { data: { value: 'restored' }, timestamp: Date.now() }
    });

    const value = ref('');
    const { load } = useSessionDraft({
      key: 'test_draft',
      data: () => ({ value: value.value })
    });

    expect(await load()).toEqual({ value: 'restored' });
  });

  it('load returns null and clears when ttl exceeded', async () => {
    vi.mocked(chrome.storage.session.get).mockResolvedValueOnce({
      test_draft: { data: { value: 'stale' }, timestamp: Date.now() - 10_000 }
    });

    const value = ref('');
    const { load } = useSessionDraft({
      key: 'test_draft',
      data: () => ({ value: value.value }),
      ttlMs: 5_000
    });

    expect(await load()).toBeNull();
    expect(chrome.storage.session.remove).toHaveBeenCalledWith('test_draft');
  });

  it('load returns null when key is missing', async () => {
    vi.mocked(chrome.storage.session.get).mockResolvedValueOnce({});

    const value = ref('');
    const { load } = useSessionDraft({
      key: 'test_draft',
      data: () => ({ value: value.value })
    });

    expect(await load()).toBeNull();
  });

  it('load tolerates legacy/malformed payloads (no envelope)', async () => {
    vi.mocked(chrome.storage.session.get).mockResolvedValueOnce({
      test_draft: { value: 'old-shape-no-envelope' }
    });

    const value = ref('');
    const { load } = useSessionDraft({
      key: 'test_draft',
      data: () => ({ value: value.value })
    });

    expect(await load()).toBeNull();
  });

  it('clear removes the key', async () => {
    const value = ref('');
    const { clear } = useSessionDraft({
      key: 'test_draft',
      data: () => ({ value: value.value })
    });

    await clear();
    expect(chrome.storage.session.remove).toHaveBeenCalledWith('test_draft');
  });
});
