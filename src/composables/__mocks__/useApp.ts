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
    isMnemonicLoaded: true,
    lockout: { lockoutUntil: 0, failedAttempts: 0, isLockedOut: false, attemptsRemaining: 3 },
    balance: 0,
    transactions: [],
    unlock: vi.fn(),
    updateVault: vi.fn(),
    checkSession: vi.fn(),
    refreshBalance: vi.fn(),
    startPolling: vi.fn(),
    stopPolling: vi.fn(),
    lock: vi.fn(),
    resetWallet: vi.fn(),
    resetLockTimer: vi.fn(),
    accounts: [],
    activeAccountIndex: 0
  },
  settings: {
    settings: { currency: 'USD', explorer: 'peppool', lockDuration: 15 },
    setCurrency: vi.fn(),
    setExplorer: vi.fn(),
    setLockDuration: vi.fn()
  }
}));
