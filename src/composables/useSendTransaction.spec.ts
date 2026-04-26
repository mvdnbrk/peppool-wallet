import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSendTransaction } from './useSendTransaction';
import { flushPromises } from '@vue/test-utils';
import { useApp } from '@/composables/useApp';
import * as api from '@/utils/api';
import * as crypto from '@/utils/crypto';
import { RIBBITS_PER_PEP } from '@/utils/constants';

const { mockGetOutputsSet } = vi.hoisted(() => {
  const mockGetOutputsSet = vi.fn(() => Promise.resolve(new Set<string>()));
  return { mockGetOutputsSet };
});

// Mock dependencies
vi.mock('@/composables/useApp');
vi.mock('@/stores/inscriptions', () => ({
  useInscriptionStore: vi.fn(() => ({
    getOutputsSet: mockGetOutputsSet
  }))
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
    createSignedTx: vi.fn(),
    isValidAddress: vi.fn()
  };
});

describe('useSendTransaction Composable', () => {
  let mockWallet: any;
  let mockAccount: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAccount = {
      spendableBalanceRibbits: 500_000_000
    };
    mockWallet = {
      address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
      refreshBalance: vi.fn(),
      isMnemonicLoaded: true,
      withMnemonic: vi.fn((fn: any) => Promise.resolve(fn('test mnemonic')))
    };
    vi.mocked(useApp).mockReturnValue({
      wallet: mockWallet,
      account: mockAccount,
      settings: {
        settings: { currency: 'USD', explorer: 'peppool', lockDuration: 15 }
      }
    } as any);
  });

  it('should load fees without fetching UTXOs', async () => {
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1000 } as any);

    const { tx, loadFees, isLoadingFees } = useSendTransaction();

    expect(isLoadingFees.value).toBe(true);
    await loadFees();
    expect(isLoadingFees.value).toBe(false);

    expect(tx.value.fees?.fastestFee).toBe(1000);
    expect(api.fetchUtxos).not.toHaveBeenCalled();
  });

  it('should check insufficient funds against spendable balance', async () => {
    mockAccount.spendableBalanceRibbits = 100_000;
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1000 } as any);

    const { isInsufficientFunds, tx, isLoadingFees, loadFees } = useSendTransaction();
    await loadFees();

    tx.value.amountRibbits = 200_000; // More than balance
    expect(isInsufficientFunds.value).toBe(true);
  });

  it('should fetch UTXOs and filter inscriptions at send time', async () => {
    const utxos = [
      { txid: 'safe1', vout: 0, value: 300_000_000, status: { confirmed: true } },
      { txid: 'inscribed1', vout: 1, value: 100_000, status: { confirmed: true } },
      { txid: 'safe2', vout: 0, value: 200_000_000, status: { confirmed: true } }
    ];
    vi.mocked(api.fetchUtxos).mockResolvedValue(utxos as any);
    mockGetOutputsSet.mockResolvedValue(new Set(['inscribed1:1']));
    vi.mocked(api.fetchTxHex).mockResolvedValue('raw-hex');
    vi.mocked(crypto.deriveSigner).mockReturnValue({} as any);
    vi.mocked(crypto.createSignedTx).mockResolvedValue('signed-hex');
    vi.mocked(api.broadcastTx).mockResolvedValue('new-txid');

    const { tx, send } = useSendTransaction();
    tx.value.fees = { fastestFee: 1000 } as any;
    tx.value.recipient = 'recipient';
    tx.value.amountRibbits = 100_000_000;

    await send('password', false);

    // UTXOs should have been fetched and filtered
    expect(api.fetchUtxos).toHaveBeenCalledWith('PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU');
    expect(tx.value.utxos).toHaveLength(2);
    expect(tx.value.utxos.map((u: any) => u.txid)).toEqual(['safe1', 'safe2']);
  });

  it('should send when no inscriptions exist', async () => {
    const utxos = [{ txid: 'c1', vout: 0, value: 500_000_000, status: { confirmed: true } }];
    vi.mocked(api.fetchUtxos).mockResolvedValue(utxos as any);
    mockGetOutputsSet.mockResolvedValue(new Set());
    vi.mocked(api.fetchTxHex).mockResolvedValue('raw-hex');
    vi.mocked(crypto.deriveSigner).mockReturnValue({} as any);
    vi.mocked(crypto.createSignedTx).mockResolvedValue('signed-hex');
    vi.mocked(api.broadcastTx).mockResolvedValue('new-txid');

    const { tx, send } = useSendTransaction();
    tx.value.fees = { fastestFee: 1000 } as any;
    tx.value.recipient = 'recipient';
    tx.value.amountRibbits = 100_000_000;

    const result = await send('password', false);
    expect(result).toBe('new-txid');
    expect(tx.value.utxos).toHaveLength(1);
  });

  it('should validate step 1 inputs', async () => {
    mockAccount.spendableBalanceRibbits = 10_000_000_000;
    const { validateStep1, tx } = useSendTransaction();
    tx.value.fees = { fastestFee: 1000 } as any;

    vi.mocked(crypto.isValidAddress).mockReturnValue(true);
    vi.mocked(api.validateAddress).mockResolvedValue({ isvalid: true } as any);

    // Valid case
    tx.value.recipient = 'recipient';
    tx.value.amountRibbits = 500_000_000;
    const result = await validateStep1('recipient', 500_000_000);
    expect(result).toBe(true);

    // Invalid amount
    await expect(validateStep1('recipient', 0)).rejects.toThrow(
      'Please enter a valid address and amount'
    );

    // Own address
    await expect(validateStep1(mockWallet.address, 500_000_000)).rejects.toThrow(
      'Cannot send to your own address'
    );
  });

  it('should send transaction and return txid', async () => {
    const utxos = [{ txid: 'c1', vout: 0, value: 1000_000_000, status: { confirmed: true } }];
    vi.mocked(api.fetchUtxos).mockResolvedValue(utxos as any);
    mockGetOutputsSet.mockResolvedValue(new Set());
    vi.mocked(api.fetchTxHex).mockResolvedValue('raw-hex');
    vi.mocked(crypto.deriveSigner).mockReturnValue({} as any);
    vi.mocked(crypto.createSignedTx).mockResolvedValue('signed-hex');
    vi.mocked(api.broadcastTx).mockResolvedValue('new-txid');

    const { tx, send } = useSendTransaction();
    tx.value.fees = { fastestFee: 1000 } as any;
    tx.value.recipient = 'recipient';
    tx.value.amountRibbits = 500_000_000;

    const result = await send('password', false);

    expect(result).toBe('new-txid');
    expect(api.broadcastTx).toHaveBeenCalledWith('signed-hex');
    expect(mockWallet.refreshBalance).toHaveBeenCalledWith(true);
  });

  it('should handle insufficient funds correctly', async () => {
    mockAccount.spendableBalanceRibbits = 100;
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1000 } as any);

    const { isInsufficientFunds, tx, loadFees } = useSendTransaction();
    await loadFees();

    tx.value.amountRibbits = 1000; // More than balance
    expect(isInsufficientFunds.value).toBe(true);
  });

  it('should handle send failure with error message', async () => {
    vi.mocked(api.fetchUtxos).mockResolvedValue([
      { txid: 'c1', vout: 0, value: 1000_000_000, status: { confirmed: true } }
    ] as any);
    mockGetOutputsSet.mockResolvedValue(new Set());
    vi.mocked(api.fetchTxHex).mockRejectedValue(new Error('Network error'));

    const { send, tx } = useSendTransaction();
    tx.value.fees = { fastestFee: 1000 } as any;
    tx.value.recipient = 'recipient';
    tx.value.amountRibbits = 500_000_000;

    await expect(send('password', false)).rejects.toThrow('Network error');
  });

  it('should throw error if password is missing and mnemonic not loaded', async () => {
    mockWallet.isMnemonicLoaded = false;
    const { send } = useSendTransaction();
    await expect(send('', false)).rejects.toThrow('Password required');
  });

  it('should estimate max amount from wallet balance', async () => {
    mockAccount.spendableBalanceRibbits = 1_000_000_000;
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1000 } as any);

    const { maxRibbits, loadFees } = useSendTransaction();
    await loadFees();

    expect(maxRibbits.value).toBeGreaterThan(0);
    expect(maxRibbits.value).toBeLessThan(10 * RIBBITS_PER_PEP);
  });

  it('should use active account indices when deriving signer', async () => {
    const utxos = [{ txid: 'c1', vout: 0, value: 1000_000_000, status: { confirmed: true } }];
    vi.mocked(api.fetchUtxos).mockResolvedValue(utxos as any);
    mockGetOutputsSet.mockResolvedValue(new Set());
    vi.mocked(api.fetchTxHex).mockResolvedValue('raw-hex');
    vi.mocked(crypto.deriveSigner).mockReturnValue({} as any);
    vi.mocked(crypto.createSignedTx).mockResolvedValue('signed-hex');
    vi.mocked(api.broadcastTx).mockResolvedValue('new-txid');

    const { tx, send } = useSendTransaction();
    mockWallet.activeAccount = {
      address: 'addr2',
      path: "m/44'/3434'/5'/0/3",
      label: 'Account 6'
    };
    tx.value.fees = { fastestFee: 1000 } as any;
    tx.value.recipient = 'recipient';
    tx.value.amountRibbits = 500_000_000;

    await send('password', false);

    expect(crypto.deriveSigner).toHaveBeenCalledWith('test mnemonic', 5, 3);
  });
});
