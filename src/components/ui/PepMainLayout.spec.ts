import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PepMainLayout from './PepMainLayout.vue';
import { useApp } from '@/composables/useApp';

vi.mock('@/composables/useApp');

describe('PepMainLayout', () => {
  beforeEach(() => {
    // Default: global header hidden (onboarding route)
    vi.mocked(useApp).mockReturnValue({
      route: { path: '/' } as any
    } as any);
  });

  it('should always render a <main> element with pt-6', () => {
    const wrapper = mount(PepMainLayout, {
      slots: { default: '<div>Content</div>' }
    });

    expect(wrapper.find('main').exists()).toBe(true);
    expect(wrapper.find('main').classes()).toContain('pt-6');
  });

  it('should render <header> when global header is visible', () => {
    vi.mocked(useApp).mockReturnValue({
      route: { path: '/dashboard' } as any
    } as any);

    const wrapper = mount(PepMainLayout, {
      slots: { default: '<div>Content</div>' }
    });

    expect(wrapper.find('header').exists()).toBe(true);
  });

  it('should not render <header> when on hidden route', () => {
    const wrapper = mount(PepMainLayout, {
      slots: { default: '<div>Content</div>' }
    });

    expect(wrapper.find('header').exists()).toBe(false);
  });

  it('should render <nav> when page header slot is provided', () => {
    const wrapper = mount(PepMainLayout, {
      slots: {
        header: '<div id="test-nav">Page Nav</div>',
        default: '<div>Content</div>'
      }
    });

    expect(wrapper.find('nav').exists()).toBe(true);
    expect(wrapper.find('#test-nav').exists()).toBe(true);
    expect(wrapper.find('nav').classes()).toContain('pt-6');
  });

  it('should not render <nav> when page header slot is missing', () => {
    const wrapper = mount(PepMainLayout, {
      slots: { default: '<div>Content</div>' }
    });

    expect(wrapper.find('nav').exists()).toBe(false);
  });

  it('should render <footer> when actions slot is provided', () => {
    const wrapper = mount(PepMainLayout, {
      slots: {
        default: '<div>Content</div>',
        actions: '<button>Submit</button>'
      }
    });

    expect(wrapper.find('footer').exists()).toBe(true);
    expect(wrapper.find('footer button').exists()).toBe(true);
  });

  it('should not render <footer> when actions slot is missing', () => {
    const wrapper = mount(PepMainLayout, {
      slots: { default: '<div>Content</div>' }
    });

    expect(wrapper.find('footer').exists()).toBe(false);
  });

  it('should render all four semantic sections when fully populated', () => {
    vi.mocked(useApp).mockReturnValue({
      route: { path: '/dashboard' } as any
    } as any);

    const wrapper = mount(PepMainLayout, {
      slots: {
        header: '<div>Page Header</div>',
        default: '<div>Content</div>',
        actions: '<button>Action</button>'
      }
    });

    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.find('nav').exists()).toBe(true);
    expect(wrapper.find('main').exists()).toBe(true);
    expect(wrapper.find('footer').exists()).toBe(true);
  });
});
