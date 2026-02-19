import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ImportWalletView from './ImportWalletView.vue';
import { useApp } from '@/composables/useApp';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp', () => ({
  useApp: vi.fn()
}));

// Components
const stubs = {
  PepPageHeader: { template: '<div />' },
  PepForm: {
    template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="actions" /></form>'
  },
  PepInputGroup: {
    template: '<div><label>{{ label }}</label><slot /></div>',
    props: ['label']
  },
  PepPasswordFields: {
    template:
      '<div><input id="pwd" type="password" :value="password" @input="$emit(\'update:password\', $event.target.value)" /><input id="conf" type="password" :value="confirmPassword" @input="$emit(\'update:confirmPassword\', $event.target.value)" /></div>',
    props: ['password', 'confirmPassword']
  },
  PepLoadingButton: { template: '<button type="submit"><slot /></button>' },
  PepIcon: { template: '<div />' }
};

const VALID_MNEMONIC =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

describe('ImportWalletView Logic', () => {
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
      route: { path: '/import' } as any
    });
  });

  it('should call store.importWallet and navigate to dashboard on success', async () => {
    mockStore.importWallet.mockResolvedValue(undefined);

    const wrapper = mount(ImportWalletView, {
      global: {
        stubs: {
          ...stubs,
          PepPageHeader: { template: '<div />', props: ['title', 'backTo', 'onBack'] }
        }
      }
    });

    // 1. Fill mnemonic
    await wrapper.find('textarea').setValue(VALID_MNEMONIC);

    // 2. Fill passwords
    await wrapper.find('#pwd').setValue('Password123!');
    await wrapper.find('#conf').setValue('Password123!');

    // 3. Trigger import
    await wrapper.find('form').trigger('submit');

    expect(mockStore.importWallet).toHaveBeenCalledWith(VALID_MNEMONIC, 'Password123!');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
