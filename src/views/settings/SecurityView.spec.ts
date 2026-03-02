import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SecurityView from './SecurityView.vue';
import { useApp } from '@/composables/useApp';
import PepListItem from '@/components/ui/list/PepListItem.vue';
import PepButton from '@/components/ui/PepButton.vue';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp');

describe('SecurityView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any
    } as any);
  });

  const global = {
    components: {
      PepListItem,
      PepButton
    }
  };

  it('should navigate to security sub-sections', async () => {
    const wrapper = mount(SecurityView, { global });

    await wrapper.find('#security-change-password-item').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/change-password');

    await wrapper.find('#security-show-mnemonic-item').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/show-mnemonic');

    await wrapper.find('#security-connected-sites-item').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/settings/connected-sites');

    await wrapper.find('#security-reset-wallet-button').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/reset-wallet');
  });
});
