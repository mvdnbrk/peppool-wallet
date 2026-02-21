import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import WelcomeView from './WelcomeView.vue';
import { useApp } from '@/composables/useApp';

// UI Components
import PepForm from '@/components/ui/form/PepForm.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp', () => ({
  useApp: vi.fn()
}));

// Visual stubs only
const stubs = {
  PepWordmark: { template: '<div />' },
  PepIcon: { template: '<div />' }
};

describe('WelcomeView Logic', () => {
  let mockStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      isCreated: false,
      lockoutUntil: 0,
      unlock: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockStore,
      requireUnlock: vi.fn(),
      route: { path: '/' } as any
    });
  });

  const global = {
    stubs,
    components: {
      PepForm,
      PepPasswordInput,
      PepLoadingButton,
      PepButton,
      PepMainLayout,
      PepPageHeader
    }
  };

  it('should show create/import buttons when wallet is NOT created', async () => {
    mockStore.isCreated = false;
    const wrapper = mount(WelcomeView, { global });

    expect(wrapper.text()).toContain('Create new wallet');
    expect(wrapper.text()).toContain('Import secret phrase');
  });

  it('should show password input and unlock button when wallet IS created', async () => {
    mockStore.isCreated = true;
    const wrapper = mount(WelcomeView, { global });

    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Unlock');
  });

  it('should call store.unlock and navigate to dashboard on success', async () => {
    mockStore.isCreated = true;
    mockStore.unlock.mockResolvedValue(true);

    const wrapper = mount(WelcomeView, { global });

    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('#welcome-unlock-form').trigger('submit');

    expect(mockStore.unlock).toHaveBeenCalledWith('password123');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
