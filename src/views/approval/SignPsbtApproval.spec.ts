import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useWalletStore } from '@/stores/wallet';
import SignPsbtApproval from './SignPsbtApproval.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';

const mockSearch = '?id=req123&origin=https://test-dapp.com&method=signPsbt';
Object.defineProperty(window, 'location', {
  value: { search: mockSearch, origin: 'https://test-dapp.com', pathname: '/approval.html' },
  writable: true
});

window.close = vi.fn();

vi.mock('@/utils/api', () => ({
  broadcastTx: vi.fn().mockResolvedValue('mock-txid')
}));

vi.mock('@/utils/crypto', () => ({
  deriveSigner: vi.fn().mockReturnValue({ publicKey: Buffer.alloc(33), sign: vi.fn() }),
  parseDerivationPath: vi.fn().mockReturnValue({ accountIndex: 0, addressIndex: 0 })
}));

const { mockSignInput, mockFinalizeAllInputs, mockExtractTransaction, mockPsbt } = vi.hoisted(
  () => {
    const mockSignInput = vi.fn();
    const mockFinalizeAllInputs = vi.fn();
    const mockExtractTransaction = vi.fn().mockReturnValue({ toHex: () => 'finalized-tx-hex' });
    const mockPsbt = {
      inputCount: 2,
      txInputs: [],
      txOutputs: [],
      data: { inputs: [] },
      signInput: mockSignInput,
      finalizeAllInputs: mockFinalizeAllInputs,
      extractTransaction: mockExtractTransaction,
      toBase64: vi.fn().mockReturnValue('signed-psbt-base64')
    };
    return { mockSignInput, mockFinalizeAllInputs, mockExtractTransaction, mockPsbt };
  }
);

vi.mock('bitcoinjs-lib', () => ({
  Psbt: { fromBase64: vi.fn().mockReturnValue(mockPsbt) },
  Transaction: { fromBuffer: vi.fn() },
  address: { fromOutputScript: vi.fn() }
}));

function makeRequest(params: Record<string, unknown>) {
  (global.chrome.storage.local.get as any).mockImplementation((key: string) => {
    if (key === 'request_req123') {
      return Promise.resolve({
        request_req123: {
          requestId: 'req123',
          method: 'signPsbt',
          params,
          origin: 'https://test-dapp.com'
        }
      });
    }
    return Promise.resolve({});
  });
}

describe('SignPsbtApproval', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    mockSignInput.mockReset();

    const store = useWalletStore();
    vi.spyOn(store, 'checkSession').mockResolvedValue(true);

    makeRequest({ psbt: 'base64-psbt-data' });
  });

  const globalConfig = {
    components: { PepButton, PepMainLayout, PepPageHeader, PepPasswordInput }
  };

  it('only signs inputs that belong to the signer and does not broadcast by default', async () => {
    mockSignInput.mockImplementation((index: number) => {
      if (index === 1) throw new Error('Can not sign for this input');
    });

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: 'Psender', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
    vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) =>
      fn('suffer dish east miss seat great brother hello motion mountain celery plunge')
    );

    const wrapper = mount(SignPsbtApproval, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      result: { psbt: 'signed-psbt-base64' }
    });
    expect(mockFinalizeAllInputs).not.toHaveBeenCalled();
    const api = await import('@/utils/api');
    expect(api.broadcastTx).not.toHaveBeenCalled();
  });

  it('finalizes and broadcasts when broadcast flag is true', async () => {
    makeRequest({ psbt: 'base64-psbt-data', broadcast: true });
    mockSignInput.mockImplementation(() => {});

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: 'Psender', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
    vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) =>
      fn('suffer dish east miss seat great brother hello motion mountain celery plunge')
    );
    vi.spyOn(store, 'refreshBalance').mockResolvedValue(undefined as any);

    const wrapper = mount(SignPsbtApproval, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    expect(mockFinalizeAllInputs).toHaveBeenCalled();
    const api = await import('@/utils/api');
    expect(api.broadcastTx).toHaveBeenCalledWith('finalized-tx-hex');
    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      result: { psbt: 'signed-psbt-base64', txid: 'mock-txid' }
    });
  });

  it('rejects when no inputs belong to the signer', async () => {
    mockSignInput.mockImplementation(() => {
      throw new Error('Can not sign for this input');
    });

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: 'Psender', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
    vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) =>
      fn('suffer dish east miss seat great brother hello motion mountain celery plunge')
    );

    const wrapper = mount(SignPsbtApproval, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('No inputs in this PSBT belong to your wallet');
  });

  it('sends rejection on cancel', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;

    const wrapper = mount(SignPsbtApproval, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#reject-transaction-button').trigger('click');
    await flushPromises();

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      error: 'User rejected the transaction'
    });
    expect(window.close).toHaveBeenCalled();
  });
});
