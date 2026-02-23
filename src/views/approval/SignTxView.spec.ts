import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useWalletStore } from '@/stores/wallet';
import SignTxView from './SignTxView.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';

// Mock window.location.search
const mockSearch = '?id=req123&origin=https://test-dapp.com&method=sendTransfer';
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

// Mock API utils
vi.mock('@/utils/api', () => ({
  fetchUtxos: vi.fn().mockResolvedValue([
    { txid: 'tx1', vout: 0, value: 100000000, status: { confirmed: true } }
  ]),
  fetchTxHex: vi.fn().mockResolvedValue('0100000001...'),
  fetchRecommendedFees: vi.fn().mockResolvedValue({ fastestFee: 10 }),
  broadcastTx: vi.fn().mockResolvedValue('mock-txid')
}));

// Mock crypto utils
vi.mock('@/utils/crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/crypto')>();
  return {
    ...actual,
    createSignedTx: vi.fn().mockResolvedValue('signed-hex'),
    deriveSigner: vi.fn().mockReturnValue({ publicKey: Buffer.alloc(33), sign: vi.fn() })
  };
});

describe('SignTxView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();

    const store = useWalletStore();
    vi.spyOn(store, 'checkSession').mockResolvedValue(true);
    
    // Mock chrome.storage.local.get for the request data
    (global.chrome.storage.local.get as any).mockImplementation((key: string) => {
      if (key === 'request_req123') {
        return Promise.resolve({
          request_req123: {
            requestId: 'req123',
            method: 'sendTransfer',
            params: { recipient: 'Precipient', amount: 50000000 },
            origin: 'https://test-dapp.com'
          }
        });
      }
      return Promise.resolve({});
    });
  });

  const globalConfig = {
    components: {
      PepButton,
      PepMainLayout,
      PepPageHeader,
      PepPasswordInput
    }
  };

  it('should display transaction details for sendTransfer', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;

    const wrapper = mount(SignTxView, {
      global: globalConfig
    });

    await flushPromises();

    expect(wrapper.text()).toContain('https://test-dapp.com');
    expect(wrapper.text()).toContain('0.5 PEP');
    expect(wrapper.text()).toContain('Precipient');
  });

  it('should sign and broadcast on approve', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: 'Psender', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    store.cacheMnemonic('suffer dish east miss seat great brother hello motion mountain celery plunge');

    const wrapper = mount(SignTxView, {
      global: globalConfig
    });

    await flushPromises();

    const approveBtn = wrapper.find('#approve-transaction-button');
    await approveBtn.trigger('click');
    await flushPromises();

    // Verify broadcast was called
    const api = await import('@/utils/api');
    expect(api.broadcastTx).toHaveBeenCalledWith('signed-hex');

    // Verify message to background
    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      result: { txid: 'mock-txid' }
    });

    expect(window.close).toHaveBeenCalled();
  });

  it('should send rejection and close on cancel', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;

    const wrapper = mount(SignTxView, {
      global: globalConfig
    });

    await flushPromises();

    const rejectBtn = wrapper.find('#reject-transaction-button');
    await rejectBtn.trigger('click');
    await flushPromises();

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      error: 'User rejected the transaction'
    });

    expect(window.close).toHaveBeenCalled();
  });
});
