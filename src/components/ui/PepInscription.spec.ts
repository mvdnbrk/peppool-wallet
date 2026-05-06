import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepInscription from './PepInscription.vue';
import { inscriptionContentUrl } from '@/utils/inscriptions';

describe('PepInscription', () => {
  const id = 'abc123i0';

  it('renders an <img> for image content types', () => {
    const wrapper = mount(PepInscription, {
      props: { id, contentType: 'image/png' }
    });
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(inscriptionContentUrl(id));
    expect(img.attributes('loading')).toBe('lazy');
  });

  it('renders a <video> for video content types', () => {
    const wrapper = mount(PepInscription, {
      props: { id, contentType: 'video/mp4' }
    });
    expect(wrapper.find('video').exists()).toBe(true);
  });

  it('renders an <iframe> with no allow-scripts when interactive=false (grid mode)', () => {
    const wrapper = mount(PepInscription, {
      props: { id, contentType: 'text/html', interactive: false }
    });
    const iframe = wrapper.find('iframe');
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes('sandbox') ?? '').not.toContain('allow-scripts');
  });

  it('enables allow-scripts on the sandboxed iframe only when interactive=true', () => {
    const wrapper = mount(PepInscription, {
      props: { id, contentType: 'text/html', interactive: true }
    });
    const iframe = wrapper.find('iframe');
    expect(iframe.attributes('sandbox')).toContain('allow-scripts');
  });

  it('does not render an audio element in non-interactive (grid) mode', () => {
    const wrapper = mount(PepInscription, {
      props: { id, contentType: 'audio/mpeg', interactive: false }
    });
    expect(wrapper.find('audio').exists()).toBe(false);
  });

  it('falls back to a labeled placeholder for unknown content types', () => {
    const wrapper = mount(PepInscription, {
      props: { id, contentType: 'application/octet-stream' }
    });
    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.text()).toContain('application/octet-stream');
  });
});
