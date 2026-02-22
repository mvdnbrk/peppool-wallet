import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { reactive } from 'vue';
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
    mockWallet = reactive({
      address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
      openExplorerTx: vi.fn(),
      refreshBalance: vi.fn(),
      transactions: [],
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
      fetchTransaction: vi.fn()
    });
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockWallet,
      route: { params: { txid: mockRawTx.txid } } as any
    });
  });

  it('should show Network Fee only for outgoing transactions', async () => {
    mockWallet.fetchTransaction.mockResolvedValue(new Transaction(mockRawTx, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'));
    
    const wrapper = mount(TransactionDetailView, {
      global: { stubs, components: { PepPageHeader } }
    });

    await flushPromises();
    
    // 1. Outgoing
    expect(wrapper.text()).toContain('Network Fee');

    // 2. Incoming
    const incomingRaw = { ...mockRawTx, vin: [] };
    mockWallet.fetchTransaction.mockResolvedValue(new Transaction(incomingRaw, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'));
    // @ts-ignore
    await wrapper.vm.loadDetails();
    await flushPromises();
    
    expect(wrapper.text()).not.toContain('Network Fee');
  });

  it('should render incoming transaction data correctly', async () => {
    const incomingRaw = {
      ...mockRawTx,
      vin: [],
      vout: [{ value: 100000000, scriptpubkey_address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU' }]
    };
    mockWallet.fetchTransaction.mockResolvedValue(new Transaction(incomingRaw, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'));

    const wrapper = mount(TransactionDetailView, {
      global: { stubs, components: { PepPageHeader } }
    });

    await flushPromises();

    expect(wrapper.text()).toContain('+1 PEP');
    expect(wrapper.text()).toContain('Received');
    expect(wrapper.text()).toContain('Confirmed');
  });

  it('should show unconfirmed status correctly', async () => {
    const unconfirmedRaw = { ...mockRawTx, status: { confirmed: false } };
    mockWallet.fetchTransaction.mockResolvedValue(new Transaction(unconfirmedRaw, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'));

    const wrapper = mount(TransactionDetailView, {
      global: { stubs, components: { PepPageHeader } }
    });

    await flushPromises();
    expect(wrapper.text()).toContain('Sending');
    expect(wrapper.text()).toContain('In mempool');
  });

  it('should call openExplorer with correct txid', async () => {
    mockWallet.fetchTransaction.mockResolvedValue(new Transaction(mockRawTx, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'));

    const wrapper = mount(TransactionDetailView, {
      global: { stubs, components: { PepPageHeader } }
    });

    await flushPromises();

    await wrapper.find('#view-on-explorer').trigger('click');

    expect(mockWallet.openExplorerTx).toHaveBeenCalledWith(mockRawTx.txid);
  });

      it('should update details when store transaction list changes', async () => {
        const unconfirmedRaw = { ...mockRawTx, status: { confirmed: false } };
        mockWallet.fetchTransaction.mockResolvedValue(new Transaction(unconfirmedRaw, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'));
    
        const wrapper = mount(TransactionDetailView, {
          global: { stubs, components: { PepPageHeader } }
        });
          await flushPromises();
      expect(wrapper.text()).toContain('In mempool');
  
      // Simulate store updating the transaction list (e.g. after a poll found a new block)
      mockWallet.transactions = [new Transaction(mockRawTx, 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU')];
      await wrapper.vm.$nextTick();
  
      expect(wrapper.text()).toContain('Confirmed');
    });
  });
  
