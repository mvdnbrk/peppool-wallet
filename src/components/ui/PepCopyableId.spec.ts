import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepCopyableId from './PepCopyableId.vue';

const stubs = {
  PepIcon: { template: '<div />' },
  PepInputGroup: {
    template: '<div><label>{{ label }}</label><slot /></div>',
    props: ['label']
  }
};

describe('PepCopyableId', () => {
  const TEST_ID = 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3';

  it('renders truncated ID and label', () => {
    const wrapper = mount(PepCopyableId, {
      props: {
        id: TEST_ID,
        label: 'My Transaction ID'
      },
      global: { stubs }
    });

    expect(wrapper.text()).toContain('My Transaction ID');
    // Truncated start
    expect(wrapper.text()).toContain('f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b');
    // Truncated end
    expect(wrapper.text()).toContain('5f9ef3');
  });

  it('does not render a label when not provided', () => {
    const wrapper = mount(PepCopyableId, {
      props: { id: TEST_ID },
      global: { stubs }
    });

    expect(wrapper.find('label').exists()).toBe(false);
  });

  it('contains the el-copyable element with full ID', () => {
    const wrapper = mount(PepCopyableId, {
      props: { id: TEST_ID },
      global: { stubs }
    });

    const copyable = wrapper.find('el-copyable');
    expect(copyable.exists()).toBe(true);
    expect(copyable.attributes('id')).toBe(TEST_ID);
    expect(copyable.find('.hidden').text()).toBe(TEST_ID);

    const button = wrapper.find(`#${TEST_ID}-copy`);
    expect(button.exists()).toBe(true);
  });
});
