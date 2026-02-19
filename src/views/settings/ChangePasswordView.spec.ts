import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ChangePasswordView from './ChangePasswordView.vue';
import { useWalletStore } from '@/stores/wallet';
import { createTestingPinia } from '@pinia/testing';
import * as encryption from '@/utils/encryption';

// Mock Router
const pushMock = vi.fn();
const replaceMock = vi.fn();
const backMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
    back: backMock
  })
}));

// Mock Encryption
vi.mock('@/utils/encryption', () => ({
  encrypt: vi.fn(),
  decrypt: vi.fn()
}));

const stubs = {
  PepPageHeader: {
    template: '<div>{{ title }}<slot /></div>',
    props: ['title']
  },
  PepForm: {
    template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="actions" /></form>'
  },
  PepPasswordInput: {
    template:
      '<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'id']
  },
  PepPasswordFields: {
    template:
      '<div><input id="pwd" :value="password" @input="$emit(\'update:password\', $event.target.value)" /><input id="conf" :value="confirmPassword" @input="$emit(\'update:confirmPassword\', $event.target.value)" /></div>',
    props: ['password', 'confirmPassword']
  },
  PepLoadingButton: { template: '<button type="submit"><slot /></button>' },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  PepIcon: { template: '<div />' }
};

describe('ChangePasswordView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(encryption.encrypt).mockResolvedValue('new-encrypted-mnemonic');
  });

  it('should redirect to home if wallet is locked on mount', () => {
    const pinia = createTestingPinia({
      initialState: {
        wallet: { isUnlocked: false }
      }
    });

    mount(ChangePasswordView, {
      global: { stubs, plugins: [pinia] }
    });
    expect(replaceMock).toHaveBeenCalledWith('/');
  });

  it('should show success state after successful password change', async () => {
    const pinia = createTestingPinia({
      stubActions: true,
      initialState: {
        wallet: {
          isUnlocked: true,
          plaintextMnemonic: 'test mnemonic',
          lockoutUntil: 0
        }
      }
    });
    const walletStore = useWalletStore();
    walletStore.unlock.mockResolvedValue(true);
    vi.spyOn(walletStore, 'plaintextMnemonic', 'get').mockReturnValue('test mnemonic');
    vi.spyOn(walletStore, 'isUnlocked', 'get').mockReturnValue(true);

    const wrapper = mount(ChangePasswordView, {
      global: { stubs, plugins: [pinia] }
    });

    // Fill form
    await wrapper.find('#old-password').setValue('old-pass');
    await wrapper.find('#pwd').setValue('new-pass-12345678');
    await wrapper.find('#conf').setValue('new-pass-12345678');

    // Submit
    await wrapper.find('form').trigger('submit');

    // Process async actions
    await flushPromises();

    // Need to wait for isSuccess to be true
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Password Updated');
    expect(walletStore.unlock).toHaveBeenCalledWith('old-pass');
    expect(walletStore.updateVault).toHaveBeenCalledWith('new-encrypted-mnemonic');
  });

  it('should navigate to dashboard when Close is clicked on success screen', async () => {
    const pinia = createTestingPinia({
      stubActions: true,
      initialState: {
        wallet: {
          isUnlocked: true,
          plaintextMnemonic: 'test mnemonic',
          lockoutUntil: 0
        }
      }
    });
    const walletStore = useWalletStore();
    walletStore.unlock.mockResolvedValue(true);
    vi.spyOn(walletStore, 'plaintextMnemonic', 'get').mockReturnValue('test mnemonic');
    vi.spyOn(walletStore, 'isUnlocked', 'get').mockReturnValue(true);

    const wrapper = mount(ChangePasswordView, {
      global: { stubs, plugins: [pinia] }
    });

    // Trigger success
    await wrapper.find('#old-password').setValue('old-pass');
    await wrapper.find('#pwd').setValue('new-pass-12345678');
    await wrapper.find('#conf').setValue('new-pass-12345678');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Password Updated');

    const closeBtn = wrapper.findAll('button').find((b) => b.text() === 'Close');
    await closeBtn?.trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
