import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SettingsView from './SettingsView.vue';
import AboutView from './AboutView.vue';
import SecurityView from './SecurityView.vue';
import PreferencesView from './PreferencesView.vue';
import ChangePasswordView from './ChangePasswordView.vue';
import ResetWalletView from './ResetWalletView.vue';
import ShowMnemonicView from './ShowMnemonicView.vue';
import AutoLockView from './AutoLockView.vue';
import CurrencyView from './CurrencyView.vue';
import PreferredExplorerView from './PreferredExplorerView.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';

// Mock Router
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

// Mock global components
const stubs = {
  PepFooter: { template: '<div></div>' },
  PepList: { template: '<div><slot /></div>' },
  PepListItem: { template: '<div><slot /></div>' },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  PepPasswordFields: { template: '<div></div>' },
  PepLoadingButton: { template: '<button><slot /></button>' },
  PepCheckbox: { template: '<div></div>' },
  PepPasswordInput: { template: '<div></div>' },
  PepMnemonicGrid: { template: '<div></div>' },
  PepRadioList: { template: '<div></div>' }
};

describe('Settings Views Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('SettingsView: should have a backTo prop set to /dashboard', () => {
    const wrapper = mount(SettingsView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBe('/dashboard');
  });

  it('AboutView: should use default router.back()', () => {
    const wrapper = mount(AboutView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('SecurityView: should use default router.back()', () => {
    const wrapper = mount(SecurityView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('PreferencesView: should use default router.back()', () => {
    const wrapper = mount(PreferencesView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('ChangePasswordView: should use default router.back()', () => {
    const wrapper = mount(ChangePasswordView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('ResetWalletView: should use default router.back()', () => {
    const wrapper = mount(ResetWalletView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('ShowMnemonicView: should use default router.back()', () => {
    const wrapper = mount(ShowMnemonicView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('AutoLockView: should use default router.back()', () => {
    const wrapper = mount(AutoLockView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('CurrencyView: should use default router.back()', () => {
    const wrapper = mount(CurrencyView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('PreferredExplorerView: should use default router.back()', () => {
    const wrapper = mount(PreferredExplorerView, { global: { stubs, components: { PepPageHeader } } });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });
});
