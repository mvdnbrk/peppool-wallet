import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SendStepReview from './SendStepReview.vue';
import { useApp } from '@/composables/useApp';

// UI Components
import PepForm from '@/components/ui/form/PepForm.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';
import PepInputGroup from '@/components/ui/form/PepInputGroup.vue';

vi.mock('@/composables/useApp');

const stubs = {
  PepIcon: { template: '<div />' }
};

describe('SendStepReview Component', () => {
  const defaultProps = {
    form: {
      recipient: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh',
      password: '',
      errors: {},
      hasError: () => false
    },
    tx: {
      amountPep: '1.23'
    },
    displayFee: '0.001 PEP'
  };

  const global = {
    stubs,
    components: {
      PepForm,
      PepPasswordInput,
      PepInputGroup
    }
  };

  beforeEach(() => {
    vi.mocked(useApp).mockReturnValue({
      wallet: { isMnemonicLoaded: true }
    } as any);
  });

  it('should render transaction summary details', () => {
    const wrapper = mount(SendStepReview, {
      props: defaultProps,
      global
    });

    expect(wrapper.text()).toContain('1.23 PEP');
    expect(wrapper.text()).toContain(defaultProps.form.recipient);
    expect(wrapper.text()).toContain('0.001 PEP');
  });
});
