import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ChangePasswordView from './ChangePasswordView.vue';
import { useApp } from '@/composables/useApp';
import { replaceMock, pushMock } from '@/composables/__mocks__/useApp';
import * as encryption from '@/utils/encryption';
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
  PepForm: {
    template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="actions" /></form>'
  },
  PepPasswordInput: {
    template:
      '<div><input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /><span>{{ error }}</span></div>',
    props: ['modelValue', 'id', 'error']
  },
  PepPasswordFields: {
    template:
      '<div><input id="pwd" :value="password" @input="$emit(\'update:password\', $event.target.value)" /><input id="conf" :value="confirmPassword" @input="$emit(\'update:confirmPassword\', $event.target.value)" /><span>{{ errors.password }}</span><span>{{ errors.confirmPassword }}</span></div>',
    props: ['password', 'confirmPassword', 'errors']
  },
  PepLoadingButton: { template: '<button type="submit"><slot /></button>' },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
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

  it('should redirect if wallet is locked', () => {
    mockWallet.isUnlocked = false;
    const { requireUnlock } = useApp();

    mount(ChangePasswordView, {
      global: { stubs, components: { PepMainLayout, PepPageHeader, PepSuccessState } }
    });

    expect(requireUnlock).toHaveBeenCalled();
  });

  it('should show success state after successful password change', async () => {
    mockWallet.unlock.mockResolvedValue(true);

    const wrapper = mount(ChangePasswordView, {
      global: { stubs, components: { PepMainLayout, PepPageHeader, PepSuccessState } }
    });

    // Fill form
    await wrapper.find('#old-password').setValue('old-pass');
    await wrapper.find('#pwd').setValue('new-pass-12345678');
    await wrapper.find('#conf').setValue('new-pass-12345678');

    // Submit
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Password updated!');
    expect(mockWallet.unlock).toHaveBeenCalledWith('old-pass');
    expect(mockWallet.updateVault).toHaveBeenCalledWith('new-encrypted-mnemonic');
  });

  it('should prevent changing to the same password', async () => {
    const wrapper = mount(ChangePasswordView, {
      global: { stubs, components: { PepMainLayout, PepPageHeader, PepSuccessState } }
    });

    // Fill with same passwords
    await wrapper.find('#old-password').setValue('same-pass');
    await wrapper.find('#pwd').setValue('same-pass');
    await wrapper.find('#conf').setValue('same-pass');

    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Cannot use current password');
    // Ensure wallet unlock was never even called
    expect(mockWallet.unlock).not.toHaveBeenCalled();
  });

  it('should navigate to dashboard when Close is clicked on success screen', async () => {
    mockWallet.unlock.mockResolvedValue(true);

    const wrapper = mount(ChangePasswordView, {
      global: { stubs, components: { PepMainLayout, PepPageHeader, PepSuccessState } }
    });

    // Trigger success
    await wrapper.find('#old-password').setValue('old-pass');
    await wrapper.find('#pwd').setValue('new-pass-12345678');
    await wrapper.find('#conf').setValue('new-pass-12345678');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    await wrapper.vm.$nextTick();

    const closeBtn = wrapper.findAll('button').find((b) => b.text() === 'Close');
    await closeBtn?.trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
