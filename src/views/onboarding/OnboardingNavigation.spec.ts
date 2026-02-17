import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ImportWalletView from './ImportWalletView.vue';
import CreateWalletView from './CreateWalletView.vue';
import ForgotPasswordView from './ForgotPasswordView.vue';
import { createTestingPinia } from '@pinia/testing';

// Mock Router
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  }),
  useRoute: () => ({ path: '/import' })
}));

// Mock global components
const stubs = {
  PepHeader: {
    name: 'PepHeader',
    template: '<div>{{ title }}</div>',
    props: ['title', 'backTo', 'onBack']
  },
  PepFooter: { template: '<div></div>' },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  PepIcon: { template: '<div />' },
  PepInputGroup: { template: '<div><slot /></div>' },
  PepPasswordFields: { template: '<div></div>' },
  PepLoadingButton: { template: '<button><slot /></button>' },
  PepMnemonicGrid: { template: '<div></div>' },
  PepCheckbox: { template: '<div></div>' }
};

describe('Onboarding Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ImportWalletView: should have backTo prop set to /', () => {
    const wrapper = mount(ImportWalletView, {
      global: { stubs, plugins: [createTestingPinia()] }
    });
    const header = wrapper.findComponent({ name: 'PepHeader' });
    expect(header.props('backTo')).toBe('/');
  });

  it('CreateWalletView: should have backTo prop set to / when at step 1', () => {
    const wrapper = mount(CreateWalletView, {
      global: { stubs, plugins: [createTestingPinia()] }
    });
    const header = wrapper.findComponent({ name: 'PepHeader' });
    expect(header.props('backTo')).toBe('/');
    expect(header.props('onBack')).toBeUndefined();
  });

  it('ForgotPasswordView: should use default router.back()', () => {
    const wrapper = mount(ForgotPasswordView, {
      global: { stubs, plugins: [createTestingPinia()] }
    });
    const header = wrapper.findComponent({ name: 'PepHeader' });
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });
});
