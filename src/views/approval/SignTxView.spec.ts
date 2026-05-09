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
  fetchUtxos: vi
    .fn()
    .mockResolvedValue([{ txid: 'tx1', vout: 0, value: 100000000, status: { confirmed: true } }]),
  fetchTxHex: vi.fn().mockResolvedValue('0100000001...'),
  fetchRecommendedFees: vi.fn().mockResolvedValue({ fastestFee: 10 }),
  broadcastTx: vi.fn().mockResolvedValue('mock-txid'),
  fetchInscriptionOutputs: vi.fn().mockResolvedValue([]),
  isInscriptionUtxo: vi.fn().mockReturnValue(false)
}));

// Mock crypto utils
vi.mock('@/utils/crypto', () => ({
  createSignedTx: vi.fn().mockResolvedValue('signed-hex'),
  deriveSigner: vi.fn().mockReturnValue({ publicKey: Buffer.alloc(33), sign: vi.fn() }),
  parseDerivationPath: vi.fn().mockReturnValue({ accountIndex: 0, addressIndex: 0 }),
  isValidAddress: vi.fn().mockReturnValue(true),
  estimateTxSize: vi
    .fn()
    .mockImplementation((inputs: number, outputs: number) => 148 * inputs + 34 * outputs + 10)
}));

// Mock bitcoinjs-lib for signPsbt tests
// vi.mock is hoisted — cannot reference local variables, so use vi.hoisted
const { mockSignInput, mockFinalizeAllInputs, mockExtractTransaction, mockPsbt } = vi.hoisted(
  () => {
    const mockSignInput = vi.fn();
    const mockFinalizeAllInputs = vi.fn();
    const mockExtractTransaction = vi.fn().mockReturnValue({ toHex: () => 'finalized-tx-hex' });
    const mockPsbt = {
      inputCount: 2,
      signInput: mockSignInput,
      finalizeAllInputs: mockFinalizeAllInputs,
      extractTransaction: mockExtractTransaction,
      toBase64: vi.fn().mockReturnValue('signed-psbt-base64')
    };
    return { mockSignInput, mockFinalizeAllInputs, mockExtractTransaction, mockPsbt };
  }
);
vi.mock('bitcoinjs-lib', () => ({
  Psbt: {
    fromBase64: vi.fn().mockReturnValue(mockPsbt)
  }
}));

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
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
    vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) =>
      fn('suffer dish east miss seat great brother hello motion mountain celery plunge')
    );

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

  it('enforces fee floor via SendTransaction model even when API returns low fee', async () => {
    const api = await import('@/utils/api');
    // API returns fee below the 1000 ribbits/byte floor
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({
      fastestFee: 100,
      halfHourFee: 50,
      hourFee: 25,
      economyFee: 10,
      minimumFee: 5
    });

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: 'Psender', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
    vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) =>
      fn('suffer dish east miss seat great brother hello motion mountain celery plunge')
    );

    const wrapper = mount(SignTxView, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    const crypto = await import('@/utils/crypto');
    // Fee should use floor of 1000, not the API's 100
    // With 1 input, 2 outputs: size = 148 + 68 + 10 = 226, fee = ceil(226 * 1000) = 226000
    const feeArg = vi.mocked(crypto.createSignedTx).mock.calls[0][4];
    expect(feeArg).toBeGreaterThanOrEqual(226000);
  });

  it('excludes inscription UTXOs from dApp sendTransfer coin selection', async () => {
    const api = await import('@/utils/api');
    vi.mocked(api.fetchUtxos).mockResolvedValue([
      { txid: 'safe1', vout: 0, value: 100_000_000, status: { confirmed: true } },
      { txid: 'inscribed1', vout: 2, value: 100_000, status: { confirmed: true } }
    ]);
    vi.mocked(api.fetchInscriptionOutputs).mockResolvedValue(['inscribed1:2']);
    vi.mocked(api.isInscriptionUtxo).mockImplementation((utxo: any, set: Set<string>) =>
      set.has(`${utxo.txid}:${utxo.vout}`)
    );

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: 'Psender', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
    vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) =>
      fn('suffer dish east miss seat great brother hello motion mountain celery plunge')
    );

    const wrapper = mount(SignTxView, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    // The inscribed UTXO (inscribed1:2) should not have been fetched for signing
    expect(api.fetchTxHex).toHaveBeenCalledWith('safe1');
    expect(api.fetchTxHex).not.toHaveBeenCalledWith('inscribed1');
  });

  it('rejects sendTransfer when balance is insufficient', async () => {
    const api = await import('@/utils/api');
    // UTXO only has 1000 ribbits — not enough for 50M ribbits transfer
    vi.mocked(api.fetchUtxos).mockResolvedValue([
      { txid: 'tx1', vout: 0, value: 1000, status: { confirmed: true } }
    ]);

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: 'Psender', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
    vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) =>
      fn('suffer dish east miss seat great brother hello motion mountain celery plunge')
    );

    const wrapper = mount(SignTxView, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Insufficient confirmed balance');
    expect(api.broadcastTx).not.toHaveBeenCalled();
  });

  it('signPsbt only signs inputs belonging to the signer', async () => {
    // Configure for signPsbt method
    (window as any).location.search = '?id=req123&origin=https://test-dapp.com&method=signPsbt';

    (global.chrome.storage.local.get as any).mockImplementation((key: string) => {
      if (key === 'request_req123') {
        return Promise.resolve({
          request_req123: {
            requestId: 'req123',
            method: 'signPsbt',
            params: { psbt: 'base64-psbt-data' },
            origin: 'https://test-dapp.com'
          }
        });
      }
      return Promise.resolve({});
    });

    // Input 0 succeeds, input 1 throws (not owned)
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

    const wrapper = mount(SignTxView, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      result: { psbt: 'signed-psbt-base64' }
    });
    expect(mockFinalizeAllInputs).not.toHaveBeenCalled();
    const apiNoBroadcast = await import('@/utils/api');
    expect(apiNoBroadcast.broadcastTx).not.toHaveBeenCalled();

    // Restore for other tests
    (window as any).location.search = '?id=req123&origin=https://test-dapp.com&method=sendTransfer';
  });

  it('signPsbt finalizes and broadcasts when broadcast flag is true', async () => {
    (window as any).location.search = '?id=req123&origin=https://test-dapp.com&method=signPsbt';

    (global.chrome.storage.local.get as any).mockImplementation((key: string) => {
      if (key === 'request_req123') {
        return Promise.resolve({
          request_req123: {
            requestId: 'req123',
            method: 'signPsbt',
            params: { psbt: 'base64-psbt-data', broadcast: true },
            origin: 'https://test-dapp.com'
          }
        });
      }
      return Promise.resolve({});
    });

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

    const wrapper = mount(SignTxView, { global: globalConfig });
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

    (window as any).location.search = '?id=req123&origin=https://test-dapp.com&method=sendTransfer';
  });

  it('signPsbt rejects when no inputs belong to the signer', async () => {
    (window as any).location.search = '?id=req123&origin=https://test-dapp.com&method=signPsbt';

    (global.chrome.storage.local.get as any).mockImplementation((key: string) => {
      if (key === 'request_req123') {
        return Promise.resolve({
          request_req123: {
            requestId: 'req123',
            method: 'signPsbt',
            params: { psbt: 'base64-psbt-data' },
            origin: 'https://test-dapp.com'
          }
        });
      }
      return Promise.resolve({});
    });

    // All inputs throw
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

    const wrapper = mount(SignTxView, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('No inputs in this PSBT belong to your wallet');

    // Restore for other tests
    (window as any).location.search = '?id=req123&origin=https://test-dapp.com&method=sendTransfer';
  });

  it('should show invalid request screen for bad recipient address', async () => {
    const crypto = await import('@/utils/crypto');
    vi.mocked(crypto.isValidAddress).mockReturnValue(false);

    (global.chrome.storage.local.get as any).mockImplementation((key: string) => {
      if (key === 'request_req123') {
        return Promise.resolve({
          request_req123: {
            requestId: 'req123',
            method: 'sendTransfer',
            params: { recipient: 'not-a-real-address', amount: 50000000 },
            origin: 'https://test-dapp.com'
          }
        });
      }
      return Promise.resolve({});
    });

    const store = useWalletStore();
    store.isUnlocked = true;

    const wrapper = mount(SignTxView, { global: globalConfig });
    await flushPromises();

    expect(wrapper.text()).toContain('Invalid Request');
    expect(wrapper.text()).toContain('Invalid Pepecoin address.');
    expect(wrapper.find('#approve-transaction-button').exists()).toBe(false);
  });
});
