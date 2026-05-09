import { describe, it, expect, beforeEach, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useWalletStore } from '@/stores/wallet';
import { useApprovalRequest } from './useApprovalRequest';

window.close = vi.fn();

function setSearch(search: string) {
  Object.defineProperty(window, 'location', {
    value: { search, origin: 'https://test-dapp.com', pathname: '/approval.html' },
    writable: true
  });
}

/**
 * Mounts a host component that exposes the composable's return value via a ref,
 * so tests can assert against and drive its state directly.
 */
function mountHost<T = ReturnType<typeof useApprovalRequest>>(
  options: Parameters<typeof useApprovalRequest>[0] = {}
) {
  let api!: T;
  const Host = defineComponent({
    setup() {
      api = useApprovalRequest(options) as T;
      return () => h('div');
    }
  });
  const wrapper = mount(Host);
  return {
    wrapper,
    get api() {
      return api;
    }
  };
}

describe('useApprovalRequest', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    setSearch('?id=req123&origin=https://test-dapp.com&method=sendTransfer');

    const store = useWalletStore();
    vi.spyOn(store, 'checkSession').mockResolvedValue(true);

    (global.chrome.storage.local.get as any).mockImplementation((key: string) => {
      if (key === 'request_req123') {
        return Promise.resolve({
          request_req123: {
            requestId: 'req123',
            method: 'sendTransfer',
            params: { recipient: 'Precipient', amount: 50_000_000 },
            origin: 'https://test-dapp.com'
          }
        });
      }
      return Promise.resolve({});
    });
  });

  it('parses query params and loads the request from chrome.storage.local', async () => {
    const host = mountHost();
    await flushPromises();

    expect(host.api.requestId.value).toBe('req123');
    expect(host.api.origin.value).toBe('https://test-dapp.com');
    expect(host.api.method.value).toBe('sendTransfer');
    expect(host.api.requestData.value).toMatchObject({
      requestId: 'req123',
      method: 'sendTransfer',
      params: { recipient: 'Precipient', amount: 50_000_000 }
    });
  });

  it('calls walletStore.checkSession on mount to restore unlock state', async () => {
    const store = useWalletStore();
    const spy = vi.spyOn(store, 'checkSession').mockResolvedValue(true);

    mountHost();
    await flushPromises();

    expect(spy).toHaveBeenCalled();
  });

  it('runs validate() and surfaces invalidRequest when it returns a message', async () => {
    const validate = vi.fn().mockReturnValue('Invalid Pepecoin address.');
    const host = mountHost({ validate });
    await flushPromises();

    expect(validate).toHaveBeenCalledOnce();
    expect(host.api.invalidRequest.value).toBe('Invalid Pepecoin address.');
  });

  it('skips checkSession when validation fails — no need to restore session for an invalid screen', async () => {
    const store = useWalletStore();
    const checkSpy = vi.spyOn(store, 'checkSession').mockResolvedValue(true);

    mountHost({ validate: () => 'bad' });
    await flushPromises();

    expect(checkSpy).not.toHaveBeenCalled();
  });

  it('does not set invalidRequest when validate returns null', async () => {
    const host = mountHost({ validate: () => null });
    await flushPromises();
    expect(host.api.invalidRequest.value).toBe('');
  });

  it('approve() sends the result to background, clears storage, and closes the window', async () => {
    const host = mountHost();
    await flushPromises();

    await host.api.approve({ txid: 'mock-txid' });

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      result: { txid: 'mock-txid' }
    });
    expect(global.chrome.storage.local.remove).toHaveBeenCalledWith('request_req123');
    expect(window.close).toHaveBeenCalled();
  });

  it('reject() sends an error to background, clears storage, and closes the window', async () => {
    const host = mountHost();
    await flushPromises();

    await host.api.reject('User rejected');

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      error: 'User rejected'
    });
    expect(global.chrome.storage.local.remove).toHaveBeenCalledWith('request_req123');
    expect(window.close).toHaveBeenCalled();
  });

  it('reject() is a no-op when requestId is missing — guards against pre-mount calls', async () => {
    setSearch('?origin=https://test-dapp.com');
    (global.chrome.storage.local.get as any).mockResolvedValue({});

    const host = mountHost();
    await flushPromises();

    await host.api.reject('whatever');

    expect(global.chrome.runtime.sendMessage).not.toHaveBeenCalled();
    expect(window.close).not.toHaveBeenCalled();
  });

  describe('runWithMnemonic', () => {
    it('prompts for password when wallet is locked and password field is empty', async () => {
      const store = useWalletStore();
      vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(false);
      const action = vi.fn();

      const host = mountHost();
      await flushPromises();

      await host.api.runWithMnemonic(action);

      expect(host.api.error.value).toBe('Please enter your password');
      expect(action).not.toHaveBeenCalled();
      expect(host.api.isProcessing.value).toBe(false);
    });

    it('shows "Invalid password" when unlock fails, and does not run the action', async () => {
      const store = useWalletStore();
      vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(false);
      const unlockSpy = vi.spyOn(store, 'unlock').mockResolvedValue(false);
      const action = vi.fn();

      const host = mountHost();
      await flushPromises();
      host.api.password.value = 'wrong';

      await host.api.runWithMnemonic(action);

      expect(unlockSpy).toHaveBeenCalledWith('wrong');
      expect(host.api.error.value).toBe('Invalid password');
      expect(host.api.isProcessing.value).toBe(false);
      expect(action).not.toHaveBeenCalled();
    });

    it('unlocks then invokes withMnemonic with the action when password is correct', async () => {
      const store = useWalletStore();
      vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(false);
      vi.spyOn(store, 'unlock').mockResolvedValue(true);
      const withMnemonicSpy = vi
        .spyOn(store, 'withMnemonic')
        .mockImplementation((fn: any) => fn('test mnemonic'));
      const action = vi.fn().mockResolvedValue(undefined);

      const host = mountHost();
      await flushPromises();
      host.api.password.value = 'correct';

      await host.api.runWithMnemonic(action);

      expect(withMnemonicSpy).toHaveBeenCalled();
      expect(action).toHaveBeenCalledWith('test mnemonic');
    });

    it('skips password gating when mnemonic is already loaded', async () => {
      const store = useWalletStore();
      vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
      const unlockSpy = vi.spyOn(store, 'unlock');
      vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) => fn('mnemonic'));
      const action = vi.fn().mockResolvedValue(undefined);

      const host = mountHost();
      await flushPromises();

      await host.api.runWithMnemonic(action);

      expect(unlockSpy).not.toHaveBeenCalled();
      expect(action).toHaveBeenCalledWith('mnemonic');
    });

    it('captures errors thrown inside the action into error and resets isProcessing', async () => {
      const store = useWalletStore();
      vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
      vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) => fn('mnemonic'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const host = mountHost();
      await flushPromises();

      await host.api.runWithMnemonic(async () => {
        throw new Error('boom');
      });

      expect(host.api.error.value).toBe('boom');
      expect(host.api.isProcessing.value).toBe(false);
      consoleErrorSpy.mockRestore();
    });

    it('falls back to "Action failed" when thrown error has no message', async () => {
      const store = useWalletStore();
      vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
      vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) => fn('mnemonic'));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const host = mountHost();
      await flushPromises();

      await host.api.runWithMnemonic(async () => {
        throw {};
      });

      expect(host.api.error.value).toBe('Action failed');
    });

    it('is a no-op when requestData has not loaded yet', async () => {
      (global.chrome.storage.local.get as any).mockResolvedValue({});
      const action = vi.fn();

      const host = mountHost();
      await flushPromises();

      await host.api.runWithMnemonic(action);

      expect(action).not.toHaveBeenCalled();
      expect(host.api.error.value).toBe('');
    });

    it('clears any previous error message at the start of a new run', async () => {
      const store = useWalletStore();
      vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
      vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) => fn('mnemonic'));

      const host = mountHost();
      await flushPromises();
      host.api.error.value = 'stale';

      await host.api.runWithMnemonic(async () => {
        // The error must already be cleared by the time the action runs,
        // so that UI feedback during the action is not blended with prior failures.
        expect(host.api.error.value).toBe('');
      });
      await nextTick();
    });
  });
});
