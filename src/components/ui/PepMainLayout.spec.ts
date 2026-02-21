import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepMainLayout from './PepMainLayout.vue';

describe('PepMainLayout', () => {
  it('should render all slots when provided', () => {
    const wrapper = mount(PepMainLayout, {
      slots: {
        header: '<div id="test-header">Header</div>',
        default: '<div id="test-content">Content</div>',
        actions: '<div id="test-actions">Actions</div>'
      }
    });

    expect(wrapper.find('#test-header').exists()).toBe(true);
    expect(wrapper.find('#test-content').exists()).toBe(true);
    expect(wrapper.find('#test-actions').exists()).toBe(true);
    expect(wrapper.find('main').classes()).not.toContain('pt-4');
  });

  it('should apply pt-4 to main when header slot is missing', () => {
    const wrapper = mount(PepMainLayout, {
      slots: {
        default: 'Content'
      }
    });

    expect(wrapper.find('header').exists()).toBe(false);
    expect(wrapper.find('main').classes()).toContain('pt-4');
  });

  it('should not render actions area when slot is missing', () => {
    const wrapper = mount(PepMainLayout, {
      slots: {
        default: 'Content'
      }
    });

    expect(wrapper.find('.pt-6').exists()).toBe(false);
  });
});
