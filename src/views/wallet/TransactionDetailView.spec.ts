import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import TransactionDetailView from './TransactionDetailView.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import { Transaction } from '@/models/Transaction';
import { useApp } from '@/composables/useApp';
import * as api from '@/utils/api';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp');

// Mock API
vi.mock('@/utils/api', () => ({
  fetchTransaction: vi.fn()
}));

// Mock global components
const stubs = {
  PepMainLayout: {
    template:
      '<div><slot name="header"><PepPageHeader v-bind="$attrs" /></slot><slot /><slot name="actions" /></div>',
    inheritAttrs: false
  },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  PepIcon: { template: '<div />' },
  PepCard: { template: '<div><slot /></div>' },
  PepInputGroup: { template: '<div><slot /></div>' },
  PepSpinner: { template: '<div />' },
  PepCopyableId: { template: '<div />', props: ['id', 'label'] }
};

const mockRawTx = {
  txid: 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3',
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: 'prev-txid',
      vout: 0,
      prevout: {
        scriptpubkey_address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
        value: 200000000
      }
    }
  ],
  vout: [{ value: 100000000, scriptpubkey_address: 'recipient-address' }],
  size: 100,
  weight: 400,
  fee: 1000,
  status: { confirmed: true, block_height: 100, block_time: Date.now() / 1000 }
};

describe('TransactionDetailView', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchTransaction).mockResolvedValue(mockRawTx as any);
    mockWallet = {
      address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
      openExplorerTx: vi.fn(),
      refreshBalance: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockWallet,
      route: { params: { txid: mockRawTx.txid } } as any
    });
  });

  it('should show Network Fee only for outgoing transactions', async () => {
    const wrapper = mount(TransactionDetailView, {
      global: { stubs, components: { PepPageHeader } }
    });

    // 1. Outgoing
    // @ts-ignore
    wrapper.vm.txModel = new Transaction(mockRawTx, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU');
    // @ts-ignore
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Network Fee');

    // 2. Incoming
    // @ts-ignore
    wrapper.vm.txModel = new Transaction(
      { ...mockRawTx, vin: [] },
      'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain('Network Fee');
  });

  it('should render incoming transaction data correctly', async () => {
    const wrapper = mount(TransactionDetailView, {
      global: { stubs, components: { PepPageHeader } }
    });

    // Address in vout matches userAddress
    const incomingTx = new Transaction(
      {
        ...mockRawTx,
        vin: [],
        vout: [{ value: 100000000, scriptpubkey_address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU' }]
      },
      'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'
    );

    // @ts-ignore
    wrapper.vm.txModel = incomingTx;
    // @ts-ignore
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('+1 PEP');
    expect(wrapper.text()).toContain('Received');
    expect(wrapper.text()).toContain('Confirmed');
    expect(wrapper.text()).toContain(incomingTx.date);
    expect(wrapper.text()).toContain('100');
  });

  it('should show unconfirmed status correctly', async () => {
    const wrapper = mount(TransactionDetailView, {
      global: { stubs, components: { PepPageHeader } }
    });

    const unconfirmedRaw = { ...mockRawTx, status: { confirmed: false } };

    // 1. Sending
    // @ts-ignore
    wrapper.vm.txModel = new Transaction(unconfirmedRaw, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU');
    // @ts-ignore
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Sending');
    expect(wrapper.text()).toContain('In mempool');

    // 2. Receiving
    // @ts-ignore
    wrapper.vm.txModel = new Transaction(
      {
        ...unconfirmedRaw,
        vin: [],
        vout: [{ value: 100000000, scriptpubkey_address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU' }]
      },
      'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Receiving');
    expect(wrapper.text()).toContain('In mempool');
  });

  it('should call openExplorer with correct txid', async () => {
    const wrapper = mount(TransactionDetailView, {
      global: { stubs, components: { PepPageHeader } }
    });

    // @ts-ignore
    wrapper.vm.txModel = new Transaction(mockRawTx, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU');
    // @ts-ignore
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();

    await wrapper.find('#view-on-explorer').trigger('click');

    expect(mockWallet.openExplorerTx).toHaveBeenCalledWith(mockRawTx.txid);
  });

  it('should start polling if transaction is unconfirmed', async () => {
    vi.useFakeTimers();
    const unconfirmed = { ...mockRawTx, status: { confirmed: false } };
    vi.mocked(api.fetchTransaction).mockResolvedValue(unconfirmed as any);

    const wrapper = mount(TransactionDetailView, {
      global: { stubs, components: { PepPageHeader } }
    });

    await flushPromises();
    
    // Ensure it started polling
    expect(vi.getTimerCount()).toBe(1);

    // Mock it becoming confirmed for next poll
    vi.mocked(api.fetchTransaction).mockResolvedValue(mockRawTx as any);

    // Manual trigger of the polling handler logic
    // @ts-ignore
    await wrapper.vm.loadDetails(true);

    expect(mockWallet.refreshBalance).toHaveBeenCalledWith(true);
    vi.useRealTimers();
  });
});
