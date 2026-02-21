import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchAddressInfo,
  fetchPepPrice,
  validateAddress,
  fetchTransactions,
  fetchTransaction,
  fetchUtxos,
  fetchTxHex,
  fetchRecommendedFees,
  fetchTipHeight,
  broadcastTx
} from './api';
import { RIBBITS_PER_PEP } from './constants';

describe('API Utils', () => {
  let errorSpy: any;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockResponse = (data: any, ok = true, status = 200) => ({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data)),
    headers: {
      get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null)
    }
  });

  it('should fetch tip height correctly', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('12345'),
      headers: { get: () => 'text/plain' }
    });

    const height = await fetchTipHeight();
    expect(height).toBe(12345);
  });

  it('should throw error when fetchTipHeight fails', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 500
    });

    await expect(fetchTipHeight()).rejects.toThrow('Tip height fetch failed (500)');
  });

  it('should handle request timeouts/aborts', async () => {
    const error = new Error('Aborted');
    error.name = 'AbortError';
    (vi.mocked(fetch) as any).mockRejectedValue(error);

    await expect(fetchPepPrice()).rejects.toThrow('Aborted');
  });

  it('should handle non-json error responses', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => 'text/plain' },
      text: () => Promise.resolve('Raw error message')
    });

    await expect(fetchPepPrice()).rejects.toThrow('Service unavailable (400)');
  });

  it('should handle json error responses with custom messages', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ message: 'Custom API error' })
    });

    await expect(fetchPepPrice()).rejects.toThrow('Custom API error');
  });

  it('should throw when content-type is not json', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: true,
      headers: { get: () => 'text/html' }
    });

    await expect(fetchPepPrice()).rejects.toThrow('Invalid response from server.');
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

  it('should fetch a single transaction correctly', async () => {
    const mockTx = {
      txid: 'tx123',
      version: 1,
      locktime: 0,
      vin: [],
      vout: [],
      size: 100,
      weight: 400,
      fee: 1000,
      status: { confirmed: true }
    };
    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse(mockTx));

    const tx = await fetchTransaction('tx123');
    expect(tx.txid).toBe('tx123');
  });

  it('should fetch transaction hex correctly', async () => {
    const mockHex = '01000000...';
    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse(mockHex));

    const hex = await fetchTxHex('tx123');
    expect(hex).toBe(mockHex);
  });

  it('should throw error when fetchTxHex fails', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 404
    });

    await expect(fetchTxHex('tx123')).rejects.toThrow('Service not available (404).');
  });

  it('should fetch UTXOs correctly', async () => {
    const mockUtxos = [{ txid: 'tx1', vout: 0, value: 100, status: { confirmed: true } }];
    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse(mockUtxos));

    const utxos = await fetchUtxos('PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');
    expect(utxos).toHaveLength(1);
    expect(utxos[0].txid).toBe('tx1');
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

  it('should fetch transactions with after_txid correctly', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue(mockResponse([]));

    await fetchTransactions('PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh', 'last-txid');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('after_txid=last-txid'),
      expect.anything()
    );
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

  it('should throw error when broadcastTx fails with 404', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 404
    });

    await expect(broadcastTx('deadbeef')).rejects.toThrow('Service not available (404).');
  });

  it('should throw error when broadcastTx fails with other error', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Invalid hex')
    });

    await expect(broadcastTx('deadbeef')).rejects.toThrow('Invalid hex');
  });

  it('should throw generic error when broadcastTx fails without message', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('')
    });

    await expect(broadcastTx('deadbeef')).rejects.toThrow('Broadcast failed (500)');
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

  it('should throw "Too many requests" on 429 error', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 429,
      headers: { get: () => 'application/json' }
    });

    await expect(fetchPepPrice()).rejects.toThrow('Too many requests. Please wait a moment.');
  });

  it('should throw "Method not allowed" on 405 error', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 405,
      headers: { get: () => 'application/json' }
    });

    await expect(fetchPepPrice()).rejects.toThrow(
      'Method not allowed. Please check API endpoint configuration.'
    );
  });

  it('should throw server error on 500+ error', async () => {
    (vi.mocked(fetch) as any).mockResolvedValue({
      ok: false,
      status: 500,
      headers: { get: () => 'application/json' }
    });

    await expect(fetchPepPrice()).rejects.toThrow(
      'Server error at peppool.space. Please try again later.'
    );
  });
});
