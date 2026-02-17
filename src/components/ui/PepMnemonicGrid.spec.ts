import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepMnemonicGrid from './PepMnemonicGrid.vue';

describe('PepMnemonicGrid UI Component', () => {
  it('should render all mnemonic words with their indices', () => {
    const mnemonic = 'word1 word2 word3';
    const wrapper = mount(PepMnemonicGrid, {
      props: { mnemonic }
    });

    const words = wrapper.findAll('span.text-offwhite');
    expect(words).toHaveLength(3);
    expect(words[0].text()).toBe('word1');
    expect(words[1].text()).toBe('word2');
    expect(words[2].text()).toBe('word3');

    const indices = wrapper.findAll('span.text-pep-green-light');
    expect(indices[0].text()).toBe('1');
    expect(indices[1].text()).toBe('2');
    expect(indices[2].text()).toBe('3');
  });
});
