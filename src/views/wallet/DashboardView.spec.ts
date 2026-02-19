import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardView from './DashboardView.vue';
import ReceiveView from './ReceiveView.vue';
import TransactionDetailView from './TransactionDetailView.vue';
import { createTestingPinia } from '@pinia/testing';
import { Transaction } from '../../models/Transaction';

// Mock Router
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  }),
  useRoute: () => ({
    params: { txid: 'test-tx' }
  })
}));

// Mock global components
const stubs = {
  PepPageHeader: {
    name: 'PepPageHeader',
    template: '<div>{{ title }}</div>',
    props: ['title', 'backTo', 'onBack']
  },
  PepFooter: { template: '<div></div>' },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  PepIcon: { template: '<div />' },
  PepCard: { template: '<div><slot /></div>' },
  PepInputGroup: { template: '<div><slot /></div>' },
  PepSpinner: { template: '<div />' },
  PepTransactionItem: {
    name: 'PepTransactionItem',
    template: '<div class="tx-item-stub"><slot name="left" /><slot name="right" /></div>',
    props: ['tx']
  }
};

const mockRawTx = {
  txid: 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3',
  version: 1,
  locktime: 0,
  vin: [],
  vout: [{ value: 100000000, scriptpubkey_address: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh' }],
  size: 100,
  weight: 400,
  fee: 1000,
  status: { confirmed: true, block_height: 100, block_time: Date.now() / 1000 }
};

describe('Wallet Views Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Dashboard: should navigate to send and receive', async () => {
    const wrapper = mount(DashboardView, {
      global: {
        stubs,
        plugins: [
          createTestingPinia({
            initialState: {
              wallet: {
                isUnlocked: true,
                balance: 0,
                prices: { USD: 0, EUR: 0 },
                transactions: []
              }
            }
          })
        ]
      }
    });

    const sendBtn = wrapper.findAll('button').find((b) => b.text() === 'Send');
    await sendBtn?.trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/send');

    const receiveBtn = wrapper.findAll('button').find((b) => b.text() === 'Receive');
    await receiveBtn?.trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/receive');
  });

  it('ReceiveView: should have a specific onBack callback to dashboard', () => {
    const wrapper = mount(ReceiveView, {
      global: { stubs, plugins: [createTestingPinia()] }
    });
    const header = wrapper.findComponent({ name: 'PepPageHeader' });
    expect(header.props('onBack')).toBeInstanceOf(Function);
  });

  it('TransactionDetailView: should have a specific onBack callback to dashboard', () => {
    const wrapper = mount(TransactionDetailView, {
      global: { stubs, plugins: [createTestingPinia()] }
    });
    const header = wrapper.findComponent({ name: 'PepPageHeader' });
    expect(header.props('onBack')).toBeInstanceOf(Function);
  });

  it('Dashboard: should render transaction items', async () => {
    const tx = new Transaction(mockRawTx, 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');

    const wrapper = mount(DashboardView, {
      global: {
        stubs,
        plugins: [
          createTestingPinia({
            initialState: {
              wallet: {
                isUnlocked: true,
                transactions: [tx]
              }
            }
          })
        ]
      }
    });

    const item = wrapper.findComponent({ name: 'PepTransactionItem' });
    expect(item.exists()).toBe(true);
    // Use strict equality check for serialized objects
    expect(JSON.stringify(item.props('tx'))).toBe(JSON.stringify(tx));
  });
});
