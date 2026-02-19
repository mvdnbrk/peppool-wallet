import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PepTransactionItem from './PepTransactionItem.vue';
import { Transaction } from '../../models/Transaction';

// Mock PepListItem
const stubs = {
  PepListItem: {
    template: '<div class="list-item-stub"><slot name="left" /><slot name="right" /></div>'
  }
};

const mockRawTx = {
  txid: 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3',
  version: 1,
  locktime: 0,
  vin: [],
  vout: [{ value: 100000000, scriptpubkey_address: 'user-address' }],
  size: 100,
  weight: 400,
  fee: 1000,
  status: { confirmed: true, block_height: 100, block_time: Date.now() / 1000 }
};

describe('PepTransactionItem UI Component', () => {
  it('should render transaction details correctly', () => {
    const tx = new Transaction(mockRawTx, 'user-address');
    const wrapper = mount(PepTransactionItem, {
      props: { tx },
      global: { stubs }
    });

    expect(wrapper.text()).toContain('Received');
    expect(wrapper.text()).toContain(tx.txidShort);
    expect(wrapper.text()).toContain('+1 PEP');
    expect(wrapper.text()).toContain('Confirmed');
  });

  it('should apply correct color class based on status', () => {
    const tx = new Transaction(mockRawTx, 'user-address');
    const wrapper = mount(PepTransactionItem, {
      props: { tx },
      global: { stubs }
    });

    const statusLabel = wrapper.find('p.font-bold');
    expect(statusLabel.classes()).toContain('text-pep-green-light');
  });
});
