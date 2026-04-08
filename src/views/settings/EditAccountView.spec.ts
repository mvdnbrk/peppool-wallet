import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import EditAccountView from './EditAccountView.vue';
import { useApp } from '@/composables/useApp';
import { useRoute } from 'vue-router';
import PepButton from '@/components/ui/PepButton.vue';
import PepInput from '@/components/ui/form/PepInput.vue';

// Mock useApp
const pushMock = vi.fn();
const backMock = vi.fn();
const replaceMock = vi.fn();
vi.mock('@/composables/useApp');

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: vi.fn()
  };
});

describe('EditAccountView', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      accounts: [{ address: 'addr1', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }],
      renameAccount: vi.fn().mockResolvedValue(undefined),
      addAccount: vi.fn().mockResolvedValue(undefined)
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock, back: backMock, replace: replaceMock } as any,
      wallet: mockWallet
    } as any);
    vi.mocked(useRoute).mockReturnValue({
      params: { index: '0' }
    } as any);
  });

  const global = {
    components: {
      PepButton,
      PepInput
    },
    stubs: {
      PepMainLayout: { template: '<div><slot name="header"/><slot /><slot name="actions"/></div>' },
      PepPageHeader: { template: '<div>Rename</div>' },
      PepForm: { template: '<form @submit.prevent="$emit(\'submit\')"><slot /></form>' },
      PepInputGroup: { template: '<div><slot /></div>' }
    }
  };

  it('should initialize with current account label', async () => {
    const wrapper = mount(EditAccountView, { global });
    await flushPromises();
    const input = wrapper.findComponent(PepInput);
    expect(input.props('modelValue')).toBe('Account 1');
  });

  it('should redirect back if account not found', async () => {
    vi.mocked(useRoute).mockReturnValue({
      params: { index: '99' }
    } as any);
    mount(EditAccountView, { global });
    await flushPromises();
    expect(replaceMock).toHaveBeenCalledWith('/settings/accounts');
  });

  it('should call renameAccount and navigate back on save', async () => {
    const wrapper = mount(EditAccountView, { global });
    const input = wrapper.findComponent(PepInput);

    await input.vm.$emit('update:modelValue', 'New Name');
    await wrapper.find('#save-account-name-button').trigger('click');

    expect(mockWallet.renameAccount).toHaveBeenCalledWith(0, 'New Name');
    expect(backMock).toHaveBeenCalled();
  });

  it('should show error if label is empty', async () => {
    const wrapper = mount(EditAccountView, { global });
    const input = wrapper.findComponent(PepInput);

    await input.vm.$emit('update:modelValue', '');
    await wrapper.find('#save-account-name-button').trigger('click');

    expect(wrapper.text()).toContain('Name cannot be empty');
    expect(mockWallet.renameAccount).not.toHaveBeenCalled();
  });

  it('should default label to next account number when creating new account', async () => {
    vi.mocked(useRoute).mockReturnValue({ params: { index: '-1' } } as any);
    const wrapper = mount(EditAccountView, { global });
    await flushPromises();

    const input = wrapper.findComponent(PepInput);
    expect(input.props('modelValue')).toBe('Account 2');
  });

  it('should call addAccount with label when saving new account', async () => {
    vi.mocked(useRoute).mockReturnValue({ params: { index: '-1' } } as any);
    const wrapper = mount(EditAccountView, { global });
    await flushPromises();

    const input = wrapper.findComponent(PepInput);
    await input.vm.$emit('update:modelValue', 'Savings');
    await wrapper.find('#save-account-name-button').trigger('click');
    await flushPromises();

    expect(mockWallet.addAccount).toHaveBeenCalledWith('Savings');
    expect(mockWallet.renameAccount).not.toHaveBeenCalled();
    expect(backMock).toHaveBeenCalled();
  });
});
