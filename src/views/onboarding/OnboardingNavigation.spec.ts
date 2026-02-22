import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ImportWalletView from './ImportWalletView.vue';
import CreateWalletView from './CreateWalletView.vue';
import ForgotPasswordView from './ForgotPasswordView.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import { useApp } from '@/composables/useApp';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp');

// Mock global components
const stubs = {
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
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: { errors: {} } as any,

      route: { path: '/' } as any
    });
  });

  it('ImportWalletView: should have backTo prop set to /', () => {
    const wrapper = mount(ImportWalletView, {
      global: { stubs, components: { PepPageHeader, PepMainLayout } }
    });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBe('/');
  });

  it('CreateWalletView: should have backTo prop set to / when at step 1', () => {
    const wrapper = mount(CreateWalletView, {
      global: { stubs, components: { PepPageHeader, PepMainLayout } }
    });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBe('/');
    expect(header.props('onBack')).toBeUndefined();
  });

  it('ForgotPasswordView: should use default router.back()', () => {
    const wrapper = mount(ForgotPasswordView, {
      global: { stubs, components: { PepPageHeader, PepMainLayout } }
    });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });
});
