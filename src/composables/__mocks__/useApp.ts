import { vi } from 'vitest';

export const pushMock = vi.fn();
export const replaceMock = vi.fn();
export const backMock = vi.fn();

export const useApp = vi.fn(() => ({
  router: {
    push: pushMock,
    replace: replaceMock,
    back: backMock
  },
  route: {
    path: '/',
    params: {},
    query: {}
  },
  wallet: {
    address: 'test-address',
    isUnlocked: true,
    isCreated: true,
    lockout: { lockoutUntil: 0, failedAttempts: 0, isLockedOut: false, attemptsRemaining: 3 },
    balance: 0,
    prices: { USD: 0, EUR: 0 },
    selectedCurrency: 'USD',
    currencySymbol: '$',
    transactions: [],
    unlock: vi.fn(),
    updateVault: vi.fn(),
    checkSession: vi.fn(),
    refreshBalance: vi.fn(),
    startPolling: vi.fn(),
    stopPolling: vi.fn(),
    openExplorerTx: vi.fn()
  },
  requireUnlock: vi.fn()
}));
