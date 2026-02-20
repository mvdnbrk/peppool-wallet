import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepPasswordInput from './PepPasswordInput.vue';

// Mock global components
const stubs = {
  PepInputGroup: {
    template: '<div><label v-if="label">{{ label }}</label><slot /></div>',
    props: ['label']
  },
  PepIcon: { 
    template: '<div class="pep-icon-stub" :data-name="name" />',
    props: ['name']
  }
};

describe('PepPasswordInput UI Component', () => {
  it('should toggle password visibility and icon name when button clicked', async () => {
    const wrapper = mount(PepPasswordInput, {
      props: { id: 'test', modelValue: 'secret' },
      global: { stubs }
    });

    const input = wrapper.find('input');
    const icon = wrapper.find('.pep-icon-stub');
    
    // Initial: Hidden (***) -> eye-slash
    expect(input.attributes('type')).toBe('password');
    expect(icon.attributes('data-name')).toBe('eye-slash');

    const toggleBtn = wrapper.find('button');
    await toggleBtn.trigger('click');
    
    // Click 1: Shown (text) -> eye
    expect(input.attributes('type')).toBe('text');
    expect(icon.attributes('data-name')).toBe('eye');

    await toggleBtn.trigger('click');
    
    // Click 2: Hidden again -> eye-slash
    expect(input.attributes('type')).toBe('password');
    expect(icon.attributes('data-name')).toBe('eye-slash');
  });

  it('should emit update:modelValue on input', async () => {
    const wrapper = mount(PepPasswordInput, {
      props: { id: 'test', modelValue: '' },
      global: { stubs }
    });

    const input = wrapper.find('input');
    await input.setValue('new-password');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new-password']);
  });

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(PepPasswordInput, {
      props: { id: 'test', modelValue: '', disabled: true },
      global: { stubs }
    });

    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('should show error state when error prop is provided', () => {
    const wrapper = mount(PepPasswordInput, {
      props: { id: 'test', modelValue: '', error: 'Incorrect password' },
      global: { stubs }
    });

    expect(wrapper.find('input').classes()).toContain('text-red-400');
    expect(wrapper.text()).toContain('Incorrect password');
  });
});
