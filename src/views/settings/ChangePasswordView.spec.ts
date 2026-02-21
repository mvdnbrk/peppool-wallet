import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ChangePasswordView from './ChangePasswordView.vue';
import { useApp } from '@/composables/useApp';
import { replaceMock, pushMock } from '@/composables/__mocks__/useApp';
import * as encryption from '@/utils/encryption';

// UI Components
import PepForm from '@/components/ui/form/PepForm.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';
import PepPasswordFields from '@/components/ui/form/PepPasswordFields.vue';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepSuccessState from '@/components/ui/PepSuccessState.vue';

// Mock useApp
vi.mock('@/composables/useApp');

// Mock Encryption
vi.mock('@/utils/encryption', () => ({
  encrypt: vi.fn(),
  decrypt: vi.fn()
}));

const stubs = {
  PepIcon: { template: '<div />' }
};

describe('ChangePasswordView', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(encryption.encrypt).mockResolvedValue('new-encrypted-mnemonic');

    mockWallet = {
      isUnlocked: true,
      plaintextMnemonic: 'test mnemonic',
      lockoutUntil: 0,
      unlock: vi.fn(),
      updateVault: vi.fn()
    };

    vi.mocked(useApp).mockReturnValue({
      router: { replace: replaceMock, push: pushMock, back: vi.fn() } as any,
      wallet: mockWallet,
      requireUnlock: vi.fn(),
      route: { path: '/change-password' } as any
    });
  });

  const global = {
    stubs,
    components: {
      PepForm,
      PepPasswordInput,
      PepPasswordFields,
      PepLoadingButton,
      PepButton,
      PepMainLayout,
      PepPageHeader,
      PepSuccessState
    }
  };

  it('should redirect if wallet is locked', () => {
    mockWallet.isUnlocked = false;
    const { requireUnlock } = useApp();

    mount(ChangePasswordView, { global });

    expect(requireUnlock).toHaveBeenCalled();
  });

  it('should show success state after successful password change', async () => {
    mockWallet.unlock.mockResolvedValue(true);

    const wrapper = mount(ChangePasswordView, { global });

    // Fill form
    await wrapper.find('input#old-password').setValue('old-pass');
    await wrapper.find('input#new-password').setValue('new-pass-12345678');
    await wrapper.find('input#confirm-password').setValue('new-pass-12345678');

    // Submit
    await wrapper.find('#change-password-form').trigger('submit');
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Password updated!');
    expect(mockWallet.unlock).toHaveBeenCalledWith('old-pass');
    expect(mockWallet.updateVault).toHaveBeenCalledWith('new-encrypted-mnemonic');
  });

  it('should prevent changing to the same password', async () => {
    const wrapper = mount(ChangePasswordView, { global });

    // Fill with same passwords
    await wrapper.find('input#old-password').setValue('same-pass');
    await wrapper.find('input#new-password').setValue('same-pass');
    await wrapper.find('input#confirm-password').setValue('same-pass');

    await wrapper.find('#change-password-form').trigger('submit');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Cannot use current password');
    // Ensure wallet unlock was never even called
    expect(mockWallet.unlock).not.toHaveBeenCalled();
  });

  it('should navigate to dashboard when Close is clicked on success screen', async () => {
    mockWallet.unlock.mockResolvedValue(true);

    const wrapper = mount(ChangePasswordView, { global });

    // Trigger success
    await wrapper.find('input#old-password').setValue('old-pass');
    await wrapper.find('input#new-password').setValue('new-pass-12345678');
    await wrapper.find('input#confirm-password').setValue('new-pass-12345678');
    await wrapper.find('#change-password-form').trigger('submit');
    await flushPromises();
    await wrapper.vm.$nextTick();

    const closeBtn = wrapper.findAll('button').find((b) => b.text() === 'Close');
    await closeBtn?.trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
