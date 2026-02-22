import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApp } from './useApp';
import { useWalletStore } from '@/stores/wallet';

// Unmock useApp so we test the real one
vi.unmock('@/composables/useApp');

// Mock Router
const mockRouter = {
  replace: vi.fn(),
  push: vi.fn()
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: vi.fn(() => ({ path: '/dashboard' }))
}));

// Mock Store
vi.mock('@/stores/wallet', () => ({ useWalletStore: vi.fn(() => ({})) }));

describe('useApp Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return wallet store and router/route', () => {
    const app = useApp();

    expect(app.router).toBeDefined();
    expect(app.route).toBeDefined();
    expect(app.wallet).toBeDefined();
  });
});
