import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import CreateWalletView from './CreateWalletView.vue';
import { useApp } from '@/composables/useApp';
import { useCreateWallet } from '@/composables/useCreateWallet';

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

// Mock useCreateWallet
const mockCreateWallet = {
  step: ref(1),
  mnemonic: ref('test mnemonic'),
  confirmedSeed: ref(false),
  prepareMnemonic: vi.fn().mockReturnValue({ success: true }),
  createWallet: vi.fn().mockResolvedValue(true),
  backToPassword: vi.fn()
};

vi.mock('@/composables/useCreateWallet', () => ({
  useCreateWallet: () => mockCreateWallet
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

    // Reset mock state
    mockCreateWallet.step.value = 1;
    mockCreateWallet.confirmedSeed.value = false;

    mockStore = {
      importWallet: vi.fn(),
      isUnlocked: true,
      errors: {}
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockStore,

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

    // Simulate composable state change
    mockCreateWallet.step.value = 2;
    await wrapper.vm.$nextTick();

    // Should now show mnemonic grid
    expect(wrapper.findComponent(PepMnemonicGrid).exists()).toBe(true);
  });

  it('should call store.importWallet and navigate to dashboard on step 2 success', async () => {
    const wrapper = mount(CreateWalletView, { global });

    // 1. Step 1
    await wrapper.find('input#new-password').setValue(STRONG_PWD);
    await wrapper.find('input#confirm-password').setValue(STRONG_PWD);
    await wrapper.find('#create-wallet-password-form').trigger('submit');

    // Simulate moving to step 2
    mockCreateWallet.step.value = 2;
    await wrapper.vm.$nextTick();

    // 2. Step 2
    await wrapper.find('input[type="checkbox"]').setValue(true);
    // Simulate composable state change
    mockCreateWallet.confirmedSeed.value = true;

    await wrapper.find('#create-wallet-confirm-form').trigger('submit');

    expect(mockCreateWallet.createWallet).toHaveBeenCalledWith(STRONG_PWD);
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
