import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApp } from './useApp';
import { useRouter } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { mount, flushPromises } from '@vue/test-utils';
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

  const TestComponent = defineComponent({
    setup() {
      const app = useApp();
      app.requireUnlock();
      return () => null;
    }
  });

  it('requireUnlock should redirect to / if wallet is locked', async () => {
    mockStore.isUnlocked = false;

    mount(TestComponent);

    await flushPromises();
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('requireUnlock should NOT redirect if wallet is unlocked', async () => {
    mockStore.isUnlocked = true;

    mount(TestComponent);

    await flushPromises();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
