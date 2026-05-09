import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * The inpage script runs in a raw browser context and self-executes on import.
 * We reset window state between tests and dynamically import the module
 * to re-trigger injection each time.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function cleanWindowState() {
  delete (window as any).pep_providers;
  delete (window as any).wbip_providers;
  delete (window as any).PepecoinProvider;
  // Note: __peppoolRequestListener is intentionally not cleaned. The listener
  // it guards is registered on window once and cannot be removed without a
  // reference, so deleting the flag would re-add a duplicate listener on the
  // next injection.
}

async function loadInpage() {
  // Clear module cache so the script runs fresh
  const modulePath = './inpage';
  vi.resetModules();
  await import(modulePath);
}

describe('Inpage Provider Injection', () => {
  beforeEach(() => {
    cleanWindowState();
  });

  afterEach(() => {
    cleanWindowState();
  });

  it('injects provider into window.pep_providers', async () => {
    await loadInpage();

    const providers = (window as any).pep_providers;
    expect(providers).toBeDefined();
    expect(providers).toHaveLength(1);
    expect(providers[0].id).toBe('peppool');
    expect(providers[0].name).toBe('Peppool');
    expect(providers[0].methods).toContain('wallet_connect');
    expect(providers[0].methods).toContain('signMessage');
    expect(providers[0].methods).toContain('sendTransfer');
    expect(providers[0].methods).toContain('signPsbt');
  });

  it('exposes the same provider as window.PepecoinProvider', async () => {
    await loadInpage();

    const providers = (window as any).pep_providers;
    const direct = (window as any).PepecoinProvider;
    expect(direct).toBe(providers[0]);
  });

  it('dispatches pep_providers:announce with provider in detail on injection', async () => {
    const handler = vi.fn();
    window.addEventListener('pep_providers:announce', handler);

    await loadInpage();

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.provider.id).toBe('peppool');

    window.removeEventListener('pep_providers:announce', handler);
  });

  it('re-announces when a dApp dispatches pep_providers:request after injection', async () => {
    await loadInpage();

    const handler = vi.fn();
    window.addEventListener('pep_providers:announce', handler);

    window.dispatchEvent(new Event('pep_providers:request'));

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail.provider.id).toBe('peppool');

    window.removeEventListener('pep_providers:announce', handler);
  });

  it('does not set window.wbip_providers (Pepecoin is not Bitcoin)', async () => {
    await loadInpage();

    expect((window as any).wbip_providers).toBeUndefined();
  });

  it('prevents duplicate injection when called twice', async () => {
    await loadInpage();
    await loadInpage();

    const providers = (window as any).pep_providers;
    expect(providers).toHaveLength(1);
  });

  it('appends to existing pep_providers array from other wallets', async () => {
    const otherProvider = { id: 'other-wallet', name: 'Other', icon: '', methods: [] };
    (window as any).pep_providers = [otherProvider];

    await loadInpage();

    const providers = (window as any).pep_providers;
    expect(providers).toHaveLength(2);
    expect(providers[0].id).toBe('other-wallet');
    expect(providers[1].id).toBe('peppool');
  });
});

describe('Inpage Provider request()', () => {
  beforeEach(() => {
    cleanWindowState();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanWindowState();
    vi.useRealTimers();
  });

  it('generates a UUID v4 requestId in postMessage', async () => {
    await loadInpage();
    const provider = (window as any).PepecoinProvider;

    const postMessageSpy = vi.spyOn(window, 'postMessage');
    // Don't await — it won't resolve without a response
    provider.request('wallet_connect');

    expect(postMessageSpy).toHaveBeenCalledTimes(1);
    const payload = postMessageSpy.mock.calls[0][0] as any;
    expect(payload.target).toBe('peppool-content');
    expect(payload.method).toBe('wallet_connect');
    expect(payload.requestId).toMatch(UUID_REGEX);

    postMessageSpy.mockRestore();
  });

  it('resolves when a matching response arrives', async () => {
    await loadInpage();
    const provider = (window as any).PepecoinProvider;

    const postMessageSpy = vi.spyOn(window, 'postMessage');
    const promise = provider.request('getAccounts');

    const requestId = (postMessageSpy.mock.calls[0][0] as any).requestId;

    // Simulate content script response
    window.dispatchEvent(
      new MessageEvent('message', {
        source: window,
        data: { target: 'peppool-inpage', requestId, result: ['Paddr123'] }
      })
    );

    const result = await promise;
    expect(result).toEqual(['Paddr123']);
    postMessageSpy.mockRestore();
  });

  it('rejects when a matching error response arrives', async () => {
    await loadInpage();
    const provider = (window as any).PepecoinProvider;

    const postMessageSpy = vi.spyOn(window, 'postMessage');
    const promise = provider.request('wallet_connect');

    const requestId = (postMessageSpy.mock.calls[0][0] as any).requestId;

    window.dispatchEvent(
      new MessageEvent('message', {
        source: window,
        data: { target: 'peppool-inpage', requestId, error: 'User rejected' }
      })
    );

    await expect(promise).rejects.toThrow('User rejected');
    postMessageSpy.mockRestore();
  });

  it('rejects after 5-minute timeout if no response', async () => {
    await loadInpage();
    const provider = (window as any).PepecoinProvider;

    const promise = provider.request('wallet_connect');

    vi.advanceTimersByTime(300_001);

    await expect(promise).rejects.toThrow('Request timed out after 5 minutes');
  });

  it('cleans up event listener after successful response', async () => {
    await loadInpage();
    const provider = (window as any).PepecoinProvider;

    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const postMessageSpy = vi.spyOn(window, 'postMessage');

    const promise = provider.request('getAccounts');
    const requestId = (postMessageSpy.mock.calls[0][0] as any).requestId;

    window.dispatchEvent(
      new MessageEvent('message', {
        source: window,
        data: { target: 'peppool-inpage', requestId, result: ['Paddr'] }
      })
    );

    await promise;

    expect(removeSpy).toHaveBeenCalledWith('message', expect.any(Function));
    removeSpy.mockRestore();
    postMessageSpy.mockRestore();
  });

  it('cleans up event listener after timeout', async () => {
    await loadInpage();
    const provider = (window as any).PepecoinProvider;

    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const promise = provider.request('wallet_connect');
    vi.advanceTimersByTime(300_001);

    await promise.catch(() => {});

    expect(removeSpy).toHaveBeenCalledWith('message', expect.any(Function));
    removeSpy.mockRestore();
  });
});
