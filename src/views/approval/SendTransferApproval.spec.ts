import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useWalletStore } from '@/stores/wallet';
import SendTransferApproval from './SendTransferApproval.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';

const mockSearch = '?id=req123&origin=https://test-dapp.com&method=sendTransfer';
Object.defineProperty(window, 'location', {
  value: { search: mockSearch, origin: 'https://test-dapp.com', pathname: '/approval.html' },
  writable: true
});

window.close = vi.fn();

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

vi.mock('@/utils/crypto', () => ({
  createSignedTx: vi.fn().mockResolvedValue('signed-hex'),
  deriveSigner: vi.fn().mockReturnValue({ publicKey: Buffer.alloc(33), sign: vi.fn() }),
  parseDerivationPath: vi.fn().mockReturnValue({ accountIndex: 0, addressIndex: 0 }),
  isValidAddress: vi.fn().mockReturnValue(true),
  estimateTxSize: vi
    .fn()
    .mockImplementation((inputs: number, outputs: number) => 148 * inputs + 34 * outputs + 10)
}));

describe('SendTransferApproval', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();

    const store = useWalletStore();
    vi.spyOn(store, 'checkSession').mockResolvedValue(true);

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
    components: { PepButton, PepMainLayout, PepPageHeader, PepPasswordInput }
  };

  it('displays transaction details', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;

    const wrapper = mount(SendTransferApproval, { global: globalConfig });
    await flushPromises();

    expect(wrapper.text()).toContain('https://test-dapp.com');
    expect(wrapper.text()).toContain('0.5 PEP');
    expect(wrapper.text()).toContain('Precipient');
  });

  it('signs and broadcasts on approve', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: 'Psender', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'isMnemonicLoaded', 'get').mockReturnValue(true);
    vi.spyOn(store, 'withMnemonic').mockImplementation((fn: any) =>
      fn('suffer dish east miss seat great brother hello motion mountain celery plunge')
    );
    vi.spyOn(store, 'refreshBalance').mockResolvedValue(undefined as any);

    const wrapper = mount(SendTransferApproval, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    const api = await import('@/utils/api');
    expect(api.broadcastTx).toHaveBeenCalledWith('signed-hex');

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      target: 'peppool-background-response',
      requestId: 'req123',
      result: { txid: 'mock-txid' }
    });

    expect(window.close).toHaveBeenCalled();
  });

  it('sends rejection and closes on cancel', async () => {
    const store = useWalletStore();
    store.isUnlocked = true;

    const wrapper = mount(SendTransferApproval, { global: globalConfig });
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

  it('enforces fee floor via SendTransaction model even when API returns low fee', async () => {
    const api = await import('@/utils/api');
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
    vi.spyOn(store, 'refreshBalance').mockResolvedValue(undefined as any);

    const wrapper = mount(SendTransferApproval, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    const crypto = await import('@/utils/crypto');
    const feeArg = vi.mocked(crypto.createSignedTx).mock.calls[0][4];
    expect(feeArg).toBeGreaterThanOrEqual(226000);
  });

  it('excludes inscription UTXOs from coin selection', async () => {
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
    vi.spyOn(store, 'refreshBalance').mockResolvedValue(undefined as any);

    const wrapper = mount(SendTransferApproval, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    expect(api.fetchTxHex).toHaveBeenCalledWith('safe1');
    expect(api.fetchTxHex).not.toHaveBeenCalledWith('inscribed1');
  });

  it('rejects when balance is insufficient', async () => {
    const api = await import('@/utils/api');
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

    const wrapper = mount(SendTransferApproval, { global: globalConfig });
    await flushPromises();

    await wrapper.find('#approve-transaction-button').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Insufficient confirmed balance');
    expect(api.broadcastTx).not.toHaveBeenCalled();
  });

  it('shows invalid request screen for bad recipient address', async () => {
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

    const wrapper = mount(SendTransferApproval, { global: globalConfig });
    await flushPromises();

    expect(wrapper.text()).toContain('Invalid Request');
    expect(wrapper.text()).toContain('Invalid Pepecoin address.');
    expect(wrapper.find('#approve-transaction-button').exists()).toBe(false);
  });
});
