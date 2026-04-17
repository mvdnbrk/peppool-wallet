import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useWalletStore } from '@/stores/wallet';
import SignMessageView from './SignMessageView.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';

// Mock window.location.search
const mockSearch = '?id=req123&origin=https://test-dapp.com&method=signMessage';
Object.defineProperty(window, 'location', {
  value: {
    search: mockSearch,
    origin: 'https://test-dapp.com',
    pathname: '/approval.html'
  },
  writable: true
});

// Mock window.close
window.close = vi.fn();

// Mock signMessage utility
vi.mock('@/utils/crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/crypto')>();
  return {
    ...actual,
    signMessage: vi.fn(() => 'mock-signature')
  };
});

describe('SignMessageView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();

    // Mock storage to return the sign message request
    (global.chrome.storage.local.get as any).mockImplementation(async (key: string) => {
      if (key === 'request_req123') {
        return {
          request_req123: {
            requestId: 'req123',
            method: 'signMessage',
            origin: 'https://test-dapp.com',
            params: { message: 'Hello Pepecoin' }
          }
        };
      }
      return {};
    });

    const store = useWalletStore();
    vi.spyOn(store, 'checkSession').mockResolvedValue(true);
  });

  const globalConfig = {
    components: {
      PepButton,
      PepMainLayout,
      PepPageHeader,
      PepPasswordInput
    }
  };

  it('should display the dApp origin and message to sign', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;

    const wrapper = mount(SignMessageView, {
      global: globalConfig
    });

    await flushPromises();

    expect(wrapper.text()).toContain('https://test-dapp.com');
    expect(wrapper.text()).toContain('Hello Pepecoin');
  });

  it('should request password if mnemonic is not cached', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;
    // ensure no mnemonic loaded
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(false);

    const wrapper = mount(SignMessageView, {
      global: globalConfig
    });

    await flushPromises();

    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('should sign and send response on approve', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
    vi.spyOn(store, 'getMnemonic').mockResolvedValue(
      'suffer dish east miss seat great brother hello motion mountain celery plunge'
    );

    const wrapper = mount(SignMessageView, {
      global: globalConfig
    });

    await flushPromises();

    const approveBtn = wrapper.find('#approve-signature-button');
    await approveBtn.trigger('click');
    await flushPromises();

    // Verify message to background
    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      result: expect.objectContaining({
        signature: 'mock-signature',
        message: 'Hello Pepecoin'
      })
    });

    expect(window.close).toHaveBeenCalled();
  });

  it('should send rejection and close on cancel', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;

    const wrapper = mount(SignMessageView, {
      global: globalConfig
    });

    await flushPromises();

    const rejectBtn = wrapper.find('#reject-signature-button');
    await rejectBtn?.trigger('click');
    await flushPromises();

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      error: 'User rejected the signature request'
    });

    expect(window.close).toHaveBeenCalled();
  });
});
