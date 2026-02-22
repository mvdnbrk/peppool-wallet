import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ResetWalletView from './ResetWalletView.vue';
import { useApp } from '@/composables/useApp';

// UI Components
import PepForm from '@/components/ui/form/PepForm.vue';
import PepCheckbox from '@/components/ui/form/PepCheckbox.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp', () => ({
  useApp: vi.fn()
}));

// Visual stubs only
const stubs = {
  PepIcon: { template: '<div />' }
};

describe('ResetWalletView Feature', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      resetWallet: vi.fn(),
      isUnlocked: true
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockWallet,
      route: { path: '/reset-wallet' } as any
    });
  });

  const global = {
    stubs,
    components: {
      PepForm,
      PepCheckbox,
      PepButton,
      PepLoadingButton,
      PepMainLayout,
      PepPageHeader
    }
  };

  it('should call resetWallet and redirect to home on confirm', async () => {
    const wrapper = mount(ResetWalletView, { global });

    const resetSpy = vi.spyOn(mockWallet, 'resetWallet');

    // 1. Initial state: button should be disabled
    // @ts-ignore
    expect(wrapper.vm.confirmedBackup).toBe(false);

    // 2. Check the checkbox
    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(true);
    // @ts-ignore
    expect(wrapper.vm.confirmedBackup).toBe(true);

    // 3. Trigger form submit
    await wrapper.find('#reset-wallet-form').trigger('submit');

    // 4. VERIFY: wallet is reset and user redirected
    expect(resetSpy).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
