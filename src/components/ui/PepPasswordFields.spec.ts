import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PepPasswordFields from './PepPasswordFields.vue';
import { nextTick } from 'vue';

describe('PepPasswordFields Component', () => {
  const globalOptions = {
    stubs: {
      PepInput: {
        template: '<div class="pep-input-stub"><label>{{ label }}</label><span v-if="error" class="error">{{ error }}</span><slot /></div>',
        props: ['label', 'error']
      }
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders correctly with default labels', () => {
    const wrapper = mount(PepPasswordFields, {
      props: {
        password: '',
        confirmPassword: '',
        errors: {}
      },
      global: globalOptions
    });

    expect(wrapper.text()).toContain('New password');
    expect(wrapper.text()).toContain('Confirm password');
  });

  it('shows strength label only when minimum length is reached', async () => {
    const wrapper = mount(PepPasswordFields, {
      props: {
        password: 'abc',
        confirmPassword: '',
        errors: {}
      },
      global: globalOptions
    });

    // Label should be hidden (placeholder &nbsp; used)
    expect(wrapper.find('.text-slate-400').exists()).toBe(false);

    // Update to min length
    await wrapper.setProps({ password: 'password123' });
    await nextTick();

    expect(wrapper.find('.text-slate-400').text()).toBe('Your password strength');
  });

  it('applies colored background to strength bar only after min length', async () => {
    const wrapper = mount(PepPasswordFields, {
      props: {
        password: 'abc',
        confirmPassword: '',
        errors: {}
      },
      global: globalOptions
    });

    const bar = wrapper.find('.h-2.rounded-full');
    expect(bar.classes()).toContain('bg-white/20');

    await wrapper.setProps({ password: 'password123' });
    await nextTick();

    expect(bar.classes()).not.toContain('bg-white/20');
    // It should have one of the strength colors (e.g. FAIR, STRONG)
    expect(bar.classes().some(c => c.startsWith('bg-'))).toBe(true);
  });

  it('displays the correct strength label', async () => {
    const wrapper = mount(PepPasswordFields, {
      props: {
        password: 'password123',
        confirmPassword: '',
        errors: {}
      },
      global: globalOptions
    });

    await nextTick();
    const strengthValue = wrapper.find('.text-xs.font-semibold');
    expect(['WEAK', 'FAIR', 'STRONG', 'EXCELLENT']).toContain(strengthValue.text());
  });

  it('emits blur events', async () => {
    const wrapper = mount(PepPasswordFields, {
      props: {
        password: '',
        confirmPassword: ''
      },
      global: {
        stubs: {
          PepInput: {
            template: '<input @blur="$emit(\'blur\', $event)" />'
          }
        }
      }
    });

    const inputs = wrapper.findAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
    
    if (inputs[0]) await inputs[0].trigger('blur');
    expect(wrapper.emitted('blur-password')).toBeTruthy();

    if (inputs[1]) await inputs[1].trigger('blur');
    expect(wrapper.emitted('blur-confirm')).toBeTruthy();
  });

  it('displays error messages passed via props', () => {
    const wrapper = mount(PepPasswordFields, {
      props: {
        password: '123',
        confirmPassword: '123',
        errors: {
          password: 'Password too weak',
          confirmPassword: 'Passwords do not match'
        }
      },
      global: globalOptions
    });

    expect(wrapper.text()).toContain('Password too weak');
    expect(wrapper.text()).toContain('Passwords do not match');
  });
});
