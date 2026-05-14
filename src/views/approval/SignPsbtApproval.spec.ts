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
  broadcastTx: vi.fn().mockResolvedValue('mock-txid'),
  fetchTipHeight: vi.fn().mockResolvedValue(0),
  fetchAddressInfo: vi.fn().mockResolvedValue({ balance: 0 }),
  fetchAddressInscriptions: vi.fn().mockResolvedValue({ inscriptions: [], outputs: [], total: 0 }),
  fetchInscription: vi.fn(),
  fetchInscriptionOutputs: vi.fn().mockResolvedValue([])
}));

vi.mock('@/utils/crypto', () => ({
  deriveSigner: vi.fn().mockReturnValue({ publicKey: Buffer.alloc(33), sign: vi.fn() }),
  parseDerivationPath: vi.fn().mockReturnValue({ accountIndex: 0, addressIndex: 0 })
}));

const { mockSignInput, mockFinalizeAllInputs, mockPsbt } = vi.hoisted(() => {
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
});

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
  beforeEach(async () => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    mockSignInput.mockReset();

    const store = useWalletStore();
    vi.spyOn(store, 'checkSession').mockResolvedValue(true);

    mockPsbt.inputCount = 2;
    mockPsbt.data.inputs = [
      { nonWitnessUtxo: Buffer.from('aa', 'hex') },
      { nonWitnessUtxo: Buffer.from('aa', 'hex') }
    ] as any;
    mockPsbt.txInputs = [
      { hash: Buffer.alloc(32), index: 0 },
      { hash: Buffer.alloc(32), index: 0 }
    ] as any;

    // Default: every prevout decodes to the active account 'Psender'.
    const bitcoin = await import('bitcoinjs-lib');
    (bitcoin.Transaction.fromBuffer as any).mockReturnValue({
      outs: [{ script: Buffer.from('mine', 'utf8'), value: 100_000 }]
    });
    (bitcoin.address.fromOutputScript as any).mockReturnValue('Psender');

    makeRequest({ psbt: 'base64-psbt-data', signInputs: { Psender: [0] } });
  });

  const globalConfig = {
    components: { PepButton, PepMainLayout, PepPageHeader, PepPasswordInput }
  };

  it('signs only the inputs listed for the active account and does not broadcast by default', async () => {
    mockSignInput.mockImplementation(() => {});

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

    expect(mockSignInput).toHaveBeenCalledTimes(1);
    expect(mockSignInput).toHaveBeenCalledWith(0, expect.anything(), [0x01]);
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
    makeRequest({
      psbt: 'base64-psbt-data',
      signInputs: { Psender: [0, 1] },
      broadcast: true
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

  it('rejects when signInputs has no entry for the active account', async () => {
    makeRequest({ psbt: 'base64-psbt-data', signInputs: { Pother: [0] } });

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

    expect(mockSignInput).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('This PSBT is not for the active account');
  });

  it('rejects when a signInputs index is out of range', async () => {
    makeRequest({ psbt: 'base64-psbt-data', signInputs: { Psender: [5] } });

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

    expect(mockSignInput).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('out of range');
  });

  it('honors SIGHASH_SINGLE | ANYONECANPAY from PSBT input data', async () => {
    mockPsbt.inputCount = 1;
    mockPsbt.data.inputs = [{ sighashType: 0x83, nonWitnessUtxo: Buffer.from('aa', 'hex') }] as any;
    mockPsbt.txInputs = [{ hash: Buffer.alloc(32), index: 0 }] as any;
    makeRequest({ psbt: 'base64-psbt-data', signInputs: { Psender: [0] } });
    mockSignInput.mockImplementation(() => {});

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

    expect(mockSignInput).toHaveBeenCalledWith(0, expect.anything(), [0x83]);
    expect(mockFinalizeAllInputs).not.toHaveBeenCalled();
  });

  it('rejects unsupported sighash types', async () => {
    mockPsbt.inputCount = 1;
    mockPsbt.data.inputs = [{ sighashType: 0x02, nonWitnessUtxo: Buffer.from('aa', 'hex') }] as any;
    mockPsbt.txInputs = [{ hash: Buffer.alloc(32), index: 0 }] as any;
    makeRequest({ psbt: 'base64-psbt-data', signInputs: { Psender: [0] } });

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

    expect(mockSignInput).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Unsupported sighash');
  });

  it('rejects broadcast when any signed input has non-default sighash', async () => {
    mockPsbt.inputCount = 1;
    mockPsbt.data.inputs = [{ sighashType: 0x83, nonWitnessUtxo: Buffer.from('aa', 'hex') }] as any;
    mockPsbt.txInputs = [{ hash: Buffer.alloc(32), index: 0 }] as any;
    makeRequest({
      psbt: 'base64-psbt-data',
      signInputs: { Psender: [0] },
      broadcast: true
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

    expect(mockSignInput).not.toHaveBeenCalled();
    expect(mockFinalizeAllInputs).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Cannot broadcast');
  });

  it('renders the self-send hero when an inscription input lands on a mine output', async () => {
    const inscriptionTxid = 'a'.repeat(64);
    const inscriptionVout = 0;
    const myAddress = 'Pseller';
    const myAddressKey = `${inscriptionTxid}:${inscriptionVout}`;

    mockPsbt.inputCount = 1;
    mockPsbt.txInputs = [
      // Buffer.from(hash).reverse().toString('hex') must yield inscriptionTxid,
      // so the hash buffer is the byte-reversed txid.
      { hash: Buffer.from(inscriptionTxid, 'hex').reverse(), index: inscriptionVout }
    ] as any;
    mockPsbt.data.inputs = [{ nonWitnessUtxo: Buffer.from('deadbeef', 'hex') }] as any;
    mockPsbt.txOutputs = [{ script: Buffer.from('00', 'hex'), value: 100_000_100_000_000 }] as any;

    const bitcoin = await import('bitcoinjs-lib');
    (bitcoin.Transaction.fromBuffer as any).mockReturnValue({
      outs: [{ script: Buffer.from('seller', 'utf8'), value: 100_000 }]
    });
    (bitcoin.address.fromOutputScript as any).mockReturnValue(myAddress);

    // Seed inscription store cache before mount.
    const { LOCAL_STORAGE_KEYS } = await import('@/constants/storage');
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.INSCRIPTIONS,
      JSON.stringify({
        [myAddress]: {
          inscriptions: {
            ins1: {
              id: 'ins1',
              number: 42,
              contentType: 'image/png',
              contentLength: 100,
              height: 1,
              value: 100_000,
              parents: [],
              properties: null,
              satpoint: `${myAddressKey}:0`,
              timestamp: 0
            }
          },
          outputs: [myAddressKey],
          lastSyncedHeight: 1
        }
      })
    );
    const { useInscriptionStore } = await import('@/stores/inscriptions');
    useInscriptionStore().load(myAddress);

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: myAddress, path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'refreshBalance').mockResolvedValue(undefined as any);

    makeRequest({ psbt: 'base64-psbt-data', signInputs: { [myAddress]: [0] } });

    const wrapper = mount(SignPsbtApproval, { global: globalConfig });
    await flushPromises();

    expect(wrapper.text()).toContain('You will move');
    expect(wrapper.text()).toContain('Inscription 42');
    // Net change footer is hidden for known scenarios (the hero already says it).
    expect(wrapper.text()).not.toContain('Net change');
  });

  it('renders the send-pep hero for a pure-PEP transfer (single recipient + optional change)', async () => {
    const myAddress = 'Psender';

    mockPsbt.inputCount = 1;
    mockPsbt.txInputs = [{ hash: Buffer.alloc(32), index: 0 }] as any;
    mockPsbt.data.inputs = [{ nonWitnessUtxo: Buffer.from('deadbeef', 'hex') }] as any;
    mockPsbt.txOutputs = [
      { script: Buffer.from('to-recipient', 'utf8'), value: 50_000_000 },
      { script: Buffer.from('change', 'utf8'), value: 49_000_000 }
    ] as any;

    const bitcoin = await import('bitcoinjs-lib');
    (bitcoin.Transaction.fromBuffer as any).mockReturnValue({
      outs: [{ script: Buffer.from('mine', 'utf8'), value: 100_000_000 }]
    });
    (bitcoin.address.fromOutputScript as any)
      .mockReturnValueOnce(myAddress) // input prev-out (mine)
      .mockReturnValueOnce('Precipient') // output 0
      .mockReturnValueOnce(myAddress); // output 1 (change)

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: myAddress, path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];

    makeRequest({ psbt: 'base64-psbt-data', signInputs: { [myAddress]: [0] } });

    const wrapper = mount(SignPsbtApproval, { global: globalConfig });
    await flushPromises();

    expect(wrapper.text()).toContain('You will send');
    expect(wrapper.text()).toContain('Precipient');
    // No receive card — change to self should not surface as a receipt.
    expect(wrapper.text()).not.toContain('You will receive');
    // Net change footer hidden when a scenario hero renders.
    expect(wrapper.text()).not.toContain('Net change');
  });

  it('rejects when prevout decodes to a non-mine address', async () => {
    const bitcoin = await import('bitcoinjs-lib');
    (bitcoin.address.fromOutputScript as any).mockReturnValue('Pforeign');

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

    expect(mockSignInput).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('does not belong to the active account');
  });

  it('renders collapsible raw inputs/outputs panels with a net change footer for unknown-shape PSBTs', async () => {
    // Multi-recipient PEP send: 1 mine input → 2 distinct non-mine outputs.
    // This shape does not match any scenario, so the raw view + net change
    // footer are the primary surface.
    const myAddress = 'Psender';

    mockPsbt.inputCount = 1;
    mockPsbt.txInputs = [{ hash: Buffer.alloc(32), index: 0 }] as any;
    mockPsbt.data.inputs = [{ nonWitnessUtxo: Buffer.from('deadbeef', 'hex') }] as any;
    mockPsbt.txOutputs = [
      { script: Buffer.from('to-a', 'utf8'), value: 50_000_000 },
      { script: Buffer.from('to-b', 'utf8'), value: 49_000_000 }
    ] as any;

    const bitcoin = await import('bitcoinjs-lib');
    (bitcoin.Transaction.fromBuffer as any).mockReturnValue({
      outs: [{ script: Buffer.from('mine', 'utf8'), value: 100_000_000 }]
    });
    (bitcoin.address.fromOutputScript as any)
      .mockReturnValueOnce(myAddress)
      .mockReturnValueOnce('PrecipientA')
      .mockReturnValueOnce('PrecipientB');

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: myAddress, path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];

    makeRequest({ psbt: 'base64-psbt-data', signInputs: { [myAddress]: [0] } });

    const wrapper = mount(SignPsbtApproval, { global: globalConfig });
    await flushPromises();

    // Two collapsible panels — one for inputs, one for outputs.
    const detailsBlocks = wrapper.findAll('details');
    expect(detailsBlocks.length).toBe(2);
    expect(detailsBlocks[0]!.text()).toContain('1 input');
    expect(detailsBlocks[1]!.text()).toContain('2 outputs');

    // Net change footer shows the spent total (negative).
    expect(wrapper.text()).toContain('Net change');
  });

  it('renders an inscription badge in the outputs panel when an inscription is predicted to land on a mine output', async () => {
    // Self-send / cancel: 1 mine input carrying an inscription → 1 mine output of the same value.
    const inscriptionTxid = 'b'.repeat(64);
    const inscriptionVout = 0;
    const myAddress = 'Pself';
    const myAddressKey = `${inscriptionTxid}:${inscriptionVout}`;

    mockPsbt.inputCount = 1;
    mockPsbt.txInputs = [
      { hash: Buffer.from(inscriptionTxid, 'hex').reverse(), index: inscriptionVout }
    ] as any;
    mockPsbt.data.inputs = [{ nonWitnessUtxo: Buffer.from('deadbeef', 'hex') }] as any;
    mockPsbt.txOutputs = [{ script: Buffer.from('self', 'utf8'), value: 100_000 }] as any;

    const bitcoin = await import('bitcoinjs-lib');
    (bitcoin.Transaction.fromBuffer as any).mockReturnValue({
      outs: [{ script: Buffer.from('mine', 'utf8'), value: 100_000 }]
    });
    (bitcoin.address.fromOutputScript as any).mockReturnValue(myAddress);

    const { LOCAL_STORAGE_KEYS } = await import('@/constants/storage');
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.INSCRIPTIONS,
      JSON.stringify({
        [myAddress]: {
          inscriptions: {
            ins7: {
              id: 'ins7',
              number: 7,
              contentType: 'image/png',
              contentLength: 100,
              height: 1,
              value: 100_000,
              parents: [],
              properties: null,
              satpoint: `${myAddressKey}:0`,
              timestamp: 0
            }
          },
          outputs: [myAddressKey],
          lastSyncedHeight: 1
        }
      })
    );
    const { useInscriptionStore } = await import('@/stores/inscriptions');
    useInscriptionStore().load(myAddress);

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: myAddress, path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'refreshBalance').mockResolvedValue(undefined as any);

    makeRequest({ psbt: 'base64-psbt-data', signInputs: { [myAddress]: [0] } });

    const wrapper = mount(SignPsbtApproval, { global: globalConfig });
    await flushPromises();

    const outputsPanel = wrapper.findAll('details')[1]!;
    expect(outputsPanel.text()).toContain('Inscription 7');
  });

  it('does not predict an output inscription on a listing PSBT (ANYONECANPAY splices invalidate sat tracking)', async () => {
    const inscriptionTxid = 'c'.repeat(64);
    const inscriptionVout = 0;
    const myAddress = 'Pseller';
    const myAddressKey = `${inscriptionTxid}:${inscriptionVout}`;

    mockPsbt.inputCount = 1;
    mockPsbt.txInputs = [
      { hash: Buffer.from(inscriptionTxid, 'hex').reverse(), index: inscriptionVout }
    ] as any;
    mockPsbt.data.inputs = [
      { sighashType: 0x83, nonWitnessUtxo: Buffer.from('deadbeef', 'hex') }
    ] as any;
    mockPsbt.txOutputs = [{ script: Buffer.from('seller', 'utf8'), value: 10_000_100_000 }] as any;

    const bitcoin = await import('bitcoinjs-lib');
    (bitcoin.Transaction.fromBuffer as any).mockReturnValue({
      outs: [{ script: Buffer.from('mine', 'utf8'), value: 100_000 }]
    });
    (bitcoin.address.fromOutputScript as any).mockReturnValue(myAddress);

    const { LOCAL_STORAGE_KEYS } = await import('@/constants/storage');
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.INSCRIPTIONS,
      JSON.stringify({
        [myAddress]: {
          inscriptions: {
            ins99: {
              id: 'ins99',
              number: 99,
              contentType: 'image/png',
              contentLength: 100,
              height: 1,
              value: 100_000,
              parents: [],
              properties: null,
              satpoint: `${myAddressKey}:0`,
              timestamp: 0
            }
          },
          outputs: [myAddressKey],
          lastSyncedHeight: 1
        }
      })
    );
    const { useInscriptionStore } = await import('@/stores/inscriptions');
    useInscriptionStore().load(myAddress);

    const store = useWalletStore();
    store.isUnlocked = true;
    store.activeAccountIndex = 0;
    store.accounts = [{ address: myAddress, path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
    vi.spyOn(store, 'refreshBalance').mockResolvedValue(undefined as any);

    makeRequest({ psbt: 'base64-psbt-data', signInputs: { [myAddress]: [0] } });

    const wrapper = mount(SignPsbtApproval, { global: globalConfig });
    await flushPromises();

    const panels = wrapper.findAll('details');
    expect(panels[0]!.text()).toContain('Inscription 99');
    expect(panels[1]!.text()).not.toContain('Inscription 99');
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
