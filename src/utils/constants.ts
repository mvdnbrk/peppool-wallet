export const RIBBITS_PER_PEP = 100_000_000;
export const API_TIMEOUT_MS = 15_000;

// 1,000 ribbits/byte = 0.01 PEP per KB (Network recommendation)
export const RECOMMENDED_FEE_RATE = 1000;
export const MIN_SEND_PEP = 0.01;
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Format a fiat value with enough precision to be meaningful.
 * For values ≥ 0.01 → 2 decimals ($1.23)
 * For tiny values → extends until 2 significant digits ($0.0023)
 */
export function formatFiat(value: number): string {
    if (value === 0) return '0.00';
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
