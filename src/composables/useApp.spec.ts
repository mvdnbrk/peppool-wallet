import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApp } from './useApp';
import { useWalletStore } from '@/stores/wallet';
import { useAccountStore } from '@/stores/account';
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

// Mock Account Store
vi.mock('@/stores/account', () => ({
  useAccountStore: vi.fn()
}));

describe('useApp Composable', () => {
  let mockStore: any;
  let mockAccountStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      isUnlocked: false
    };
    mockAccountStore = {
      balance: 0
    };
    vi.mocked(useWalletStore).mockReturnValue(mockStore);
    vi.mocked(useAccountStore).mockReturnValue(mockAccountStore);
  });

  it('should return router, route, wallet, and account', () => {
    const TestComponent = defineComponent({
      setup() {
        const app = useApp();
        expect(app.router).toBe(mockRouter);
        expect(app.wallet).toBe(mockStore);
        expect(app.account).toBe(mockAccountStore);
        expect(app.route).toBeDefined();
        return () => null;
      }
    });

    mount(TestComponent);
  });
});
