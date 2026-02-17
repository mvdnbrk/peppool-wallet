import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CreateWalletView from './CreateWalletView.vue';
import { useWalletStore } from '../../stores/wallet';
import * as cryptoUtils from '../../utils/crypto';

// Mock Router
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

// Mock Store
vi.mock('../../stores/wallet', () => ({
  useWalletStore: vi.fn()
}));

// Mock Crypto Utils
vi.mock('../../utils/crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../utils/crypto')>();
  return {
    ...actual,
    generateMnemonic: vi.fn().mockReturnValue('test mnemonic')
  };
});

// Components
const stubs = {
  PepHeader: { template: '<div />' },
  PepForm: { template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="actions" /></form>' },
  PepPasswordFields: { 
    template: '<div><input id="pwd" type="password" :value="password" @input="$emit(\'update:password\', $event.target.value)" /><input id="conf" type="password" :value="confirmPassword" @input="$emit(\'update:confirmPassword\', $event.target.value)" /></div>',
    props: ['password', 'confirmPassword']
  },
  PepMnemonicGrid: { 
    name: 'PepMnemonicGrid',
    template: '<div class="mnemonic-grid" />' 
  },
  PepCheckbox: { 
    template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
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
      importWallet: vi.fn()
    };
    vi.mocked(useWalletStore).mockReturnValue(mockStore);
  });

  it('should move to step 2 after valid password is set', async () => {
    const wrapper = mount(CreateWalletView, {
      global: { stubs }
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
      global: { stubs }
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
