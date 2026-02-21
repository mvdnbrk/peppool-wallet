import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { inject, defineComponent } from 'vue';
import PepForm from './PepForm.vue';

// A test child component that injects the form state
const ChildComponent = defineComponent({
  template: '<div>{{ isFormDisabled }}</div>',
  setup() {
    const isFormDisabled = inject('isFormDisabled');
    return { isFormDisabled };
  }
});

describe('PepForm UI Component', () => {
  it('should provide isFormDisabled state to children', async () => {
    const wrapper = mount(PepForm, {
      props: { id: 'test-form', loading: true },
      slots: {
        default: ChildComponent
      }
    });

    expect(wrapper.text()).toContain('true');

    await wrapper.setProps({ loading: false });
    expect(wrapper.text()).toContain('false');
  });

  it('should emit submit when not loading', async () => {
    const wrapper = mount(PepForm, {
      props: { id: 'test-form', loading: false }
    });

    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted('submit')).toBeTruthy();
  });

  it('should NOT emit submit when loading', async () => {
    const wrapper = mount(PepForm, {
      props: { id: 'test-form', loading: true }
    });

    await wrapper.find('form').trigger('submit');
    expect(wrapper.emitted('submit')).toBeFalsy();
  });
});
