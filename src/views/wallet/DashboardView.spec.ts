import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardView from './DashboardView.vue';
import ReceiveView from './ReceiveView.vue';
import TransactionDetailView from './TransactionDetailView.vue';
import { createTestingPinia } from '@pinia/testing';

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

  it('Dashboard: should show "Receiving" in yellow for unconfirmed incoming tx', () => {
    const wrapper = mount(DashboardView, {
      global: {
        stubs,
        plugins: [
          createTestingPinia({
            initialState: {
              wallet: {
                isUnlocked: true,
                balance: 69,
                prices: { USD: 0.01, EUR: 0.01 },
                transactions: [
                  {
                    txid: 'tx1',
                    isOutgoing: false,
                    isConfirmed: false,
                    formattedAmount: '+13.37',
                    txidShort: 'abc...def'
                  }
                ]
              }
            }
          })
        ]
      }
    });

    const label = wrapper.find('.group.flex.cursor-pointer .font-bold');
    expect(label.text()).toBe('Receiving');
    expect(label.classes()).toContain('text-yellow-500');
  });

  it('Dashboard: should show "Received" in green for confirmed incoming tx', () => {
    const wrapper = mount(DashboardView, {
      global: {
        stubs,
        plugins: [
          createTestingPinia({
            initialState: {
              wallet: {
                isUnlocked: true,
                balance: 69,
                prices: { USD: 0.01, EUR: 0.01 },
                transactions: [
                  {
                    txid: 'tx1',
                    isOutgoing: false,
                    isConfirmed: true,
                    formattedAmount: '+420.00',
                    txidShort: 'abc...def'
                  }
                ]
              }
            }
          })
        ]
      }
    });

    const label = wrapper.find('.group.flex.cursor-pointer .font-bold');
    expect(label.text()).toBe('Received');
    expect(label.classes()).toContain('text-pep-green-light');
  });

  it('Dashboard: should show "Sent" for outgoing tx', () => {
    const wrapper = mount(DashboardView, {
      global: {
        stubs,
        plugins: [
          createTestingPinia({
            initialState: {
              wallet: {
                isUnlocked: true,
                balance: 69,
                prices: { USD: 0.01, EUR: 0.01 },
                transactions: [
                  {
                    txid: 'tx1',
                    isOutgoing: true,
                    isConfirmed: true,
                    formattedAmount: '-351.00',
                    txidShort: 'abc...def'
                  }
                ]
              }
            }
          })
        ]
      }
    });

    const label = wrapper.find('.group.flex.cursor-pointer .font-bold');
    expect(label.text()).toBe('Sent');
    expect(label.classes()).toContain('text-offwhite');
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
