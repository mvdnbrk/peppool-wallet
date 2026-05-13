import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PepInlineAddress from './PepInlineAddress.vue';

const ADDRESS = 'Pq3Qe41neyfA3yEHZie2DNzW55AnN2K3RP';
const OTHER_ADDRESS = 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU';

// Stub the wallet store so the component can self-detect "mine" without
// having to spin up the real Pinia store (which has side effects on init).
const walletAddress = { value: null as string | null };
vi.mock('@/stores/wallet', () => ({
  useWalletStore: () => ({
    get address() {
      return walletAddress.value;
    }
  })
}));

describe('PepInlineAddress', () => {
  it('renders the truncated address with the last 6 chars always visible', () => {
    walletAddress.value = null;
    const wrapper = mount(PepInlineAddress, { props: { address: ADDRESS } });
    // The "end" piece (last 6) is rendered in its own non-collapsible span
    // so it remains visible when the parent narrows. Verify both halves are
    // present in the rendered output.
    expect(wrapper.text()).toContain(ADDRESS.slice(0, -6));
    expect(wrapper.text()).toContain(ADDRESS.slice(-6));
  });

  it('exposes the full address via title for hover-to-reveal', () => {
    walletAddress.value = null;
    const wrapper = mount(PepInlineAddress, { props: { address: ADDRESS } });
    expect(wrapper.get('[title]').attributes('title')).toBe(ADDRESS);
  });

  it('auto-detects own address from the wallet store and shows "My Address"', () => {
    walletAddress.value = ADDRESS;
    const wrapper = mount(PepInlineAddress, { props: { address: ADDRESS } });
    expect(wrapper.text()).toContain('My Address');
  });

  it('does not show "My Address" when the address belongs to a counterparty', () => {
    walletAddress.value = OTHER_ADDRESS;
    const wrapper = mount(PepInlineAddress, { props: { address: ADDRESS } });
    expect(wrapper.text()).not.toContain('My Address');
  });

  it('renders a non-standard script fallback when address is null', () => {
    walletAddress.value = null;
    const wrapper = mount(PepInlineAddress, { props: { address: null } });
    expect(wrapper.text()).toContain('Non-standard script');
    expect(wrapper.text()).not.toContain('My Address');
  });
});
