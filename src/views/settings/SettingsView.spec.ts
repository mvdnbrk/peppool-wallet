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
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepListItem from '@/components/ui/list/PepListItem.vue';
import PepList from '@/components/ui/list/PepList.vue';
import PepButton from '@/components/ui/PepButton.vue';
import { useApp } from '@/composables/useApp';

// Mock useApp
const pushMock = vi.fn();
const backMock = vi.fn();
vi.mock('@/composables/useApp');

describe('Settings Views Navigation', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      isUnlocked: true,
      selectedCurrency: 'USD',
      selectedExplorer: 'peppool',
      lockDuration: 15,
      lock: vi.fn(),
      resetWallet: vi.fn(),
      openExplorerTx: vi.fn(),
      openExplorerAddress: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock, back: backMock } as any,
      wallet: mockWallet,
      route: { path: '/settings' } as any
    });
  });

  const global = {
    components: {
      PepListItem,
      PepList,
      PepPageHeader,
      PepMainLayout
    }
  };

  it('SettingsView: should render correctly and have back button', () => {
    const wrapper = mount(SettingsView, { global });
    expect(wrapper.text()).toContain('Preferences');
    expect(wrapper.find('#settings-menu-list').exists()).toBe(true);

    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBe('/dashboard');
  });

  it('SettingsView: should navigate to sub-sections', async () => {
    const wrapper = mount(SettingsView, { global });

    await wrapper.find('#settings-security-item').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/settings/security');

    await wrapper.find('#settings-preferences-item').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/settings/preferences');

    await wrapper.find('#settings-about-item').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/settings/about');
  });

  it('SettingsView: should lock wallet and redirect', async () => {
    const wrapper = mount(SettingsView, { global });

    await wrapper.findComponent(PepButton).trigger('click');

    expect(mockWallet.lock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('AboutView: should use default router.back()', () => {
    const wrapper = mount(AboutView, { global });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('SecurityView: should use default router.back()', () => {
    const wrapper = mount(SecurityView, { global });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('PreferencesView: should use default router.back()', () => {
    const wrapper = mount(PreferencesView, { global });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('ChangePasswordView: should use default router.back()', () => {
    const wrapper = mount(ChangePasswordView, { global });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('ResetWalletView: should use default router.back()', () => {
    const wrapper = mount(ResetWalletView, { global });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('ShowMnemonicView: should use default router.back()', () => {
    const wrapper = mount(ShowMnemonicView, { global });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('AutoLockView: should use default router.back()', () => {
    const wrapper = mount(AutoLockView, { global });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('CurrencyView: should use default router.back()', () => {
    const wrapper = mount(CurrencyView, { global });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });

  it('PreferredExplorerView: should use default router.back()', () => {
    const wrapper = mount(PreferredExplorerView, { global });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('backTo')).toBeUndefined();
    expect(header.props('onBack')).toBeUndefined();
  });
});
