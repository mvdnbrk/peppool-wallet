import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApp } from './useApp';
import { useRouter } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

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

// Mock Wallet Store
vi.mock('@/stores/wallet', () => ({
  useWalletStore: vi.fn()
}));

describe('useApp Composable', () => {
  let mockStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      isUnlocked: false
    };
    vi.mocked(useWalletStore).mockReturnValue(mockStore);
  });

  it('should return router, route, and wallet', () => {
    const TestComponent = defineComponent({
      setup() {
        const app = useApp();
        expect(app.router).toBe(mockRouter);
        expect(app.wallet).toBe(mockStore);
        expect(app.route).toBeDefined();
        return () => null;
      }
    });

    mount(TestComponent);
  });
});
