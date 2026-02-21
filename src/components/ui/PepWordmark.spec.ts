import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepWordmark from './PepWordmark.vue';

describe('PepWordmark', () => {
  it('should render correctly with default size', () => {
    const wrapper = mount(PepWordmark);
    expect(wrapper.text()).toContain('Peppoolwallet');
    expect(wrapper.classes()).toContain('text-2xl');
  });

  it('should apply size classes correctly', () => {
    const sizes = [
      { size: 'sm', expected: 'text-xl' },
      { size: 'md', expected: 'text-2xl' },
      { size: 'lg', expected: 'text-3xl' },
      { size: 'xl', expected: 'text-4xl' }
    ] as const;

    for (const { size, expected } of sizes) {
      const wrapper = mount(PepWordmark, { props: { size } });
      expect(wrapper.classes()).toContain(expected);
    }
  });

  it('should adjust wallet text size for xl', () => {
    const xl = mount(PepWordmark, { props: { size: 'xl' } });
    expect(xl.find('.text-xl').exists()).toBe(true); // "wallet" span

    const sm = mount(PepWordmark, { props: { size: 'sm' } });
    expect(sm.find('.text-xs').exists()).toBe(true); // "wallet" span
  });
});
