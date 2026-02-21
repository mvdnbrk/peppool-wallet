import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ForgotPasswordView from './ForgotPasswordView.vue';
import { useApp } from '@/composables/useApp';
import PepButton from '@/components/ui/PepButton.vue';
import PepCheckbox from '@/components/ui/form/PepCheckbox.vue';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp');

describe('ForgotPasswordView', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      resetWallet: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockWallet
    } as any);
  });

  const global = {
    components: {
      PepButton,
      PepCheckbox
    }
  };

  it('should render and handle reset', async () => {
    const wrapper = mount(ForgotPasswordView, { global });
    expect(wrapper.text()).toContain('Forgot password');

    // 1. Enable button
    const checkbox = wrapper.findComponent({ name: 'PepCheckbox' });
    await checkbox.vm.$emit('update:modelValue', true);

    // 2. Click Reset
    await wrapper.findComponent(PepButton).trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
