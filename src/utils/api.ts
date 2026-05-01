import { API_TIMEOUT_MS, APP_NAME, APP_VERSION } from './constants';
import { RawTransactionSchema, type RawTransaction } from '@/models/Transaction';
import {
  RawInscriptionResponseSchema,
  RawAddressInscriptionsResponseSchema,
  toInscription,
  type Inscription,
  type RawAddressInscriptionsResponse
} from '@/models/Inscription';
import { RawAddressInfoSchema } from '@/models/AddressInfo';
import { RecommendedFeesSchema, type RecommendedFees } from '@/models/Fees';
import { UtxoSchema, type Utxo } from '@/models/Utxo';
import { PriceSchema, type Price } from '@/models/Price';
import { getStoredToken, clearAuth } from './auth';
import * as v from 'valibot';

const API_BASE = import.meta.env.VITE_MAINNET_API || 'https://peppool.space/api';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'X-App-Name': APP_NAME,
    'X-App-Version': APP_VERSION
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchTipHeight(): Promise<number> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE}/blocks/tip/height`, {
      signal: controller.signal,
      headers: getHeaders()
    });
    clearTimeout(id);
    if (!response.ok) throw new Error(`Tip height fetch failed (${response.status})`);
    return parseInt(await response.text(), 10);
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        ...getHeaders()
      },
      signal: controller.signal
    });
    clearTimeout(id);
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      if (response.status === 401) {
        clearAuth();
        // Retry once without auth token
        const retry = await fetch(url, {
          ...options,
          headers: { ...options?.headers, ...getHeaders() },
          signal: controller.signal
        });
        if (retry.ok) return await retry.json();
      }
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment.');
      }
      if (response.status === 404) {
        throw new Error('Service not available (404).');
      }
      if (response.status === 405) {
        throw new Error('Method not allowed. Please check API endpoint configuration.');
      }
      if (response.status >= 500) {
        throw new Error('Server error at peppool.space. Please try again later.');
      }

      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      throw new Error(`Service unavailable (${response.status})`);
    }

    if (!contentType || !contentType.includes('application/json')) {
      console.error('Unexpected content-type from API:', contentType);
      throw new Error('Invalid response from server.');
    }

    return await response.json();
  } catch (e: any) {
    console.error('API request failed:', e.message);
    throw e;
  }
}

export async function fetchAddressInfo(address: string): Promise<number> {
  const raw = await request<unknown>(`/address/${encodeURIComponent(address)}`);
  const data = v.parse(RawAddressInfoSchema, raw);
  const confirmedBalance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
  const mempoolBalance = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
  return confirmedBalance + mempoolBalance;
}

export async function hasAddressActivity(address: string): Promise<boolean> {
  const raw = await request<unknown>(`/address/${encodeURIComponent(address)}`);
  const data = v.parse(RawAddressInfoSchema, raw);
  return data.chain_stats.tx_count + data.mempool_stats.tx_count > 0;
}

export async function fetchPepPrice(): Promise<Price> {
  const raw = await request<unknown>('/prices');
  return v.parse(PriceSchema, raw);
}

export async function fetchRecommendedFees(): Promise<RecommendedFees> {
  const raw = await request<unknown>('/fees/recommended');
  return v.parse(RecommendedFeesSchema, raw);
}

export async function validateAddress(address: string): Promise<{ isvalid: boolean }> {
  return await request<{ isvalid: boolean }>(`/validate-address/${encodeURIComponent(address)}`);
}

export async function fetchTransactions(
  address: string,
  afterTxid?: string
): Promise<RawTransaction[]> {
  const query = afterTxid ? `?after_txid=${encodeURIComponent(afterTxid)}` : '';
  const data = await request<unknown[]>(`/address/${encodeURIComponent(address)}/txs${query}`);
  return data.map((tx) => v.parse(RawTransactionSchema, tx));
}

export async function fetchUtxos(address: string): Promise<Utxo[]> {
  const data = await request<unknown[]>(`/address/${encodeURIComponent(address)}/utxo`);
  return data.map((u) => v.parse(UtxoSchema, u));
}

/**
 * Fetches inscription output identifiers for an address from the ord indexer.
 * Returns an array of "txid:vout" strings representing UTXOs that contain inscriptions.
 */
export async function fetchInscriptionOutputs(address: string): Promise<string[]> {
  const data = await request<{ outputs: string[] }>(
    `/address/${encodeURIComponent(address)}/inscriptions`
  );
  return data.outputs;
}

/**
 * Fetches both inscription IDs and output identifiers for an address.
 */
export async function fetchAddressInscriptions(
  address: string
): Promise<RawAddressInscriptionsResponse> {
  const raw = await request<unknown>(`/address/${encodeURIComponent(address)}/inscriptions`);
  return v.parse(RawAddressInscriptionsResponseSchema, raw);
}

/**
 * Fetches a single inscription's metadata and returns a slim Inscription object.
 */
export async function fetchInscription(id: string): Promise<Inscription> {
  const data = await request<unknown>(`/inscription/${encodeURIComponent(id)}`);
  const raw = v.parse(RawInscriptionResponseSchema, data);
  return toInscription(raw);
}

/**
 * Returns true if the given UTXO holds an inscription and should be excluded from coin selection.
 * Matches against a Set of "txid:vout" output identifiers.
 */
export function isInscriptionUtxo(utxo: Utxo, inscriptionOutputs: Set<string>): boolean {
  return inscriptionOutputs.has(`${utxo.txid}:${utxo.vout}`);
}

/**
 * Filters UTXOs to only confirmed, non-inscription outputs safe for spending.
 */
export function filterSpendableUtxos(utxos: Utxo[], inscriptionOutputs: Set<string>): Utxo[] {
  return utxos.filter((u) => u.status.confirmed && !isInscriptionUtxo(u, inscriptionOutputs));
}

export async function fetchTransaction(txid: string): Promise<RawTransaction> {
  const data = await request<unknown>(`/tx/${encodeURIComponent(txid)}`);
  return v.parse(RawTransactionSchema, data);
}

export async function fetchTxHex(txid: string): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/tx/${encodeURIComponent(txid)}/hex`, {
      signal: controller.signal,
      headers: getHeaders()
    });
    clearTimeout(id);
    if (!response.ok) {
      if (response.status === 404) throw new Error('Service not available (404).');
      throw new Error('Failed to fetch transaction hex');
    }
    return response.text();
  } catch (e: any) {
    clearTimeout(id);
    throw e;
  }
}

export async function broadcastTx(txHex: string): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/tx`, {
      method: 'POST',
      body: txHex,
      signal: controller.signal,
      headers: getHeaders()
    });
    clearTimeout(id);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Service not available (404).');
      }
      const text = await response.text();
      throw new Error(text || `Broadcast failed (${response.status})`);
    }

    return await response.text();
  } catch (e: any) {
    clearTimeout(id);
    throw e;
  }
}
