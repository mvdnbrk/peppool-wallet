import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PepLoadingButton from './PepLoadingButton.vue';

// Mock PepButton
const stubs = {
  PepButton: {
    template: '<button :class="{ loading: loading }"><slot /></button>',
    props: ['loading']
  }
};

describe('PepLoadingButton UI Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should show loading state immediately', async () => {
    const wrapper = mount(PepLoadingButton, {
      props: { loading: true },
      global: { stubs }
    });

    const btn = wrapper.find('button');
    expect(btn.classes()).toContain('loading');
  });

  it('should stay in loading state until minLoadingMs has passed', async () => {
    const wrapper = mount(PepLoadingButton, {
      props: { loading: true, minLoadingMs: 1000 },
      global: { stubs }
    });

    // 1. Start loading
    expect(wrapper.find('button').classes()).toContain('loading');

    // 2. Stop loading prop immediately
    await wrapper.setProps({ loading: false });
    
    // 3. Verify it is STILL in loading state because of minLoadingMs
    expect(wrapper.find('button').classes()).toContain('loading');

    // 4. Advance time
    vi.advanceTimersByTime(500);
    expect(wrapper.find('button').classes()).toContain('loading');

    // 5. Advance past the limit
    vi.advanceTimersByTime(501);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('button').classes()).not.toContain('loading');
  });
});
