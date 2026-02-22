import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import DashboardView from './DashboardView.vue';
import ReceiveView from './ReceiveView.vue';
import { Transaction } from '@/models/Transaction';
import { useApp } from '@/composables/useApp';

// UI Components
import PepButton from '@/components/ui/PepButton.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepTransactionItem from '@/components/ui/list/PepTransactionItem.vue';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp');

// Visual stubs only
const stubs = {
  PepIcon: { template: '<div />' },
  PepWordmark: { template: '<div />' }
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
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      isUnlocked: true,
      balance: 0,
      balanceFiat: 0,
      currencySymbol: '$',
      selectedCurrency: 'USD',
      prices: { USD: 0, EUR: 0 },
      transactions: [],
      canLoadMore: true,
      refreshBalance: vi.fn(),
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
      resetLockTimer: vi.fn(),
      openExplorerTx: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockWallet,
      route: { params: { txid: 'test-tx' } } as any
    });
  });

  const global = {
    stubs,
    components: {
      PepButton,
      PepMainLayout,
      PepPageHeader,
      PepTransactionItem
    }
  };

  it('Dashboard: should navigate to send and receive', async () => {
    const wrapper = mount(DashboardView, { global });

    const sendBtn = wrapper.findAll('button').find((b) => b.text().includes('Send'));
    await sendBtn?.trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/send');

    const receiveBtn = wrapper.findAll('button').find((b) => b.text().includes('Receive'));
    await receiveBtn?.trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/receive');
  });

  it('ReceiveView: should have a specific onBack callback to dashboard', () => {
    const wrapper = mount(ReceiveView, {
      global: {
        ...global,
        components: { ...global.components, PepPageHeader }
      }
    });
    const header = wrapper.findComponent(PepPageHeader);
    expect(header.props('onBack')).toBeInstanceOf(Function);
  });

  it('Dashboard: should render transaction items and show header', async () => {
    const tx = new Transaction(mockRawTx, 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');
    mockWallet.transactions = [tx];

    const wrapper = mount(DashboardView, { global });

    expect(wrapper.text()).toContain('Recent Activity');
    const item = wrapper.findComponent(PepTransactionItem);
    expect(item.exists()).toBe(true);
  });

  it('Dashboard: should hide Recent Activity header when no transactions', async () => {
    mockWallet.transactions = [];

    const wrapper = mount(DashboardView, { global });

    expect(wrapper.text()).not.toContain('Recent Activity');
    expect(wrapper.text()).toContain('No transactions yet');
  });

  it('Dashboard: should show load more button when transactions exist', async () => {
    const tx = new Transaction(mockRawTx, 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');
    mockWallet.transactions = [tx];
    mockWallet.fetchMoreTransactions = vi.fn().mockResolvedValue(true);

    const wrapper = mount(DashboardView, { global });

    const buttons = wrapper.findAll('button');
    const loadMore = buttons.find((b) => b.text().includes('Load more'));

    expect(loadMore?.exists()).toBe(true);

    await loadMore?.trigger('click');
    expect(mockWallet.fetchMoreTransactions).toHaveBeenCalled();
  });

  it('Dashboard: should adjust font size for large balances', async () => {
    mockWallet.balance = 1000000000000000; // Force very long string
    const wrapper = mount(DashboardView, { global });

    const balanceSpan = wrapper.find('span.text-offwhite');
    expect(balanceSpan.classes()).toContain('text-xl');
  });

  it('Dashboard: should refresh and poll on mount if unlocked', async () => {
    mockWallet.isUnlocked = true;
    mount(DashboardView, { global });
    await nextTick();

    expect(mockWallet.refreshBalance).toHaveBeenCalled();
    expect(mockWallet.startPolling).toHaveBeenCalled();
  });
});
