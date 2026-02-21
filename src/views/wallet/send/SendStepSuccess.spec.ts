import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SendStepSuccess from './SendStepSuccess.vue';

// UI Components
import PepSuccessState from '@/components/ui/PepSuccessState.vue';
import PepCopyableId from '@/components/ui/PepCopyableId.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepInputGroup from '@/components/ui/form/PepInputGroup.vue';

const stubs = {
  PepIcon: { template: '<div />' }
};

describe('SendStepSuccess Component', () => {
  const defaultProps = {
    txid: 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3'
  };

  const global = {
    stubs,
    components: {
      PepSuccessState,
      PepCopyableId,
      PepInputGroup
    }
  };

  it('should render success message and txid', () => {
    const wrapper = mount(SendStepSuccess, {
      props: defaultProps,
      global
    });

    expect(wrapper.text()).toContain('Transaction sent!');
    expect(wrapper.findComponent(PepCopyableId).props('id')).toBe(defaultProps.txid);
  });
});
