import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchAddressInfo,
  fetchPepPrice,
  validateAddress,
  fetchTransactions,
  fetchRecommendedFees,
  broadcastTx
} from './api';
import { RIBBITS_PER_PEP } from './constants';

describe('API Utils', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  const mockResponse = (data: any, ok = true) => ({
    ok,
    json: () => Promise.resolve(data),
    headers: {
      get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null)
    }
  });

  it('should fetch and calculate balance correctly from Esplora structure', async () => {
    const data = {
      address: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh',
      chain_stats: {
        funded_txo_sum: RIBBITS_PER_PEP,
        spent_txo_sum: RIBBITS_PER_PEP * 0.2
      },
      mempool_stats: {
        funded_txo_sum: RIBBITS_PER_PEP * 0.5,
        spent_txo_sum: 0
      }
    };

    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse(data));

    const balanceRibbits = await fetchAddressInfo('PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');
    expect(balanceRibbits).toBe(RIBBITS_PER_PEP * 1.3);
  });

  it('should fetch PEP prices correctly', async () => {
    const mockPrices = { USD: 0.0002, EUR: 0.00018 };
    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse(mockPrices));

    const prices = await fetchPepPrice();
    expect(prices.USD).toBe(0.0002);
  });

  it('should fetch recommended fees correctly', async () => {
    const mockFees = {
      fastestFee: 1,
      halfHourFee: 1,
      hourFee: 1,
      economyFee: 1,
      minimumFee: 1
    };
    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse(mockFees));

    const fees = await fetchRecommendedFees();
    expect(fees.fastestFee).toBe(1);
  });

  it('should validate an address correctly', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse({ isvalid: true }));

    const result = await validateAddress('PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');
    expect(result.isvalid).toBe(true);
  });

  it('should fetch transactions correctly', async () => {
    const mockTxs = [
      {
        txid: 'abc123',
        version: 1,
        locktime: 0,
        vin: [{ txid: 'prev', vout: 0, prevout: { scriptpubkey_address: 'addr', value: 100 } }],
        vout: [{ scriptpubkey_address: 'addr2', value: 50 }],
        size: 226,
        weight: 904,
        fee: 1000,
        status: { confirmed: true, block_height: 1, block_time: 1700000000 }
      }
    ];
    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse(mockTxs));

    const txs = await fetchTransactions('PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');
    expect(txs).toHaveLength(1);
    expect(txs[0]!.txid).toBe('abc123');
  });

  it('should broadcast a transaction and return the raw txid string', async () => {
    const mockTxid = 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3';
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockTxid),
      headers: { get: () => 'text/plain' }
    });

    const result = await broadcastTx('deadbeef');
    expect(result).toBe(mockTxid);
  });

  it('should throw an error when API call fails', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 404,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ message: 'Not Found' })
    });

    await expect(fetchAddressInfo('invalid')).rejects.toThrow('Service not available (404).');
  });
});
