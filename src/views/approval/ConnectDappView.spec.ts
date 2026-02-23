import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useWalletStore } from '@/stores/wallet';
import ConnectDappView from './ConnectDappView.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepCard from '@/components/ui/PepCard.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';

// Mock window.location.search
const mockSearch = '?id=req123&origin=https://test-dapp.com';
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

describe('ConnectDappView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    
    // Default mock implementation for storage
    (global.chrome.storage.local.get as any).mockResolvedValue({});

    const store = useWalletStore();
    vi.spyOn(store, 'checkSession').mockResolvedValue(true);
  });

  const globalConfig = {
    components: {
      PepButton,
      PepCard,
      PepMainLayout,
      PepPageHeader
    }
  };

  it('should display the dApp origin and requested account', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;
    store.accounts = [{ address: 'Paddress123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    store.activeAccountIndex = 0;

    const wrapper = mount(ConnectDappView, {
      global: globalConfig
    });

    await flushPromises();

    expect(wrapper.text()).toContain('https://test-dapp.com');
    expect(wrapper.text()).toContain('Account 1');
    expect(wrapper.text()).toContain('Paddress123');
  });

  it('should save permission and send response on approve', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: 'Paddress123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    
    // Prevent checkSession from resetting isUnlocked
    vi.spyOn(store, 'checkSession').mockResolvedValue(true);

    const wrapper = mount(ConnectDappView, {
      global: globalConfig
    });

    await flushPromises();

    // Find and click the Connect button
    const approveBtn = wrapper.find('#approve-connect-button');
    await approveBtn.trigger('click');
    await flushPromises();

    // 1. Verify storage call
    expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        peppool_permissions: expect.objectContaining({
          'https://test-dapp.com': ['connect']
        })
      })
    );

    // 2. Verify message to background
    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      result: ['Paddress123']
    });

    // 3. Verify window closed
    expect(window.close).toHaveBeenCalled();
  });

  it('should send rejection and close on cancel', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;

    const wrapper = mount(ConnectDappView, {
      global: globalConfig
    });

    await flushPromises();

    const rejectBtn = wrapper.find('#reject-connect-button');
    await rejectBtn.trigger('click');
    await flushPromises();

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      error: 'User rejected the connection request'
    });

    expect(window.close).toHaveBeenCalled();
  });

  it('should show login prompt if wallet is locked', async () => {
    const store = useWalletStore();
    store.isUnlocked = false;

    const wrapper = mount(ConnectDappView, {
      global: globalConfig
    });

    await flushPromises();

    expect(wrapper.text()).toContain('Wallet Locked');
    expect(wrapper.text()).toContain('Go to Login');
  });
});
