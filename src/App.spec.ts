import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';

// Mock Router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ path: '/dashboard' })),
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
    resetLockTimer: vi.fn(),
    startPolling: vi.fn(),
    stopPolling: vi.fn()
  }))
}));

describe('App Shell', () => {
  it('should render as a minimal shell without header or layout', () => {
    const wrapper = mount(App);
    // App is just a div shell — no header, no main, no layout
    expect(wrapper.find('header').exists()).toBe(false);
    expect(wrapper.find('main').exists()).toBe(false);
    expect(wrapper.element.tagName).toBe('DIV');
  });
});
