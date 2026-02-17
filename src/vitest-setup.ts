import { vi } from 'vitest';

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
