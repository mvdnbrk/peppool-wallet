import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PepAmountInput from './PepAmountInput.vue';
import { createTestingPinia } from '@pinia/testing';

// Mock components
const stubs = {
  PepInput: {
    template: '<div><slot name="prefix" /><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /><slot name="suffix" /></div>',
    props: ['modelValue']
  },
  PepIcon: { template: '<div />' }
};

describe('PepAmountInput UI Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should emit update:ribbits when text input changes (PEP mode)', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: false },
      global: { 
        stubs,
        plugins: [createTestingPinia()]
      }
    });

    const input = wrapper.find('input');
    await input.setValue('1'); // 1 PEP
    
    expect(wrapper.emitted('update:ribbits')?.[0]).toEqual([100_000_000]);
  });

  it('should emit update:ribbits when text input changes (Fiat mode)', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: true }, // 1 PEP = $10
      global: { 
        stubs,
        plugins: [createTestingPinia()]
      }
    });

    const input = wrapper.find('input');
    await input.setValue('5'); // $5 = 0.5 PEP = 50,000,000 ribbits
    
    expect(wrapper.emitted('update:ribbits')?.[0]).toEqual([50_000_000]);
  });

  it('should normalize commas to dots', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: false },
      global: { 
        stubs,
        plugins: [createTestingPinia()]
      }
    });

    const input = wrapper.find('input');
    await input.setValue('1,5');
    
    // Check internal state
    // @ts-ignore
    expect(wrapper.vm.inputAmount).toBe('1.5');
    expect(wrapper.emitted('update:ribbits')?.[0]).toEqual([150_000_000]);
  });

  it('should emit change-max: false when user types', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 100, price: 10, isFiatMode: false },
      global: { 
        stubs,
        plugins: [createTestingPinia()]
      }
    });

    await wrapper.find('input').setValue('101');
    expect(wrapper.emitted('change-max')?.[0]).toEqual([false]);
  });
});
