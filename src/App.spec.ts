import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';
import { useRoute } from 'vue-router';

// Mock Router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn()
  })),
  RouterView: { template: '<div />' }
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
      const wrapper = mount(App, { global: { stubs } });
      expect(wrapper.find('header').exists()).toBe(false);
    }
  });

  it('should SHOW the header on dashboard and settings', () => {
    const appPaths = ['/dashboard', '/settings', '/send', '/receive'];
    
    for (const path of appPaths) {
      vi.mocked(useRoute).mockReturnValue({ path } as any);
      const wrapper = mount(App, { global: { stubs } });
      expect(wrapper.find('header').exists()).toBe(true);
    }
  });
});
