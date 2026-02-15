import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAddressInfo, fetchPepPrice, validateAddress, fetchTransactions, fetchRecommendedFees } from './api';
import { RIBBITS_PER_PEP } from './constants';

describe('API Utils', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  const mockResponse = (data: any, ok = true) => ({
    ok,
    json: () => Promise.resolve(data),
    headers: {
      get: (name: string) => name.toLowerCase() === 'content-type' ? 'application/json' : null
    }
  });

  it('should fetch and calculate balance correctly from Esplora structure', async () => {
    const data = {
      address: 'PumNFmkevCTG6RTEc7W2piGTbQHMg2im2M',
      chain_stats: {
        funded_txo_sum: RIBBITS_PER_PEP,
        spent_txo_sum: RIBBITS_PER_PEP * 0.2,
      },
      mempool_stats: {
        funded_txo_sum: RIBBITS_PER_PEP * 0.5,
        spent_txo_sum: 0,
      }
    };

    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse(data));

    const balanceRibbits = await fetchAddressInfo('PumNFmkevCTG6RTEc7W2piGTbQHMg2im2M');
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

    const result = await validateAddress('PumNFmkevCTG6RTEc7W2piGTbQHMg2im2M');
    expect(result.isvalid).toBe(true);
  });

  it('should fetch transactions correctly', async () => {
    const mockTxs = [{ txid: 'tx1' }];
    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse(mockTxs));

    const txs = await fetchTransactions('PumNFmkevCTG6RTEc7W2piGTbQHMg2im2M');
    expect(txs).toHaveLength(1);
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
