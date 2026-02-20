import { vi } from 'vitest';
import { webcrypto } from 'node:crypto';

// Polyfill crypto for bip39/zxcvbn and other utils
if (typeof global !== 'undefined' && !global.crypto) {
  (global as any).crypto = webcrypto;
}

// Mock global chrome
const chromeMock = {
  storage: {
    local: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined)
    },
    session: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined)
    }
  },
  runtime: {
    sendMessage: vi.fn().mockResolvedValue(undefined),
    id: 'test-id'
  },
  alarms: {
    create: vi.fn(),
    clear: vi.fn(),
    onAlarm: {
      addListener: vi.fn()
    }
  }
};

if (typeof global !== 'undefined') {
  (global as any).chrome = chromeMock;
}

// Mock UX delays to 0 for all tests to speed up execution
vi.mock('./utils/constants', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils/constants')>();
  return {
    ...actual,
    UX_DELAY_FAST: 0,
    UX_DELAY_NORMAL: 0,
    UX_DELAY_SLOW: 0
  };
});

import { useApp as mockUseApp } from './composables/__mocks__/useApp';
import { useLockout as mockUseLockout } from './composables/__mocks__/useLockout';

// Mock useApp globally
vi.mock('@/composables/useApp', () => ({
  useApp: mockUseApp
}));

// Mock useLockout globally
vi.mock('@/composables/useLockout', () => ({
  useLockout: mockUseLockout
}));
