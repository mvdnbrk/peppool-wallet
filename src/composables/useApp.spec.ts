import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApp } from './useApp';
import { useWalletStore } from '@/stores/wallet';
import { useSettingsStore } from '@/stores/settings';
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

// Mock Settings Store
vi.mock('@/stores/settings', () => ({
  useSettingsStore: vi.fn()
}));

describe('useApp Composable', () => {
  let mockWalletStore: any;
  let mockSettingsStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWalletStore = { isUnlocked: false };
    mockSettingsStore = { settings: { currency: 'USD' } };
    vi.mocked(useWalletStore).mockReturnValue(mockWalletStore);
    vi.mocked(useSettingsStore).mockReturnValue(mockSettingsStore);
  });

  it('should return router, route, wallet, and settings', () => {
    const TestComponent = defineComponent({
      setup() {
        const app = useApp();
        expect(app.router).toBe(mockRouter);
        expect(app.wallet).toBe(mockWalletStore);
        expect(app.settings).toBe(mockSettingsStore);
        expect(app.route).toBeDefined();
        return () => null;
      }
    });

    mount(TestComponent);
  });
});
