import { describe, it, expect } from 'vitest';
import html from '../approval.html?raw';

describe('approval.html', () => {
  it('uses viewport-relative sizing so the native title bar does not push footer offscreen', () => {
    expect(html).toContain('h-screen');
    expect(html).toContain('w-screen');
    expect(html).not.toMatch(/h-\[\d+px\]/);
  });

  it('passes h-full to #app so PepMainLayout fills the viewport', () => {
    expect(html).toMatch(/id="app"[^>]*class="[^"]*h-full[^"]*"/);
  });
});
