import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PepAmountInput from './PepAmountInput.vue';

vi.mock('@/composables/useApp', () => ({
  useApp: vi.fn(() => ({
    wallet: {},
    settings: {
      settings: { currency: 'USD', explorer: 'peppool', lockDuration: 15 }
    }
  }))
}));

const stubs = {
  PepInput: {
    template:
      '<div><slot name="prefix" /><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\', $event)" /><slot name="suffix" /></div>',
    props: ['modelValue']
  },
  PepIcon: { template: '<div />' }
};

function displayedValue(wrapper: ReturnType<typeof mount>) {
  return (wrapper.find('input').element as HTMLInputElement).value;
}

describe('PepAmountInput UI Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('emits update:ribbits when text input changes (PEP mode)', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: false },
      global: { stubs }
    });

    await wrapper.find('input').setValue('1');
    expect(wrapper.emitted('update:ribbits')?.[0]).toEqual([100_000_000]);
  });

  it('emits update:ribbits when text input changes (Fiat mode)', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: true },
      global: { stubs }
    });

    await wrapper.find('input').setValue('5'); // $5 / $10 per PEP = 0.5 PEP
    expect(wrapper.emitted('update:ribbits')?.[0]).toEqual([50_000_000]);
  });

  it('treats fiat input as PEP when price is 0 to avoid division by zero', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 0, isFiatMode: true },
      global: { stubs }
    });

    await wrapper.find('input').setValue('5');
    expect(wrapper.emitted('update:ribbits')?.[0]).toEqual([500_000_000]);
  });

  it('normalizes commas to dots in pasted/programmatic input', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: false },
      global: { stubs }
    });

    await wrapper.find('input').setValue('1,5');
    expect(wrapper.emitted('update:ribbits')?.[0]).toEqual([150_000_000]);
  });

  it('rejects garbage input as a paste fallback (parseFloat would silently truncate)', async () => {
    // beforeinput blocks typed garbage; setValue bypasses that path so the
    // handleInput fallback must also reject "1x3e" rather than emitting ribbits=1.
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: false },
      global: { stubs }
    });

    await wrapper.find('input').setValue('1');
    await wrapper.find('input').setValue('1x3e');

    const emits = wrapper.emitted('update:ribbits') as number[][];
    expect(emits.at(-1)).toEqual([100_000_000]);
  });

  it('rejects more than 8 decimals in PEP mode', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: false },
      global: { stubs }
    });

    await wrapper.find('input').setValue('1.12345678');
    await wrapper.find('input').setValue('1.123456789');

    const emits = wrapper.emitted('update:ribbits') as number[][];
    expect(emits.at(-1)).toEqual([112_345_678]);
  });

  it('rejects more than 2 decimals in fiat mode', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: true },
      global: { stubs }
    });

    await wrapper.find('input').setValue('1.23');
    await wrapper.find('input').setValue('1.234');

    const emits = wrapper.emitted('update:ribbits') as number[][];
    // 1.23 / $10 = 0.123 PEP = 12_300_000 ribbits.
    expect(emits.at(-1)).toEqual([12_300_000]);
  });

  it('does not freeze when toggling to fiat with a tiny amount that exceeds the fiat decimal cap', async () => {
    // 50_000 ribbits = 0.0005 PEP × $10 = $0.005 → formatFiat emits "0.0050" (4 decimals).
    // The displayed text is derived from ribbits, not validated as user input,
    // so it survives even though it exceeds the 2-decimal fiat cap.
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 50_000, price: 10, isFiatMode: false },
      global: { stubs }
    });

    await wrapper.setProps({ isFiatMode: true });
    expect(displayedValue(wrapper)).toBe('0.0050');
  });

  it('does not clear MAX flag when ribbits are set externally', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: false },
      global: { stubs }
    });

    await wrapper.setProps({ ribbits: 500_000_000 });
    expect(wrapper.emitted('change-max')).toBeUndefined();
  });

  it('emits change-max:false when user types', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 100, price: 10, isFiatMode: false },
      global: { stubs }
    });

    await wrapper.find('input').setValue('101');
    expect(wrapper.emitted('change-max')?.[0]).toEqual([false]);
  });

  it('preserves exact ribbits when MAX is set in fiat mode (no parse round-trip)', async () => {
    // Regression: in fiat mode, MAX would write the exact ribbits, the
    // component would format them as e.g. "$1.23", parse that back, divide by
    // price, and emit a slightly different (often higher) ribbits value than
    // the wallet balance — causing "insufficient funds" on review.
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: true },
      global: { stubs }
    });

    const maxBalance = 123_456_789;
    await wrapper.setProps({ ribbits: maxBalance });

    // The component must not echo back a different ribbits value.
    expect(wrapper.emitted('update:ribbits')).toBeUndefined();
  });

  it('keeps the buffer mid-edit so the cursor does not jump on re-render', async () => {
    // Typing "1." should leave "1." in the field even though parseFloat("1.") === 1
    // and props.ribbits won't change between keystrokes.
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: false },
      global: { stubs }
    });

    const input = wrapper.find('input');
    await input.setValue('1');
    await wrapper.setProps({ ribbits: 100_000_000 }); // parent echoes
    await input.setValue('1.');
    expect(displayedValue(wrapper)).toBe('1.');
  });

  it('drops the buffer on blur so the canonical display takes over', async () => {
    const wrapper = mount(PepAmountInput, {
      props: { ribbits: 0, price: 10, isFiatMode: false },
      global: { stubs }
    });

    const input = wrapper.find('input');
    await input.setValue('1.50');
    await wrapper.setProps({ ribbits: 150_000_000 });
    await input.trigger('blur');
    expect(displayedValue(wrapper)).toBe('1.5');
  });
});
