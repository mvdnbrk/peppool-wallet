import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSendTransaction } from './useSendTransaction';
import { flushPromises } from '@vue/test-utils';
import { useApp } from '@/composables/useApp';
import * as api from '@/utils/api';
import * as crypto from '@/utils/crypto';
import { RIBBITS_PER_PEP } from '@/utils/constants';

// Mock dependencies
vi.mock('@/composables/useApp');
vi.mock('@/utils/api');
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      address: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh',
      selectedCurrency: 'USD',
      currencySymbol: '$',
      prices: { USD: 10, EUR: 8 },
      refreshBalance: vi.fn(),
      plaintextMnemonic: 'test mnemonic',
      cacheMnemonic: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      wallet: mockWallet
    } as any);
  });

  it('should load requirements and filter confirmed UTXOs', async () => {
    const mixedUtxos = [
      { txid: 'c1', vout: 0, value: 500_000_000, status: { confirmed: true } },
      { txid: 'u1', vout: 0, value: 200_000_000, status: { confirmed: false } }
    ];
    vi.mocked(api.fetchRecommendedFees).mockResolvedValue({ fastestFee: 1000 } as any);
    vi.mocked(api.fetchUtxos).mockResolvedValue(mixedUtxos as any);

    const { tx, loadRequirements, isLoadingRequirements } = useSendTransaction();

    expect(isLoadingRequirements.value).toBe(true);
    await loadRequirements();
    expect(isLoadingRequirements.value).toBe(false);

    expect(tx.value.utxos).toHaveLength(1);
    expect(tx.value.utxos[0].txid).toBe('c1');
    expect(tx.value.fees?.fastestFee).toBe(1000);
  });

  it('should calculate display balance correctly', async () => {
    const { tx, displayBalance } = useSendTransaction();
    tx.value.utxos = [
      { txid: 'c1', vout: 0, value: 500_000_000, status: { confirmed: true } }
    ] as any;

    expect(displayBalance(false)).toBe('5 PEP');
    expect(displayBalance(true)).toBe('$50.00 USD');
  });

  it('should validate step 1 inputs', async () => {
    const { validateStep1, tx } = useSendTransaction();
    tx.value.utxos = [
      { txid: 'c1', vout: 0, value: 10_000_000_000, status: { confirmed: true } }
    ] as any;
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
    const { tx, send } = useSendTransaction();
    tx.value.utxos = [
      { txid: 'c1', vout: 0, value: 1000_000_000, status: { confirmed: true } }
    ] as any;
    tx.value.recipient = 'recipient';
    tx.value.amountRibbits = 500_000_000;

    vi.mocked(api.fetchTxHex).mockResolvedValue('raw-hex');
    vi.mocked(crypto.deriveSigner).mockReturnValue({} as any);
    vi.mocked(crypto.createSignedTx).mockResolvedValue('signed-hex');
    vi.mocked(api.broadcastTx).mockResolvedValue('new-txid');

    const result = await send('password', false);

    expect(result).toBe('new-txid');
    expect(api.broadcastTx).toHaveBeenCalledWith('signed-hex');
    expect(mockWallet.refreshBalance).toHaveBeenCalledWith(true);
  });
});
