import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CreateWalletView from './CreateWalletView.vue';
import { useApp } from '@/composables/useApp';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp', () => ({
  useApp: vi.fn()
}));

// Mock Crypto Utils
vi.mock('@/utils/crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/crypto')>();
  return {
    ...actual,
    generateMnemonic: vi.fn().mockReturnValue('test mnemonic')
  };
});

// Components
const stubs = {
  PepPageHeader: { template: '<div />' },
  PepForm: {
    template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="actions" /></form>'
  },
  PepPasswordFields: {
    template:
      '<div><input id="pwd" type="password" :value="password" @input="$emit(\'update:password\', $event.target.value)" /><input id="conf" type="password" :value="confirmPassword" @input="$emit(\'update:confirmPassword\', $event.target.value)" /></div>',
    props: ['password', 'confirmPassword']
  },
  PepMnemonicGrid: {
    name: 'PepMnemonicGrid',
    template: '<div class="mnemonic-grid" />'
  },
  PepCheckbox: {
    template:
      '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
    props: ['modelValue']
  },
  PepLoadingButton: { template: '<button type="submit"><slot /></button>' },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  PepIcon: { template: '<div />' }
};

const STRONG_PWD = 'Correct-Horse-Battery-Staple-2026!';

describe('CreateWalletView Logic', () => {
  let mockStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      importWallet: vi.fn(),
      isUnlocked: true,
      errors: {}
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockStore,
      requireUnlock: vi.fn(),
      route: { path: '/create' } as any
    });
  });

  it('should move to step 2 after valid password is set', async () => {
    const wrapper = mount(CreateWalletView, {
      global: {
        stubs: {
          ...stubs,
          PepPageHeader: { template: '<div />', props: ['title', 'backTo', 'onBack'] }
        }
      }
    });

    // Step 1: Fill passwords
    await wrapper.find('#pwd').setValue(STRONG_PWD);
    await wrapper.find('#conf').setValue(STRONG_PWD);

    // Trigger form submit directly
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    // Should now show mnemonic grid stub
    expect(wrapper.find('.mnemonic-grid').exists()).toBe(true);
  });

  it('should call store.importWallet and navigate to dashboard on step 2 success', async () => {
    mockStore.importWallet.mockResolvedValue(undefined);

    const wrapper = mount(CreateWalletView, {
      global: {
        stubs: {
          ...stubs,
          PepPageHeader: { template: '<div />', props: ['title', 'backTo', 'onBack'] }
        }
      }
    });

    // 1. Step 1
    await wrapper.find('#pwd').setValue(STRONG_PWD);
    await wrapper.find('#conf').setValue(STRONG_PWD);
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    // 2. Step 2
    await wrapper.find('input[type="checkbox"]').setValue(true);
    await wrapper.find('form').trigger('submit');

    expect(mockStore.importWallet).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
