import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import WelcomeView from './WelcomeView.vue';
import { useApp } from '@/composables/useApp';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp', () => ({
  useApp: vi.fn()
}));

// Components
const stubs = {
  PepWordmark: { template: '<div />' },
  PepForm: {
    template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="actions" /></form>'
  },
  PepPasswordInput: {
    name: 'PepPasswordInput',
    template:
      '<input type="password" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue']
  },
  PepLoadingButton: { template: '<button type="submit"><slot /></button>' },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
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

  it('should show create/import buttons when wallet is NOT created', async () => {
    mockStore.isCreated = false;
    const wrapper = mount(WelcomeView, {
      global: {
        stubs: {
          ...stubs,
          PepPageHeader: { template: '<div />', props: ['title', 'backTo', 'onBack'] }
        }
      }
    });

    expect(wrapper.text()).toContain('Create new wallet');
    expect(wrapper.text()).toContain('Import secret phrase');
  });

  it('should show password input and unlock button when wallet IS created', async () => {
    mockStore.isCreated = true;
    const wrapper = mount(WelcomeView, {
      global: {
        stubs: {
          ...stubs,
          PepPageHeader: { template: '<div />', props: ['title', 'backTo', 'onBack'] }
        }
      }
    });

    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Unlock');
  });

  it('should call store.unlock and navigate to dashboard on success', async () => {
    mockStore.isCreated = true;
    mockStore.unlock.mockResolvedValue(true);

    const wrapper = mount(WelcomeView, {
      global: {
        stubs: {
          ...stubs,
          PepPageHeader: { template: '<div />', props: ['title', 'backTo', 'onBack'] }
        }
      }
    });

    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');

    expect(mockStore.unlock).toHaveBeenCalledWith('password123');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
