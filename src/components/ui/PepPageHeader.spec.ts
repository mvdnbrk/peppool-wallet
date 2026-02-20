import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PepPageHeader from './PepPageHeader.vue';
import { createTestingPinia } from '@pinia/testing';
import { pushMock, backMock } from '@/composables/__mocks__/useApp';

// Mock PepIcon
const stubs = {
  PepIcon: { template: '<div />' }
};

describe('PepPageHeader UI Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call router.back() when no props provided', async () => {
    const wrapper = mount(PepPageHeader, {
      props: { title: 'Test Header' },
      global: { stubs, plugins: [createTestingPinia()] }
    });

    await wrapper.find('#header-back-button').trigger('click');
    expect(backMock).toHaveBeenCalled();
  });

  it('should call router.push() when backTo prop is provided', async () => {
    const wrapper = mount(PepPageHeader, {
      props: { title: 'Test Header', backTo: '/dashboard' },
      global: { stubs, plugins: [createTestingPinia()] }
    });

    await wrapper.find('#header-back-button').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('should call onBack callback when provided', async () => {
    const onBack = vi.fn();
    const wrapper = mount(PepPageHeader, {
      props: { title: 'Test Header', onBack },
      global: { stubs, plugins: [createTestingPinia()] }
    });

    await wrapper.find('#header-back-button').trigger('click');
    expect(onBack).toHaveBeenCalled();
    // These mocks are from useApp, so they shouldn't be called if onBack is provided
    expect(backMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
