import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CreateWalletView from './CreateWalletView.vue';
import { useApp } from '@/composables/useApp';

// UI Components
import PepForm from '@/components/ui/form/PepForm.vue';
import PepPasswordFields from '@/components/ui/form/PepPasswordFields.vue';
import PepMnemonicGrid from '@/components/ui/PepMnemonicGrid.vue';
import PepCheckbox from '@/components/ui/form/PepCheckbox.vue';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';

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

// Visual stubs only
const stubs = {
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

  const global = {
    stubs,
    components: {
      PepForm,
      PepPasswordFields,
      PepMnemonicGrid,
      PepCheckbox,
      PepLoadingButton,
      PepButton,
      PepMainLayout,
      PepPageHeader
    }
  };

  it('should move to step 2 after valid password is set', async () => {
    const wrapper = mount(CreateWalletView, { global });

    // Step 1: Fill passwords
    await wrapper.find('input#new-password').setValue(STRONG_PWD);
    await wrapper.find('input#confirm-password').setValue(STRONG_PWD);

    // Trigger form submit directly
    await wrapper.find('#create-wallet-password-form').trigger('submit');
    await wrapper.vm.$nextTick();

    // Should now show mnemonic grid
    expect(wrapper.findComponent(PepMnemonicGrid).exists()).toBe(true);
  });

  it('should call store.importWallet and navigate to dashboard on step 2 success', async () => {
    mockStore.importWallet.mockResolvedValue(undefined);

    const wrapper = mount(CreateWalletView, { global });

    // 1. Step 1
    await wrapper.find('input#new-password').setValue(STRONG_PWD);
    await wrapper.find('input#confirm-password').setValue(STRONG_PWD);
    await wrapper.find('#create-wallet-password-form').trigger('submit');
    await wrapper.vm.$nextTick();

    // 2. Step 2
    await wrapper.find('input[type="checkbox"]').setValue(true);
    await wrapper.find('#create-wallet-confirm-form').trigger('submit');

    expect(mockStore.importWallet).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
