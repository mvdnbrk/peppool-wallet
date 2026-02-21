import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
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
    const unlockBtn = wrapper.findComponent(PepLoadingButton);
    expect(unlockBtn.exists()).toBe(true);
    expect(unlockBtn.text()).toContain('Unlock');
    expect(unlockBtn.attributes('form')).toBe('welcome-unlock-form');
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

  it('should show error message on incorrect password', async () => {
    mockStore.isCreated = true;
    mockStore.unlock.mockResolvedValue(false);

    const wrapper = mount(WelcomeView, { global });

    await wrapper.find('input[type="password"]').setValue('wrong-pass');
    await wrapper.find('#welcome-unlock-form').trigger('submit');
    await flushPromises();

    expect(wrapper.text()).toContain('Incorrect password');
  });

  it('should show lockout error when locked out', async () => {
    // We need to mock useLockout return value
    const { useLockout } = await import('@/composables/useLockout');
    vi.mocked(useLockout).mockReturnValue({
      isLockedOut: ref(true),
      lockoutError: ref('Too many attempts')
    } as any);

    mockStore.isCreated = true;
    const wrapper = mount(WelcomeView, { global });

    expect(wrapper.text()).toContain('Too many attempts');
    expect(wrapper.findComponent(PepLoadingButton).text()).toContain('Locked');
  });
});
