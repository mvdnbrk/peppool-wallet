import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PreferencesView from './PreferencesView.vue';
import AutoLockView from './AutoLockView.vue';
import CurrencyView from './CurrencyView.vue';
import AboutView from './AboutView.vue';
import AccountsView from './AccountsView.vue';
import ConnectedSitesView from './ConnectedSitesView.vue';
import { useApp } from '@/composables/useApp';

import PepList from '@/components/ui/list/PepList.vue';
import PepListItem from '@/components/ui/list/PepListItem.vue';
import PepRadioList from '@/components/ui/form/PepRadioList.vue';

// Mock useApp
const pushMock = vi.fn();
const backMock = vi.fn();
vi.mock('@/composables/useApp');

const global = {
  components: {
    PepList,
    PepListItem,
    PepRadioList
  }
};

describe('Settings Detail Views', () => {
  let mockWallet: any;
  let mockSettings: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockSettings = {
      settings: { currency: 'USD', explorer: 'peppool', lockDuration: 15 },
      currencySymbol: '$',
      setCurrency: vi.fn(),
      setExplorer: vi.fn()
    };
    mockWallet = {
      setLockDuration: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock, back: backMock } as any,
      wallet: mockWallet,
      settings: mockSettings,
      route: { path: '/settings' } as any
    } as any);
  });

  describe('PreferencesView', () => {
    it('should render correct initial state', () => {
      const wrapper = mount(PreferencesView, { global });
      expect(wrapper.text()).toContain('USD');
      expect(wrapper.find('#preferences-list').exists()).toBe(true);
    });

    it('should handle labels for hours correctly', async () => {
      mockSettings.settings.lockDuration = 60;
      const wrapper = mount(PreferencesView, { global });
      expect(wrapper.text()).toContain('1 Hour');

      mockSettings.settings.lockDuration = 180;
      const wrapper2 = mount(PreferencesView, { global });
      expect(wrapper2.text()).toContain('3 Hours');
    });

    it('should navigate to detail views', async () => {
      const wrapper = mount(PreferencesView, { global });

      await wrapper.find('#pref-currency-item').trigger('click');
      expect(pushMock).toHaveBeenCalledWith('/settings/currency');

      await wrapper.find('#pref-explorer-item').trigger('click');
      expect(pushMock).toHaveBeenCalledWith('/settings/explorer');

      await wrapper.find('#pref-autolock-item').trigger('click');
      expect(pushMock).toHaveBeenCalledWith('/settings/auto-lock');
    });
  });

  describe('AutoLockView', () => {
    it('should update lock duration and go back', async () => {
      const wrapper = mount(AutoLockView, { global });
      const radioList = wrapper.findComponent(PepRadioList);

      await radioList.vm.$emit('update:modelValue', 60);

      expect(mockWallet.setLockDuration).toHaveBeenCalledWith(60);
      vi.advanceTimersByTime(200);
      expect(backMock).toHaveBeenCalled();
    });
  });

  describe('CurrencyView', () => {
    it('should update currency and go back', async () => {
      const wrapper = mount(CurrencyView, { global });
      const radioList = wrapper.findComponent(PepRadioList);

      await radioList.vm.$emit('update:modelValue', 'EUR');

      expect(mockSettings.setCurrency).toHaveBeenCalledWith('EUR');
      vi.advanceTimersByTime(200);
      expect(backMock).toHaveBeenCalled();
    });
  });

  describe('AboutView', () => {
    it('should render about list', () => {
      const wrapper = mount(AboutView, { global });
      expect(wrapper.find('#about-links-list').exists()).toBe(true);
    });
  });

  describe('AccountsView', () => {
    it('should render correct title', () => {
      const wrapper = mount(AccountsView, {
        global: {
          ...global,
          stubs: {
            ...global.stubs,
            PepMainLayout: {
              template: '<div><slot name="header"/><slot /><slot name="actions"/></div>'
            },
            PepPageHeader: { template: '<div>Accounts</div>' },
            PepList: { template: '<div><slot /></div>' }
          }
        }
      });
      expect(wrapper.text()).toContain('Accounts');
    });
  });

  describe('ConnectedSitesView', () => {
    it('should render correct title', () => {
      const wrapper = mount(ConnectedSitesView, { global });
      expect(wrapper.text()).toContain('Connected Sites');
    });
  });
});
