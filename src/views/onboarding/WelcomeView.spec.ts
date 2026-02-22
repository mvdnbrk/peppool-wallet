import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import WelcomeView from './WelcomeView.vue';
import { useApp } from '@/composables/useApp';
import { UX_DELAY_FAST } from '@/utils/constants';

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
      lockout: { lockoutUntil: 0, failedAttempts: 0, isLockedOut: false },
      unlock: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockStore,

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

  it('should show create/import buttons when wallet is NOT created', () => {
    mockStore.isCreated = false;
    const wrapper = mount(WelcomeView, { global });

    expect(wrapper.text()).toContain('Create new wallet');
    expect(wrapper.text()).toContain('Import secret phrase');
  });

  it('should navigate to create and import flows when wallet NOT created', async () => {
    mockStore.isCreated = false;
    const wrapper = mount(WelcomeView, { global });

    const buttons = wrapper.findAllComponents(PepButton);

    await buttons[0].trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/create');

    await buttons[1].trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/import');
  });

  it('should navigate to forgot password', async () => {
    mockStore.isCreated = true;
    const wrapper = mount(WelcomeView, { global });

    const forgotBtn = wrapper
      .findAll('button')
      .find((b) => b.text().includes('Forgot your password?'));
    await forgotBtn?.trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/forgot-password');
  });

  it('should call store.unlock and navigate to dashboard on success', async () => {
    const { useLockout } = await import('@/composables/useLockout');
    vi.mocked(useLockout).mockReturnValue({
      isLockedOut: ref(false),
      lockoutError: ref('')
    } as any);

    mockStore.isCreated = true;
    mockStore.unlock.mockResolvedValue(true);

    const wrapper = mount(WelcomeView, { global });
    await wrapper.find('input[type="password"]').setValue('password123');

    await wrapper.find('#welcome-unlock-form').trigger('submit');
    await flushPromises();

    expect(mockStore.unlock).toHaveBeenCalledWith('password123');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('should wait for minimum loading delay on failure', async () => {
    const { useLockout } = await import('@/composables/useLockout');
    vi.mocked(useLockout).mockReturnValue({
      isLockedOut: ref(false),
      lockoutError: ref('')
    } as any);

    vi.useFakeTimers();
    mockStore.isCreated = true;
    mockStore.unlock.mockResolvedValue(false);

    const wrapper = mount(WelcomeView, { global });
    await wrapper.find('input[type="password"]').setValue('wrong');

    wrapper.find('#welcome-unlock-form').trigger('submit');

    await vi.advanceTimersByTimeAsync(UX_DELAY_FAST);
    await flushPromises();

    expect(wrapper.text()).toContain('Incorrect password');
    vi.useRealTimers();
  });

  it('should clear password and error when lockout starts', async () => {
    const { useLockout } = await import('@/composables/useLockout');
    const isLockedOut = ref(false);
    vi.mocked(useLockout).mockReturnValue({
      isLockedOut,
      lockoutError: ref('Locked')
    } as any);

    mockStore.isCreated = true;
    const wrapper = mount(WelcomeView, { global });

    // @ts-ignore
    wrapper.vm.form.password = 'some-text';
    // @ts-ignore
    wrapper.vm.form.setError('general', 'Previous error');

    // Trigger lockout
    isLockedOut.value = true;
    await nextTick();

    // @ts-ignore
    expect(wrapper.vm.form.password).toBe('');
    // @ts-ignore
    expect(wrapper.vm.form.hasError()).toBe(false);
  });

  it('should handle generic errors in handleUnlock', async () => {
    const { useLockout } = await import('@/composables/useLockout');
    vi.mocked(useLockout).mockReturnValue({
      isLockedOut: ref(false),
      lockoutError: ref('')
    } as any);

    mockStore.isCreated = true;
    mockStore.unlock.mockRejectedValue(new Error('Boom'));

    const wrapper = mount(WelcomeView, { global });
    // @ts-ignore
    await wrapper.vm.handleUnlock();

    expect(wrapper.text()).toContain('Incorrect password');
  });
});
