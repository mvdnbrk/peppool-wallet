import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardView from './DashboardView.vue';
import ReceiveView from './ReceiveView.vue';
import TransactionDetailView from './TransactionDetailView.vue';
import { createTestingPinia } from '@pinia/testing';
import { useWalletStore } from '../../stores/wallet';

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
  PepHeader: { 
    name: 'PepHeader',
    template: '<div>{{ title }}</div>',
    props: ['title', 'backTo', 'onBack']
  },
  PepFooter: { template: '<div></div>' },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  PepIcon: { template: '<div />' },
  PepCard: { template: '<div><slot /></div>' },
  PepInputGroup: { template: '<div><slot /></div>' },
  PepSpinner: { template: '<div />' }
};

describe('Wallet Views Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Dashboard: should navigate to send and receive', async () => {
    const wrapper = mount(DashboardView, {
      global: {
        stubs,
        plugins: [createTestingPinia({
            initialState: {
                wallet: {
                    isUnlocked: true,
                    balance: 0,
                    prices: { USD: 0, EUR: 0 },
                    transactions: []
                }
            }
        })]
      }
    });

    const sendBtn = wrapper.findAll('button').find(b => b.text() === 'Send');
    await sendBtn?.trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/send');

    const receiveBtn = wrapper.findAll('button').find(b => b.text() === 'Receive');
    await receiveBtn?.trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/receive');
  });

  it('ReceiveView: should have a specific onBack callback to dashboard', () => {
    const wrapper = mount(ReceiveView, {
      global: { stubs, plugins: [createTestingPinia()] }
    });
    const header = wrapper.findComponent({ name: 'PepHeader' });
    expect(header.props('onBack')).toBeInstanceOf(Function);
  });

  it('TransactionDetailView: should have a specific onBack callback to dashboard', () => {
    const wrapper = mount(TransactionDetailView, {
      global: { stubs, plugins: [createTestingPinia()] }
    });
    const header = wrapper.findComponent({ name: 'PepHeader' });
    expect(header.props('onBack')).toBeInstanceOf(Function);
  });
});

