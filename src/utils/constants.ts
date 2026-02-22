import pkg from '../../package.json';

export const RIBBITS_PER_PEP = 100_000_000;
export const API_TIMEOUT_MS = 15_000;

export const APP_NAME = pkg.name;
export const APP_VERSION = pkg.version;

// 1,000 ribbits/byte = 0.01 PEP per KB (Network recommendation)
export const RECOMMENDED_FEE_RATE = 1000;
export const MIN_SEND_PEP = 0.01;
export const MIN_PASSWORD_LENGTH = 8;
export const TXS_PER_PAGE = 25;

export const UX_DELAY_FAST = 1000;
export const UX_DELAY_NORMAL = 2000;
export const UX_DELAY_SLOW = 3000;
/**
 * Format a crypto amount with commas and smart decimal reduction for large numbers.
 * e.g. 1234.56789 -> "1,234.56789"
 * e.g. 1234567.89 -> "1,234,567.89"
 * e.g. 1234567890 -> "1,234,567,890" (0 decimals for billions)
 */
export function formatAmount(value: number): string {
  if (value === 0) return '0';

  let decimals = 8;
  if (value >= 1_000_000_000) decimals = 0;
  else if (value >= 1_000_000) decimals = 2;

  // Use Intl.NumberFormat for reliable comma separators
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });

  return formatter.format(value);
}

/**
 * Format a fiat value with enough precision to be meaningful.
 * For values ≥ 0.01 → 2 decimals ($1.23)
 * For tiny values → extends until 2 significant digits ($0.0023)
 */
export function formatFiat(value: number): string {
  if (value === 0 || !Number.isFinite(value)) return '0.00';
  const abs = Math.abs(value);
  if (abs >= 0.01) return value.toFixed(2);
  // Count leading zeros after decimal point, then show 2 significant digits
  const decimals = Math.max(2, -Math.floor(Math.log10(abs)) + 1);
  return value.toFixed(decimals);
}

/**
 * Truncates a long ID (like a TXID or address) for display.
 * Returns an object with start and end pieces.
 */
export function truncateId(id: string, endLength = 6) {
  if (!id) return { start: '', end: '', full: '' };
  return {
    start: id.slice(0, -endLength),
    end: id.slice(-endLength),
    full: id
  };
}
