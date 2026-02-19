import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SendView from './SendView.vue';
import PepAmountInput from '@/components/ui/form/PepAmountInput.vue';
import PepCopyableId from '@/components/ui/PepCopyableId.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import { useApp } from '@/composables/useApp';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp');

// Mock API
const mockFetchUtxos = vi.fn();
const mockFetchRecommendedFees = vi.fn();
vi.mock('@/utils/api', () => ({
  fetchUtxos: (...args: any[]) => mockFetchUtxos(...args),
  fetchRecommendedFees: (...args: any[]) => mockFetchRecommendedFees(...args),
  broadcastTx: vi.fn(),
  fetchTxHex: vi.fn(),
  validateAddress: vi.fn()
}));

// Mock global components
const stubs = {
  PepIcon: { template: '<div></div>' },
  PepInput: {
    template: '<div><slot name="prefix" /><slot /><slot name="suffix" /></div>',
    props: ['modelValue'],
    methods: { focus: () => {} }
  },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  PepPasswordInput: { template: '<div><slot /></div>' },
  PepInputGroup: { template: '<div><slot /></div>' },
  PepLoadingButton: { template: '<button><slot /></button>' },
  PepForm: {
    template: '<form @submit.prevent="$emit(\'submit\')"><slot /><slot name="actions" /></form>'
  }
};

describe('SendView', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      address: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh',
      isMnemonicLoaded: true,
      selectedCurrency: 'USD',
      currencySymbol: '$',
      balance: 7,
      prices: { USD: 10, EUR: 8 },
      refreshBalance: vi.fn(),
      openExplorerTx: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockWallet,
      requireUnlock: vi.fn(),
      route: { path: '/send' } as any
    });
  });

  const global = {
    stubs,
    components: { PepAmountInput, PepCopyableId, PepMainLayout, PepPageHeader }
  };

  it('should toggle between PEP and fiat mode when swap button is clicked', async () => {
    mockFetchUtxos.mockResolvedValue([]);
    mockFetchRecommendedFees.mockResolvedValue({ fastestFee: 1000 });

    const wrapper = mount(SendView, { global });

    await flushPromises();

    const amountInput = wrapper.findComponent(PepAmountInput);
    // @ts-ignore
    expect(amountInput.vm.isFiatMode).toBe(false);

    // Find and click swap button
    const swapBtn = wrapper.find('button[title="Switch currency"]');
    expect(swapBtn.exists()).toBe(true);

    await swapBtn.trigger('click');
    // @ts-ignore
    expect(amountInput.vm.isFiatMode).toBe(true);

    await swapBtn.trigger('click');
    // @ts-ignore
    expect(amountInput.vm.isFiatMode).toBe(false);
  });

  it('should correctly display the txid on the success screen (Step 3)', async () => {
    const wrapper = mount(SendView, { global });

    // Manually move to Step 3 and set a TXID
    // @ts-ignore
    const ui = wrapper.vm.ui;
    ui.step = 3;
    ui.txid = 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3';

    await wrapper.vm.$nextTick();

    const copyable = wrapper.findComponent(PepCopyableId);
    expect(copyable.exists()).toBe(true);
    expect(copyable.props('id')).toBe(
      'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3'
    );
  });

  it('should only use confirmed UTXOs for spending', async () => {
    const mixedUtxos = [
      {
        txid: 'confirmed-1',
        vout: 0,
        value: 500_000_000,
        status: { confirmed: true, block_height: 100 }
      },
      { txid: 'unconfirmed-1', vout: 0, value: 200_000_000, status: { confirmed: false } },
      {
        txid: 'confirmed-2',
        vout: 1,
        value: 300_000_000,
        status: { confirmed: true, block_height: 101 }
      },
      { txid: 'unconfirmed-2', vout: 0, value: 100_000_000, status: { confirmed: false } }
    ];

    mockFetchUtxos.mockResolvedValue(mixedUtxos);
    mockFetchRecommendedFees.mockResolvedValue({
      fastestFee: 1000,
      halfHourFee: 500,
      hourFee: 250,
      economyFee: 100,
      minimumFee: 50
    });

    const wrapper = mount(SendView, { global });

    await flushPromises();

    // @ts-ignore - access internal tx object
    const txUtxos = wrapper.vm.tx.utxos;

    // Only confirmed UTXOs should be present
    expect(txUtxos).toHaveLength(2);
    expect(txUtxos.every((u: any) => u.status.confirmed)).toBe(true);
    expect(txUtxos.map((u: any) => u.txid)).toEqual(['confirmed-1', 'confirmed-2']);
  });

  it('should display available balance from confirmed UTXOs only', async () => {
    // 5 PEP confirmed + 2 PEP unconfirmed = 7 PEP total, but only 5 spendable
    mockFetchUtxos.mockResolvedValue([
      { txid: 'c1', vout: 0, value: 500_000_000, status: { confirmed: true, block_height: 100 } },
      { txid: 'u1', vout: 0, value: 200_000_000, status: { confirmed: false } }
    ]);
    mockFetchRecommendedFees.mockResolvedValue({
      fastestFee: 1000,
      halfHourFee: 500,
      hourFee: 250,
      economyFee: 100,
      minimumFee: 50
    });

    const wrapper = mount(SendView, { global });

    await flushPromises();

    // @ts-ignore
    expect(wrapper.vm.displayBalance).toBe('5 PEP');
  });
});
