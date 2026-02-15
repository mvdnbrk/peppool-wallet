import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepButton from './PepButton.vue';
import PepSpinner from './PepSpinner.vue';

const globalOptions = {
  global: {
    components: {
      PepSpinner
    }
  }
};

describe('PepButton Component', () => {
  it('renders slot content correctly', () => {
    const wrapper = mount(PepButton, {
      ...globalOptions,
      slots: { default: 'Click Me' }
    });
    expect(wrapper.text()).toBe('Click Me');
  });

  it('applies correct variant classes', () => {
    const variants = {
      primary: 'bg-pep-green',
      secondary: 'bg-slate-800',
      danger: 'bg-red-600'
    };

    for (const [variant, expectedClass] of Object.entries(variants)) {
      const wrapper = mount(PepButton, {
        ...globalOptions,
        props: { variant: variant as any }
      });
      expect(wrapper.classes()).toContain(expectedClass);
    }
  });

  it('is disabled when the disabled prop is true', () => {
    const wrapper = mount(PepButton, {
      ...globalOptions,
      props: { disabled: true }
    });
    expect(wrapper.attributes()).toHaveProperty('disabled');
    expect(wrapper.classes()).toContain('disabled:opacity-50');
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(PepButton, { ...globalOptions });
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('does not emit click when disabled', async () => {
    const wrapper = mount(PepButton, {
      ...globalOptions,
      props: { disabled: true }
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('click');
  });
});
