import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepIcon from './PepIcon.vue';

describe('PepIcon', () => {
  const iconNames = [
    'back',
    'chevron-right',
    'settings',
    'refresh',
    'copy',
    'check',
    'eye',
    'eye-slash',
    'error',
    'clear',
    'swap',
    'checkmark-circle',
    'external-link'
  ] as const;

  it('should render all icon variants', () => {
    for (const name of iconNames) {
      const wrapper = mount(PepIcon, { props: { name } });
      expect(wrapper.find('svg').exists()).toBe(true);
      expect(wrapper.find('path').exists()).toBe(true);
    }
  });

  it('should apply correct viewBox based on name', () => {
    const cases = [
      { name: 'settings', expected: '0 0 512 512' },
      { name: 'copy', expected: '0 0 448 512' },
      { name: 'error', expected: '0 0 16 16' },
      { name: 'eye', expected: '0 0 24 24' },
      { name: 'back', expected: '0 0 256 256' }
    ];

    for (const { name, expected } of cases) {
      const wrapper = mount(PepIcon, { props: { name: name as any } });
      expect(wrapper.find('svg').attributes('viewBox')).toBe(expected);
    }
  });

  it('should apply correct fill and stroke based on name', () => {
    // eye should have stroke and no fill on path
    const eye = mount(PepIcon, { props: { name: 'eye' } });
    expect(eye.find('path').attributes('stroke')).toBe('currentColor');
    expect(eye.find('path').attributes('fill')).toBe('none');

    // check should have no stroke and fill
    const check = mount(PepIcon, { props: { name: 'check' } });
    expect(check.find('path').attributes('stroke')).toBe('none');
    expect(check.find('path').attributes('fill')).toBe('currentColor');

    // swap should have stroke and no fill
    const swap = mount(PepIcon, { props: { name: 'swap' } });
    expect(swap.find('path').attributes('stroke')).toBe('currentColor');
    expect(swap.find('path').attributes('fill')).toBe('none');
  });

  it('should apply custom size and class', () => {
    const wrapper = mount(PepIcon, {
      props: { name: 'check', size: 48, class: 'custom-class' }
    });
    expect(wrapper.find('svg').attributes('width')).toBe('48');
    expect(wrapper.find('svg').attributes('height')).toBe('48');
    expect(wrapper.find('svg').classes()).toContain('custom-class');
  });
});
