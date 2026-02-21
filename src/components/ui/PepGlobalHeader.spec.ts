import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PepGlobalHeader from './PepGlobalHeader.vue';
import { useApp } from '@/composables/useApp';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp');

describe('PepGlobalHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      route: { path: '/dashboard' } as any
    } as any);
  });

  it('should navigate to dashboard on logo click', async () => {
    const wrapper = mount(PepGlobalHeader);
    await wrapper.find('.group.cursor-pointer').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('should navigate to settings on button click', async () => {
    const wrapper = mount(PepGlobalHeader);
    await wrapper.find('#app-settings-button').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/settings');
  });
});
