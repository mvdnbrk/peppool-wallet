import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepInput from './PepInput.vue';
import PepIcon from '../PepIcon.vue';
import PepInputGroup from './PepInputGroup.vue';

// Global registration mock for component tests
const globalOptions = {
  global: {
    components: {
      PepIcon,
      PepInputGroup
    }
  }
};

describe('PepInput Component', () => {
  it('renders label when provided', () => {
    const wrapper = mount(PepInput, {
      ...globalOptions,
      props: { label: 'Username', id: 'user', modelValue: '' }
    });
    expect(wrapper.text()).toContain('Username');
  });

  it('updates model value on input', async () => {
    const wrapper = mount(PepInput, {
      ...globalOptions,
      props: { modelValue: '', id: 'user' }
    });
    const input = wrapper.find('input');
    await input.setValue('new value');
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value']);
  });

  it('shows error state correctly', () => {
    const wrapper = mount(PepInput, {
      ...globalOptions,
      props: { error: 'Invalid input', id: 'user', modelValue: '' }
    });
    expect(wrapper.text()).toContain('Invalid input');
    expect(wrapper.findComponent(PepIcon).exists()).toBe(true);
    expect(wrapper.find('input').classes()).toContain('text-red-400');
  });
});
