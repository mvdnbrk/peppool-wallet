import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepSuccessState from './PepSuccessState.vue';

const stubs = {
  PepIcon: { template: '<div />' }
};

describe('PepSuccessState', () => {
  it('renders title and description', () => {
    const wrapper = mount(PepSuccessState, {
      props: {
        title: 'Success!',
        description: 'Operation completed.'
      },
      global: { stubs }
    });

    expect(wrapper.find('h3').text()).toBe('Success!');
    expect(wrapper.find('p').text()).toBe('Operation completed.');
  });

  it('renders default slot content', () => {
    const wrapper = mount(PepSuccessState, {
      props: { title: 'Success' },
      slots: {
        default: '<div class="extra-content">Extra</div>'
      },
      global: { stubs }
    });

    expect(wrapper.find('.extra-content').exists()).toBe(true);
  });
});
