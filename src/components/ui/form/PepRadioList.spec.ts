import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepRadioList from './PepRadioList.vue';

const stubs = {
  PepIcon: { template: '<div />' }
};

describe('PepRadioList', () => {
  const options = [
    { label: 'Option 1', value: 'opt1', description: 'Desc 1' },
    { label: 'Option 2', value: 'opt2' }
  ];

  it('renders all options', () => {
    const wrapper = mount(PepRadioList, {
      props: {
        modelValue: 'opt1',
        options,
        name: 'test-radio'
      },
      global: { stubs }
    });

    expect(wrapper.text()).toContain('Option 1');
    expect(wrapper.text()).toContain('Desc 1');
    expect(wrapper.text()).toContain('Option 2');
    expect(wrapper.findAll('input[type="radio"]').length).toBe(2);
  });

  it('emits update:modelValue when an option is selected', async () => {
    const wrapper = mount(PepRadioList, {
      props: {
        modelValue: 'opt1',
        options,
        name: 'test-radio'
      },
      global: { stubs }
    });

    const secondRadio = wrapper.findAll('input[type="radio"]')[1];
    await secondRadio.trigger('change');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['opt2']);
  });

  it('shows checked state correctly', () => {
    const wrapper = mount(PepRadioList, {
      props: {
        modelValue: 'opt2',
        options,
        name: 'test-radio'
      },
      global: { stubs }
    });

    const radios = wrapper.findAll('input[type="radio"]');
    expect((radios[0].element as HTMLInputElement).checked).toBe(false);
    expect((radios[1].element as HTMLInputElement).checked).toBe(true);
  });
});
