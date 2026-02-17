import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PepCheckbox from './PepCheckbox.vue';

// Mock PepIcon
const stubs = {
  PepIcon: { template: '<div />' }
};

describe('PepCheckbox UI Component', () => {
  it('should emit update:modelValue when clicked', async () => {
    const wrapper = mount(PepCheckbox, {
      props: { modelValue: false, id: 'test', label: 'Test Label' },
      global: { stubs }
    });

    await wrapper.find('input').setValue(true);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('should reflect modelValue state in input', () => {
    const wrapper = mount(PepCheckbox, {
      props: { modelValue: true, id: 'test', label: 'Test Label' },
      global: { stubs }
    });

    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true);
  });

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(PepCheckbox, {
      props: { modelValue: false, id: 'test', label: 'Test Label', disabled: true },
      global: { stubs }
    });

    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.find('label').classes()).toContain('cursor-not-allowed');
  });
});
