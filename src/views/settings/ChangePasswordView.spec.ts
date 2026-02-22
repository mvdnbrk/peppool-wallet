import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import ChangePasswordView from './ChangePasswordView.vue';
import { useApp } from '@/composables/useApp';
import { useChangePassword, ChangePasswordError } from '@/composables/useChangePassword';
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

// Mock useChangePassword
const mockChangePassword = {
  isSuccess: ref(false),
  performChange: vi.fn().mockResolvedValue(true)
};

vi.mock('@/composables/useChangePassword', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/composables/useChangePassword')>();
  return {
    ...actual,
    useChangePassword: () => mockChangePassword
  };
});

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
    mockChangePassword.isSuccess.value = false;
    vi.mocked(encryption.encrypt).mockResolvedValue('new-encrypted-mnemonic');

    mockWallet = {
      isUnlocked: true,
      plaintextMnemonic: 'test mnemonic',
      lockout: { lockoutUntil: 0, failedAttempts: 0, isLockedOut: false },
      unlock: vi.fn(),
      updateVault: vi.fn()
    };

    vi.mocked(useApp).mockReturnValue({
      router: { replace: replaceMock, push: pushMock, back: vi.fn() } as any,
      wallet: mockWallet,

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

  it('should show success state after successful password change', async () => {
    const wrapper = mount(ChangePasswordView, { global });

    // Fill form
    await wrapper.find('input#old-password').setValue('old-pass');
    await wrapper.find('input#new-password').setValue('new-pass-12345678');
    await wrapper.find('input#confirm-password').setValue('new-pass-12345678');

    // Submit
    await wrapper.find('#change-password-form').trigger('submit');

    // Simulate success state change in composable
    mockChangePassword.isSuccess.value = true;
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Password updated!');
    expect(mockChangePassword.performChange).toHaveBeenCalledWith(
      'old-pass',
      'new-pass-12345678',
      'new-pass-12345678'
    );
  });

  it('should prevent changing to the same password by showing error', async () => {
    mockChangePassword.performChange.mockRejectedValueOnce(
      new ChangePasswordError('password', 'Cannot use current password')
    );
    const wrapper = mount(ChangePasswordView, { global });

    // Fill with same passwords
    await wrapper.find('input#old-password').setValue('same-pass');
    await wrapper.find('input#new-password').setValue('same-pass');
    await wrapper.find('input#confirm-password').setValue('same-pass');

    await wrapper.find('#change-password-form').trigger('submit');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Cannot use current password');
  });

  it('should disable update button if new password is same as current', async () => {
    const wrapper = mount(ChangePasswordView, { global });

    await wrapper.find('input#old-password').setValue('same-pass');
    await wrapper.find('input#new-password').setValue('same-pass');
    await wrapper.find('input#confirm-password').setValue('same-pass');

    const button = wrapper.findComponent(PepLoadingButton);
    expect(button.props('disabled')).toBe(true);
    expect(wrapper.text()).toContain('Cannot use current password');
  });

  it('should navigate to dashboard when Close is clicked on success screen', async () => {
    const wrapper = mount(ChangePasswordView, { global });

    // Trigger success
    mockChangePassword.isSuccess.value = true;
    await wrapper.vm.$nextTick();

    const closeBtn = wrapper.findAll('button').find((b) => b.text().includes('Close'));
    await closeBtn?.trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
