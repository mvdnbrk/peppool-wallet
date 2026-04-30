import { reactive } from 'vue';
import { getSettings } from './settings';
import { fetchPepPrice } from './api';
import { RIBBITS_PER_PEP } from './constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage';

export interface Prices {
  USD: number;
  EUR: number;
}

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', EUR: '€' };

const prices: Prices = reactive({ USD: 0, EUR: 0 });

function loadFromCache(): void {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.PRICES);
  if (raw) {
    try {
      const cached = JSON.parse(raw);
      Object.assign(prices, cached);
    } catch {
      /* ignore corrupt cache */
    }
  }
}

loadFromCache();

export function getPrices(): Prices {
  return prices;
}

export async function refreshPrices(): Promise<void> {
  const fetched = await fetchPepPrice();
  Object.assign(prices, fetched);
  localStorage.setItem(LOCAL_STORAGE_KEYS.PRICES, JSON.stringify({ ...prices }));
}

export function clearPrices(): void {
  prices.USD = 0;
  prices.EUR = 0;
  localStorage.removeItem(LOCAL_STORAGE_KEYS.PRICES);
}

/**
 * Convert a ribbits amount to fiat using the current currency setting.
 */
export function convert(ribbits: number): number {
  const { currency } = getSettings();
  return (ribbits / RIBBITS_PER_PEP) * (prices[currency] || 0);
}

/**
 * Format a ribbits amount as a fiat string using the current currency setting.
 * e.g. "$1.23 USD"
 */
export function format(ribbits: number): string {
  const { currency } = getSettings();
  const symbol = CURRENCY_SYMBOLS[currency] || '';
  return `${symbol}${formatFiat(convert(ribbits))} ${currency}`;
}

/**
 * Format a ribbits amount as a PEP string with comma grouping.
 * e.g. 100_000_000 → "1 PEP", 123_456_789 → "1.23456789 PEP"
 */
export function formatPep(ribbits: number): string {
  return `${formatAmount(ribbits / RIBBITS_PER_PEP)} PEP`;
}

/**
 * Format a PEP amount with commas and smart decimal reduction for large numbers.
 * e.g. 1234.56789 -> "1,234.56789"
 * e.g. 1234567.89 -> "1,234,567.89"
 * e.g. 1234567890 -> "1,234,567,890" (0 decimals for billions)
 */
export function formatAmount(value: number): string {
  if (value === 0) return '0';

  let decimals = 8;
  if (value >= 1_000_000_000) decimals = 0;
  else if (value >= 1_000_000) decimals = 2;

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });

  return formatter.format(value);
}

/**
 * Format a raw fiat value with enough precision to be meaningful.
 * For values ≥ 0.01 → 2 decimals ($1.23)
 * For tiny values → extends until 2 significant digits ($0.0023)
 */
export function formatFiat(value: number): string {
  if (value === 0 || !Number.isFinite(value)) return '0.00';
  const abs = Math.abs(value);
  if (abs >= 0.01) return value.toFixed(2);
  const decimals = Math.max(2, -Math.floor(Math.log10(abs)) + 1);
  return value.toFixed(decimals);
}
