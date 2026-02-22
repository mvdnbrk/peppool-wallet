import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';
import { useRoute } from 'vue-router';
import PepGlobalHeader from './components/ui/PepGlobalHeader.vue';

// Mock Router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn()
  })),
  RouterView: { template: '<div />' }
}));

// Mock Wallet Store
vi.mock('@/stores/wallet', () => ({
  useWalletStore: vi.fn(() => ({
    isUnlocked: false,
    resetLockTimer: vi.fn()
  }))
}));

// Mock components
const stubs = {
  PepWordmark: { template: '<div />' },
  PepIcon: { template: '<div />' }
};

describe('App Global Layout', () => {
  it('should HIDE the header on onboarding pages', () => {
    const onboardingPaths = ['/', '/create', '/import', '/reset-wallet', '/forgot-password'];

    for (const path of onboardingPaths) {
      vi.mocked(useRoute).mockReturnValue({ path } as any);
      const wrapper = mount(App, {
        global: {
          stubs,
          components: { PepGlobalHeader }
        }
      });
      // The component exists in App.vue, but should not render its content
      expect(wrapper.find('header').exists()).toBe(false);
    }
  });

  it('should SHOW the header on dashboard and settings', () => {
    const appPaths = ['/dashboard', '/settings', '/send', '/receive'];

    for (const path of appPaths) {
      vi.mocked(useRoute).mockReturnValue({ path } as any);
      const wrapper = mount(App, {
        global: {
          stubs,
          components: { PepGlobalHeader }
        }
      });
      expect(wrapper.findComponent(PepGlobalHeader).exists()).toBe(true);
    }
  });
});
