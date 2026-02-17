import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PepHeader from './PepHeader.vue';

// Mock Router
const pushMock = vi.fn();
const backMock = vi.fn();
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
      back: backMock
    })
  };
});

// Mock PepIcon
const stubs = {
  PepIcon: { template: '<div />' }
};

describe('PepHeader UI Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call router.back() when no props provided', async () => {
    const wrapper = mount(PepHeader, {
      props: { title: 'Test Header' },
      global: { stubs }
    });

    await wrapper.find('button').trigger('click');
    expect(backMock).toHaveBeenCalled();
  });

  it('should call router.push() when backTo prop is provided', async () => {
    const wrapper = mount(PepHeader, {
      props: { title: 'Test Header', backTo: '/dashboard' },
      global: { stubs }
    });

    await wrapper.find('button').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('should call onBack callback when provided', async () => {
    const onBack = vi.fn();
    const wrapper = mount(PepHeader, {
      props: { title: 'Test Header', onBack },
      global: { stubs }
    });

    await wrapper.find('button').trigger('click');
    expect(onBack).toHaveBeenCalled();
    expect(backMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
