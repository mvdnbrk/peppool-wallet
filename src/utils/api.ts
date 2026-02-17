import { API_TIMEOUT_MS, APP_NAME, APP_VERSION } from './constants';
import { RawTransactionSchema, type RawTransaction } from '../models/Transaction';
import * as v from 'valibot';

const API_BASE = import.meta.env.VITE_MAINNET_API || 'https://peppool.space/api';

const COMMON_HEADERS = {
    'X-App-Name': APP_NAME,
    'X-App-Version': APP_VERSION
};

export async function fetchTipHeight(): Promise<number> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    try {
        const response = await fetch(`${API_BASE}/blocks/tip/height`, {
            signal: controller.signal,
            headers: COMMON_HEADERS
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
                ...COMMON_HEADERS
            },
            signal: controller.signal
        });
        clearTimeout(id);
        const contentType = response.headers.get('content-type');

        if (!response.ok) {
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

export interface AddressStats {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
}

export interface AddressInfo {
    address: string;
    chain_stats: AddressStats;
    mempool_stats: AddressStats;
}

export async function fetchAddressInfo(address: string): Promise<number> {
    const data = await request<AddressInfo>(`/address/${address}`);
    const confirmedBalance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
    const mempoolBalance = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
    return confirmedBalance + mempoolBalance;
}

export async function fetchPepPrice(): Promise<{ USD: number, EUR: number }> {
    return await request<{ USD: number, EUR: number }>('/prices');
}

export interface RecommendedFees {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
}

export async function fetchRecommendedFees(): Promise<RecommendedFees> {
    return await request<RecommendedFees>('/fees/recommended');
}

export async function validateAddress(address: string): Promise<{ isvalid: boolean }> {
    return await request<{ isvalid: boolean }>(`/validate-address/${address}`);
}

export interface ApiUtxo {
    txid: string;
    vout: number;
    value: number;
    status: {
        confirmed: boolean;
        block_height?: number;
        block_time?: number;
    };
}

export async function fetchTransactions(address: string): Promise<RawTransaction[]> {
    const data = await request<unknown[]>(`/address/${address}/txs`);
    return data.map(tx => v.parse(RawTransactionSchema, tx));
}

export async function fetchUtxos(address: string): Promise<ApiUtxo[]> {
    return await request<ApiUtxo[]>(`/address/${address}/utxo`);
}

export async function fetchTransaction(txid: string): Promise<RawTransaction> {
    const data = await request<unknown>(`/tx/${txid}`);
    return v.parse(RawTransactionSchema, data);
}

export async function fetchTxHex(txid: string): Promise<string> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        const response = await fetch(`${API_BASE}/tx/${txid}/hex`, {
            signal: controller.signal,
            headers: COMMON_HEADERS
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
            headers: COMMON_HEADERS
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
