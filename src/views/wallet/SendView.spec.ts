import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import SendView from './send/SendView.vue';
import { isValidAddress } from '@/utils/crypto';
import PepAmountInput from '@/components/ui/form/PepAmountInput.vue';
import PepCopyableId from '@/components/ui/PepCopyableId.vue';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepSuccessState from '@/components/ui/PepSuccessState.vue';
import PepForm from '@/components/ui/form/PepForm.vue';
import PepInput from '@/components/ui/form/PepInput.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';
import PepInputGroup from '@/components/ui/form/PepInputGroup.vue';
import PepLoadingButton from '@/components/ui/PepLoadingButton.vue';
import { useApp } from '@/composables/useApp';
import { useSendTransaction } from '@/composables/useSendTransaction';

// Mock useApp
const pushMock = vi.fn();
vi.mock('@/composables/useApp');

// Mock useSendTransaction
const mockTx = {
  amountPep: '0',
  recipient: '',
  amountRibbits: 0,
  maxRibbits: 0,
  isValid: false,
  utxos: [] as any[],
  fees: null as any
};

const mockSendTransaction = {
  tx: ref(mockTx),
  txid: ref(''),
  isLoadingRequirements: ref(false),
  currentPrice: ref(10),
  isInsufficientFunds: ref(false),
  displayBalance: vi.fn().mockReturnValue('0 PEP'),
  displayFee: ref('0.001 PEP'),
  loadRequirements: vi.fn(),
  validateStep1: vi.fn(),
  send: vi.fn()
};

vi.mock('@/composables/useSendTransaction', () => ({
  useSendTransaction: () => mockSendTransaction
}));

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

vi.mock('@/utils/crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/crypto')>();
  return {
    ...actual,
    isValidAddress: vi.fn().mockReturnValue(true)
  };
});

// Mock global components
const stubs = {
  PepIcon: { template: '<div></div>' }
};

describe('SendView', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock implementation state
    mockSendTransaction.tx.value = { ...mockTx };
    mockSendTransaction.txid.value = '';
    mockSendTransaction.isLoadingRequirements.value = false;
    mockSendTransaction.isInsufficientFunds.value = false;
    mockSendTransaction.displayBalance.mockReturnValue('0 PEP');

    mockWallet = {
      address: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh',
      isMnemonicLoaded: true,
      selectedCurrency: 'USD',
      currencySymbol: '$',
      balance: 7,
      prices: { USD: 10, EUR: 8 },
      refreshBalance: vi.fn(),
      openExplorerTx: vi.fn(),
      openExplorerTxLink: vi.fn()
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
    components: {
      PepAmountInput,
      PepCopyableId,
      PepMainLayout,
      PepPageHeader,
      PepSuccessState,
      PepForm,
      PepInput,
      PepButton,
      PepPasswordInput,
      PepInputGroup,
      PepLoadingButton
    }
  };

  it('should toggle between PEP and fiat mode when swap button is clicked', async () => {
    const wrapper = mount(SendView, { global });
    // Ensure we are at step 1
    // @ts-ignore
    wrapper.vm.form.step = 1;

    await flushPromises();

    const amountInput = wrapper.findComponent(PepAmountInput);
    // @ts-ignore
    expect(amountInput.vm.isFiatMode).toBe(false);

    // Find and click swap button
    const swapBtn = wrapper.find('#amount-currency-toggle');
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

    // Manually move to Step 3 and set a TXID in the persisted form
    // @ts-ignore
    wrapper.vm.form.step = 3;
    // @ts-ignore
    wrapper.vm.form.txid = 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3';

    await wrapper.vm.$nextTick();

    const copyable = wrapper.findComponent(PepCopyableId);
    expect(copyable.exists()).toBe(true);
    expect(copyable.props('id')).toBe(
      'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3'
    );
  });

  it('should display available balance from the composable', async () => {
    mockSendTransaction.displayBalance.mockReturnValue('5 PEP');

    const wrapper = mount(SendView, { global });
    // Ensure we are at step 1
    // @ts-ignore
    wrapper.vm.form.step = 1;

    await flushPromises();

    expect(wrapper.text()).toContain('Available:5 PEP');
  });

  it('should have a MAX button of type="button" that does not trigger form submit', async () => {
    const wrapper = mount(SendView, { global });
    // Ensure we are at step 1
    // @ts-ignore
    wrapper.vm.form.step = 1;

    await flushPromises();

    // Find the MAX button
    const maxButton = wrapper.find('#send-max-button');

    expect(maxButton.exists()).toBe(true);
    expect(maxButton.attributes('type')).toBe('button');

    // Find the form
    const form = wrapper.findComponent(PepForm);
    expect(form.exists()).toBe(true);

    // Click the MAX button
    await maxButton.trigger('click');

    // Verify form was not submitted
    expect(form.emitted('submit')).toBeUndefined();
  });

  it('should validate address on mount if recipient is present', async () => {
    // We need to simulate the form having data restored from storage
    // The useForm hook in SendView.vue will restore from localStorage before component setup
    // But since we are testing, we can just mock the useForm return or set it up.
    // However, SendView.vue uses useForm internally.

    // We can use a custom wrapper setup if needed, but let's try to see if we can trigger it.
    // Actually, in the test environment, localStorage might have state.

    // Simpler: Check if handleAddressBlur is called or if error appears when we mock isValidAddress to return false.
    vi.mocked(isValidAddress).mockReturnValue(false);

    // We need to make sure form.recipient is set BEFORE onMounted runs or during initialization.
    // In our test setup, SendView calls useForm.
    // If we want to simulate restored data, we could mock localStorage.getItem
    const spy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValue(JSON.stringify({ recipient: 'invalid-addr' }));

    const wrapper = mount(SendView, { global });
    await flushPromises();

    // The error should be present because onMounted calls handleAddressBlur
    // @ts-ignore
    expect(wrapper.vm.form.errors.recipient).toBe('Invalid address format');

    spy.mockRestore();
  });

  it('should reset form when back button is clicked on success screen', async () => {
    const wrapper = mount(SendView, { global });

    // 1. Move to step 3
    // @ts-ignore
    wrapper.vm.form.step = 3;
    // @ts-ignore
    wrapper.vm.form.recipient = 'some-address';
    await wrapper.vm.$nextTick();

    // 2. Find and click back button in header
    const backBtn = wrapper.find('#header-back-button');
    await backBtn.trigger('click');

    // 3. Verify form was reset (step back to 1, recipient empty)
    // @ts-ignore
    expect(wrapper.vm.form.step).toBe(1);
    // @ts-ignore
    expect(wrapper.vm.form.recipient).toBe('');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });
});
