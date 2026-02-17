import { vi } from 'vitest';

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
