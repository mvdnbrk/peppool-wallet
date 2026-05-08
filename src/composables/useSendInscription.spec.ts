import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSendInscription, parseSatpoint, selectFeeUtxos } from './useSendInscription';
import { useApp } from '@/composables/useApp';
import * as api from '@/utils/api';
import * as crypto from '@/utils/crypto';
import type { Inscription } from '@/models/Inscription';

const { mockGetOutputsSet } = vi.hoisted(() => ({
  mockGetOutputsSet: vi.fn(() => Promise.resolve(new Set<string>()))
}));

vi.mock('@/composables/useApp');
vi.mock('@/stores/inscriptions', () => ({
  useInscriptionStore: vi.fn(() => ({ getOutputsSet: mockGetOutputsSet }))
}));
vi.mock('@/utils/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/api')>();
  return {
    ...actual,
    fetchRecommendedFees: vi.fn(),
    fetchUtxos: vi.fn(),
    fetchTxHex: vi.fn(),
    validateAddress: vi.fn(),
    broadcastTx: vi.fn()
  };
});
vi.mock('@/utils/crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/crypto')>();
  return {
    ...actual,
    deriveSigner: vi.fn(),
    createSignedInscriptionTx: vi.fn(),
    isValidAddress: vi.fn()
  };
});

const SENDER = 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU';
const RECIPIENT = 'PrEcEpienTaDdReSsXxXxXxXxXxXxXxXxX';

function makeInscription(satpoint: string): Inscription {
  return {
    id: 'insc1',
    number: 0,
    contentType: 'image/png',
    contentLength: 100,
    height: 1,
    value: 10000,
    parents: [],
    properties: null,
    satpoint,
    timestamp: 0
  };
}

describe('parseSatpoint', () => {
  it('extracts txid and vout from satpoint', () => {
    expect(parseSatpoint('abc:3:0')).toEqual({ txid: 'abc', vout: 3 });
  });

  it('throws on malformed satpoint', () => {
    expect(() => parseSatpoint('garbage')).toThrow('Invalid satpoint');
  });
});

describe('selectFeeUtxos', () => {
  const rawHex = 'deadbeef';

  it('selects one UTXO when it covers the fee plus the soft-dust surcharge', () => {
    const utxos = [{ txid: 't1', vout: 0, value: 10_000_000, rawHex }];
    const { feeUtxos, feeRibbits } = selectFeeUtxos(utxos, 1000);
    expect(feeUtxos).toHaveLength(1);
    // Size-based fee for (2 inputs, 2 outputs) at 1000 ribbits/byte = 374,000.
    // Plus 4,000,000 ribbits soft-dust surcharge for the postage output.
    expect(feeRibbits).toBe(4_374_000);
  });

  it('accumulates UTXOs when the first does not cover the fee', () => {
    const utxos = [
      { txid: 't1', vout: 0, value: 100_000, rawHex },
      { txid: 't2', vout: 0, value: 200_000, rawHex },
      { txid: 't3', vout: 0, value: 10_000_000, rawHex }
    ];
    const { feeUtxos } = selectFeeUtxos(utxos, 1000);
    expect(feeUtxos.length).toBeGreaterThan(1);
  });

  it('includes the soft-dust surcharge in the calculated fee', () => {
    const utxos = [{ txid: 't1', vout: 0, value: 10_000_000, rawHex }];
    const { feeRibbits } = selectFeeUtxos(utxos, 1000);
    expect(feeRibbits).toBeGreaterThanOrEqual(4_000_000);
  });

  it('throws when total spendable cannot cover any fee', () => {
    const utxos = [{ txid: 't1', vout: 0, value: 1, rawHex }];
    expect(() => selectFeeUtxos(utxos, 1000)).toThrow('Insufficient balance');
  });
});

describe('useSendInscription', () => {
  let mockWallet: any;
  let mockAccount: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAccount = { spendableBalanceRibbits: 1_000_000_000 };
    mockWallet = {
      address: SENDER,
      refreshBalance: vi.fn(),
      isMnemonicLoaded: true,
      withMnemonic: vi.fn((fn: any) => Promise.resolve(fn('test mnemonic'))),
      activeAccount: { address: SENDER, path: "m/44'/3434'/0'/0/0", label: 'Account 1' }
    };
    vi.mocked(useApp).mockReturnValue({
      wallet: mockWallet,
      account: mockAccount,
      settings: { settings: { explorer: 'peppool' } }
    } as any);
  });

  it('loads recommended fees', async () => {
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1500 } as any);
    const { loadFees, fees, isLoadingFees } = useSendInscription();
    expect(isLoadingFees.value).toBe(true);
    await loadFees();
    expect(isLoadingFees.value).toBe(false);
    expect(fees.value?.fastestFee).toBe(1500);
  });

  it('rejects sending to own address', async () => {
    vi.mocked(crypto.isValidAddress).mockReturnValue(true);
    const { validateRecipient } = useSendInscription();
    await expect(validateRecipient(SENDER)).rejects.toThrow('Cannot send to your own address');
  });

  it('rejects empty / invalid addresses', async () => {
    const { validateRecipient } = useSendInscription();
    await expect(validateRecipient('')).rejects.toThrow('enter a recipient address');

    vi.mocked(crypto.isValidAddress).mockReturnValue(false);
    await expect(validateRecipient('garbage')).rejects.toThrow('Invalid address format');
  });

  it('builds and broadcasts an inscription transfer with fresh UTXOs', async () => {
    const utxos = [
      { txid: 'inscriptionTx', vout: 0, value: 10000, status: { confirmed: true } },
      { txid: 'fee1', vout: 0, value: 500_000_000, status: { confirmed: true } }
    ];
    vi.mocked(api.fetchUtxos).mockResolvedValue(utxos as any);
    mockGetOutputsSet.mockResolvedValue(new Set(['inscriptionTx:0']));
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1000 } as any);
    vi.mocked(api.fetchTxHex).mockResolvedValue('rawhex');
    vi.mocked(crypto.deriveSigner).mockReturnValue({} as any);
    vi.mocked(crypto.createSignedInscriptionTx).mockResolvedValue('signed-hex');
    vi.mocked(api.broadcastTx).mockResolvedValue('broadcast-txid');

    const { send, loadFees } = useSendInscription();
    await loadFees();

    const inscription = makeInscription('inscriptionTx:0:0');
    const txid = await send(inscription, RECIPIENT, 'password');

    expect(txid).toBe('broadcast-txid');
    // Ensure inscription UTXO went in as input 0 and fee UTXOs followed
    const call = vi.mocked(crypto.createSignedInscriptionTx).mock.calls[0];
    const [, recipientArg, inscriptionUtxoArg, feeUtxosArg] = call;
    expect(recipientArg).toBe(RECIPIENT);
    expect(inscriptionUtxoArg.txid).toBe('inscriptionTx');
    expect(inscriptionUtxoArg.vout).toBe(0);
    expect(inscriptionUtxoArg.value).toBe(10000);
    expect(feeUtxosArg.map((u: any) => u.txid)).toEqual(['fee1']);
    expect(mockWallet.refreshBalance).toHaveBeenCalledWith(true);
  });

  it('throws when the inscription UTXO is no longer present on chain', async () => {
    vi.mocked(api.fetchUtxos).mockResolvedValue([
      { txid: 'fee1', vout: 0, value: 500_000_000, status: { confirmed: true } }
    ] as any);
    mockGetOutputsSet.mockResolvedValue(new Set());
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1000 } as any);

    const { send, loadFees } = useSendInscription();
    await loadFees();

    const inscription = makeInscription('missingTx:0:0');
    await expect(send(inscription, RECIPIENT, 'password')).rejects.toThrow(
      'Inscription UTXO not found'
    );
  });

  it('uses the active account derivation indices when signing', async () => {
    mockWallet.activeAccount = {
      address: SENDER,
      path: "m/44'/3434'/4'/0/2",
      label: 'Account 5'
    };
    vi.mocked(api.fetchUtxos).mockResolvedValue([
      { txid: 'inscriptionTx', vout: 0, value: 10000, status: { confirmed: true } },
      { txid: 'fee1', vout: 0, value: 500_000_000, status: { confirmed: true } }
    ] as any);
    mockGetOutputsSet.mockResolvedValue(new Set(['inscriptionTx:0']));
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1000 } as any);
    vi.mocked(api.fetchTxHex).mockResolvedValue('rawhex');
    vi.mocked(crypto.deriveSigner).mockReturnValue({} as any);
    vi.mocked(crypto.createSignedInscriptionTx).mockResolvedValue('signed-hex');
    vi.mocked(api.broadcastTx).mockResolvedValue('broadcast-txid');

    const { send, loadFees } = useSendInscription();
    await loadFees();

    await send(makeInscription('inscriptionTx:0:0'), RECIPIENT, 'password');
    expect(crypto.deriveSigner).toHaveBeenCalledWith('test mnemonic', 4, 2);
  });

  it('requires a password when the mnemonic is not loaded in session', async () => {
    mockWallet.isMnemonicLoaded = false;
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1000 } as any);

    const { send, loadFees } = useSendInscription();
    await loadFees();

    await expect(send(makeInscription('a:0:0'), RECIPIENT, '')).rejects.toThrow(
      'Password required'
    );
  });
});
