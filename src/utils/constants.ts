import pkg from '../../package.json';

export const RIBBITS_PER_PEP = 100_000_000;
export const API_TIMEOUT_MS = 15_000;

export const APP_NAME = pkg.name;
export const APP_VERSION = pkg.version;

// 1,000 ribbits/byte = 0.01 PEP per KB (Network recommendation)
export const RECOMMENDED_FEE_RATE = 1000;
export const MIN_SEND_PEP = 0.01;

// Pepecoin (Dogecoin-derived) soft dust rule: outputs below 1 PEP add a flat
// surcharge to the effective minimum fee miners enforce. Inscription postage
// outputs are always sub-dust, which is why inscription transfers stall at
// the size-only floor unless the surcharge is paid up front.
export const SOFT_DUST_LIMIT_RIBBITS = 100_000_000;
export const SOFT_DUST_FEE_RIBBITS = 4_000_000;
export const MIN_PASSWORD_LENGTH = 8;
export const TXS_PER_PAGE = 25;

export const UX_DELAY_FAST = 1000;
export const UX_DELAY_NORMAL = 2000;
export const UX_DELAY_SLOW = 3000;

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
