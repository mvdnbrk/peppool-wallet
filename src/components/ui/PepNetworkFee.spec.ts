import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepNetworkFee from './PepNetworkFee.vue';

describe('PepNetworkFee', () => {
  it('renders the label and fee value', () => {
    const wrapper = mount(PepNetworkFee, { props: { fee: '0.00226 PEP' } });

    expect(wrapper.text()).toContain('Network Fee');
    expect(wrapper.text()).toContain('0.00226 PEP');
  });

  it('defaults to the stacked layout', () => {
    const wrapper = mount(PepNetworkFee, { props: { fee: '0.001 PEP' } });

    expect(wrapper.find('.flex-col').exists()).toBe(true);
    expect(wrapper.find('.justify-between').exists()).toBe(false);
  });

  it('uses an inline layout when requested', () => {
    const wrapper = mount(PepNetworkFee, {
      props: { fee: '0.001 PEP', layout: 'inline' }
    });

    expect(wrapper.find('.justify-between').exists()).toBe(true);
    expect(wrapper.find('.flex-col').exists()).toBe(false);
  });
});
