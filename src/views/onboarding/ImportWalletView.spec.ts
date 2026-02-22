import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import ImportWalletView from './ImportWalletView.vue';
import { useApp } from '@/composables/useApp';
import { useImportWallet } from '@/composables/useImportWallet';

// UI Components
import PepForm from '@/components/ui/form/PepForm.vue';
import PepInputGroup from '@/components/ui/form/PepInputGroup.vue';
import PepPasswordFields from '@/components/ui/form/PepPasswordFields.vue';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp', () => ({
  useApp: vi.fn()
}));

// Mock useImportWallet
const mockImportWallet = {
  mnemonic: ref(''),
  invalidWords: ref([] as string[]),
  isValid: ref(false),
  importAction: vi.fn().mockResolvedValue(true),
  sanitizeMnemonic: vi.fn()
};

vi.mock('@/composables/useImportWallet', () => ({
  useImportWallet: () => mockImportWallet
}));

// Visual stubs only
const stubs = {
  PepIcon: { template: '<div />' }
};

const VALID_MNEMONIC =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

describe('ImportWalletView Logic', () => {
  let mockStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockImportWallet.mnemonic.value = '';
    mockImportWallet.invalidWords.value = [];
    mockImportWallet.isValid.value = false;

    mockStore = {
      importWallet: vi.fn(),
      isUnlocked: true,
      errors: {}
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockStore,

      route: { path: '/import' } as any
    });
  });

  const global = {
    stubs,
    components: {
      PepForm,
      PepInputGroup,
      PepPasswordFields,
      PepLoadingButton,
      PepMainLayout,
      PepPageHeader
    }
  };

  it('should call store.importWallet and navigate to dashboard on success', async () => {
    const wrapper = mount(ImportWalletView, { global });

    // 1. Fill mnemonic
    await wrapper.find('textarea').setValue(VALID_MNEMONIC);
    mockImportWallet.isValid.value = true;

    // 2. Fill passwords
    // Note: PepPasswordFields uses PepPasswordInput which has internal IDs
    await wrapper.find('input#new-password').setValue('Password123!');
    await wrapper.find('input#confirm-password').setValue('Password123!');

    // 3. Trigger import
    await wrapper.find('#import-wallet-form').trigger('submit');

    expect(mockImportWallet.importAction).toHaveBeenCalledWith('Password123!', 'Password123!');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
