import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import ShowMnemonicView from './ShowMnemonicView.vue';
import { useApp } from '@/composables/useApp';
import { useShowMnemonic } from '@/composables/useShowMnemonic';

// UI Components
import PepForm from '@/components/ui/form/PepForm.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';
import PepMnemonicGrid from '@/components/ui/PepMnemonicGrid.vue';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp');

// Mock useShowMnemonic
const mockShowMnemonic = {
  step: ref(1),
  mnemonic: ref(''),
  error: ref(''),
  reveal: vi.fn().mockResolvedValue(true)
};

vi.mock('@/composables/useShowMnemonic', () => ({
  useShowMnemonic: () => mockShowMnemonic
}));

// Visual stubs only
const stubs = {
  PepIcon: { template: '<div />' }
};

describe('ShowMnemonicView Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockShowMnemonic.step.value = 1;
    mockShowMnemonic.mnemonic.value = '';
    mockShowMnemonic.error.value = '';

    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock, back: vi.fn() } as any,
      wallet: {} as any,
      vault: {
        isUnlocked: true,
        plaintextMnemonic: 'test mnemonic',
        updateVault: vi.fn(),
        lock: vi.fn(),
        resetLockTimer: vi.fn()
      } as any,
      account: { activeAddress: 'test' } as any,
      activity: { refreshBalance: vi.fn() } as any,
      route: { path: '/show-mnemonic' } as any
    });
  });

  const global = {
    stubs,
    components: {
      PepForm,
      PepPasswordInput,
      PepMnemonicGrid,
      PepLoadingButton,
      PepButton,
      PepMainLayout,
      PepPageHeader
    }
  };

  it('should show password input at step 1', () => {
    const wrapper = mount(ShowMnemonicView, { global });
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Reveal Phrase');
  });

  it('should call reveal when reveal button is clicked', async () => {
    const wrapper = mount(ShowMnemonicView, { global });
    await wrapper.find('input[type="password"]').setValue('correct-pass');
    await wrapper.find('#reveal-button').trigger('click');

    expect(mockShowMnemonic.reveal).toHaveBeenCalledWith('correct-pass');
  });

  it('should show mnemonic grid at step 2', async () => {
    mockShowMnemonic.step.value = 2;
    mockShowMnemonic.mnemonic.value = 'word1 word2 word3';

    const wrapper = mount(ShowMnemonicView, { global });

    expect(wrapper.findComponent(PepMnemonicGrid).exists()).toBe(true);
    expect(wrapper.text()).toContain('SECURITY WARNING');
    expect(wrapper.text()).toContain('Close');
  });

  it('should show error message from composable', async () => {
    mockShowMnemonic.error.value = 'Incorrect password';
    const wrapper = mount(ShowMnemonicView, { global });

    expect(wrapper.text()).toContain('Incorrect password');
  });

  it('should disable reveal button when error is present', async () => {
    mockShowMnemonic.error.value = 'Some error';
    const wrapper = mount(ShowMnemonicView, { global });

    const button = wrapper.findComponent(PepLoadingButton);
    expect(button.props('disabled')).toBe(true);
  });

  it('should clear error message when user starts typing', async () => {
    mockShowMnemonic.error.value = 'Incorrect password';
    const wrapper = mount(ShowMnemonicView, { global });

    expect(wrapper.text()).toContain('Incorrect password');

    await wrapper.find('input[type="password"]').setValue('new-char');

    expect(mockShowMnemonic.error.value).toBe('');
    expect(wrapper.text()).not.toContain('Incorrect password');
  });

  it('should navigate to dashboard when Close is clicked', async () => {
    mockShowMnemonic.step.value = 2;
    const wrapper = mount(ShowMnemonicView, { global });

    const closeBtn = wrapper.findAll('button').find((b) => b.text().includes('Close'));
    await closeBtn?.trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
