import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SendStepForm from './SendStepForm.vue';

// UI Components
import PepForm from '@/components/ui/form/PepForm.vue';
import PepInput from '@/components/ui/form/PepInput.vue';
import PepAmountInput from '@/components/ui/form/PepAmountInput.vue';
import PepInputGroup from '@/components/ui/form/PepInputGroup.vue';

const stubs = {
  PepIcon: { template: '<div />' }
};

describe('SendStepForm Component', () => {
  const defaultProps = {
    form: {
      recipient: '',
      amountRibbits: 0,
      isFiatMode: false,
      isMax: false,
      errors: {},
      hasError: () => false,
      clearError: vi.fn(),
      setError: vi.fn()
    },
    isLoadingRequirements: false,
    isInsufficientFunds: false,
    currentPrice: 10,
    displayBalance: '10 PEP',
    displayFee: '0.001 PEP'
  };

  const global = {
    stubs,
    components: {
      PepForm,
      PepInput,
      PepAmountInput,
      PepInputGroup
    }
  };

  it('should emit set-max when MAX button is clicked', async () => {
    const wrapper = mount(SendStepForm, {
      props: defaultProps,
      global
    });

    await wrapper.find('#send-max-button').trigger('click');
    expect(wrapper.emitted('set-max')).toBeTruthy();
  });

  it('should emit address-blur when recipient input blurs', async () => {
    const wrapper = mount(SendStepForm, {
      props: defaultProps,
      global
    });

    const input = wrapper.find('input#recipient');
    await input.trigger('blur');
    expect(wrapper.emitted('address-blur')).toBeTruthy();
  });
});
