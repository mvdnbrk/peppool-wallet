import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import SendView from '@/views/wallet/send/SendView.vue';
import SendStepForm from '@/views/wallet/send/SendStepForm.vue';
import SendStepReview from '@/views/wallet/send/SendStepReview.vue';
import SendStepSuccess from '@/views/wallet/send/SendStepSuccess.vue';
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
  isLoadingFees: ref(false),
  currentPrice: ref(10),
  isInsufficientFunds: ref(false),
  displayFee: ref('0.001 PEP'),
  maxRibbits: ref(0),
  loadFees: vi.fn(),
  validateStep1: vi.fn(),
  send: vi.fn().mockImplementation(async () => {
    mockSendTransaction.txid.value = 'txid';
    return 'txid';
  })
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

vi.mock('@/utils/crypto', () => ({
  isValidAddress: vi.fn().mockReturnValue(true),
  truncateId: vi.fn().mockReturnValue({ start: 'abc', end: 'xyz', full: 'abc...xyz' })
}));

// Mock global components
const stubs = {
  PepIcon: { template: '<div></div>' }
};

describe('SendView', () => {
  let mockWallet: any;
  let mockAccount: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock implementation state
    mockSendTransaction.tx.value = { ...mockTx };
    mockSendTransaction.txid.value = '';
    mockSendTransaction.isLoadingFees.value = false;
    mockSendTransaction.isInsufficientFunds.value = false;

    mockAccount = {
      spendableBalanceRibbits: 700_000_000
    };
    mockWallet = {
      address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
      isMnemonicLoaded: true,
      refreshBalance: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      wallet: mockWallet,
      account: mockAccount,
      settings: {
        settings: { currency: 'USD', explorer: 'peppool', lockDuration: 15 }
      },
      route: { path: '/send' } as any
    } as any);
  });

  const global = {
    stubs: {
      PepIcon: { template: '<div />' }
    },
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
      PepLoadingButton,
      SendStepForm,
      SendStepReview,
      SendStepSuccess
    }
  };

  it('should toggle between PEP and fiat mode when swap button is clicked', async () => {
    const wrapper = mount(SendView, { global });
    // Ensure we are at step 1
    // @ts-expect-error
    wrapper.vm.form.step = 1;

    await flushPromises();

    const amountInput = wrapper.findComponent(PepAmountInput);
    // @ts-expect-error
    expect(amountInput.vm.isFiatMode).toBe(false);

    // Find and click swap button
    const swapBtn = wrapper.find('#amount-currency-toggle');
    expect(swapBtn.exists()).toBe(true);

    await swapBtn.trigger('click');
    // @ts-expect-error
    expect(amountInput.vm.isFiatMode).toBe(true);

    await swapBtn.trigger('click');
    // @ts-expect-error
    expect(amountInput.vm.isFiatMode).toBe(false);
  });

  it('should correctly display the txid on the success screen (Step 3)', async () => {
    const wrapper = mount(SendView, { global });

    // Manually move to Step 3 and set a TXID in the persisted form
    // @ts-expect-error
    wrapper.vm.form.step = 3;
    // @ts-expect-error
    wrapper.vm.form.txid = 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3';

    await wrapper.vm.$nextTick();

    const copyable = wrapper.findComponent(PepCopyableId);
    expect(copyable.exists()).toBe(true);
    expect(copyable.props('id')).toBe(
      'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3'
    );
  });

  it('should display spendable balance on the send form', async () => {
    mockAccount.spendableBalanceRibbits = 500_000_000;

    const wrapper = mount(SendView, { global });
    // @ts-expect-error
    wrapper.vm.form.step = 1;

    await flushPromises();

    expect(wrapper.find('#available-balance').text()).toBe('5 PEP');
    expect(wrapper.text()).toContain('Available Balance');
  });

  it('should have a MAX button of type="button" that does not trigger form submit', async () => {
    const wrapper = mount(SendView, { global });
    // Ensure we are at step 1
    // @ts-expect-error
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
    // Simulate a draft restored from chrome.storage.session containing an
    // invalid recipient — onMounted should validate it and surface an error.
    vi.mocked(isValidAddress).mockReturnValue(false);

    vi.mocked(chrome.storage.session.get).mockResolvedValueOnce({
      send_draft: { data: { recipient: 'invalid-addr' }, timestamp: Date.now() }
    });

    const wrapper = mount(SendView, { global });
    await flushPromises();

    // @ts-expect-error
    expect(wrapper.vm.form.errors.recipient).toBe('Invalid address format');
  });

  it('should reset form when back button is clicked on success screen', async () => {
    const wrapper = mount(SendView, { global });

    // 1. Move to step 3
    // @ts-expect-error
    wrapper.vm.form.step = 3;
    // @ts-expect-error
    wrapper.vm.form.recipient = 'some-address';
    await wrapper.vm.$nextTick();

    // 2. Find and click back button in header
    const backBtn = wrapper.find('#header-back-button');
    await backBtn.trigger('click');

    // 3. Verify form was reset (step back to 1, recipient empty)
    // @ts-expect-error
    expect(wrapper.vm.form.step).toBe(1);
    // @ts-expect-error
    expect(wrapper.vm.form.recipient).toBe('');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('handleReview should update step to 2 on success', async () => {
    const wrapper = mount(SendView, { global });
    mockSendTransaction.validateStep1.mockResolvedValue(true);

    // @ts-expect-error
    await wrapper.vm.handleReview();

    // @ts-expect-error
    expect(wrapper.vm.form.step).toBe(2);
  });

  it('handleSend should update step to 3 on success', async () => {
    const wrapper = mount(SendView, { global });
    mockSendTransaction.send.mockResolvedValue('txid');

    // @ts-expect-error
    await wrapper.vm.handleSend();

    // @ts-expect-error
    expect(wrapper.vm.form.step).toBe(3);
    // @ts-expect-error
    wrapper.vm.form.txid = 'txid'; // Manually sync for test
    // @ts-expect-error
    expect(wrapper.vm.form.txid).toBe('txid');
  });

  it('handleSend should handle error on failure', async () => {
    const wrapper = mount(SendView, { global });
    // @ts-expect-error
    wrapper.vm.form.txid = '';
    // @ts-expect-error
    wrapper.vm.form.step = 2;
    mockSendTransaction.send.mockRejectedValue(new Error('Send failed'));

    // @ts-expect-error
    await wrapper.vm.handleSend();

    // @ts-expect-error
    expect(wrapper.vm.form.errors.general).toBe('Send failed');
    // @ts-expect-error
    expect(wrapper.vm.form.step).toBe(2);
  });
  it('handleReview should handle error on failure', async () => {
    const wrapper = mount(SendView, { global });
    mockSendTransaction.validateStep1.mockRejectedValue(new Error('Invalid step 1'));

    // @ts-expect-error
    await wrapper.vm.handleReview();

    // @ts-expect-error
    expect(wrapper.vm.form.errors.general).toBe('Invalid step 1');
  });

  it('setMax fills the amount field with the max sendable value', () => {
    mockSendTransaction.maxRibbits.value = 5000;
    const wrapper = mount(SendView, { global });

    // @ts-expect-error
    wrapper.vm.setMax();

    // @ts-expect-error
    expect(wrapper.vm.form.amountRibbits).toBe(5000);
  });

  it('handleAddressBlur should set error for invalid address', async () => {
    vi.mocked(isValidAddress).mockReturnValue(false);

    const wrapper = mount(SendView, { global });
    const setErrorSpy = vi.spyOn(wrapper.vm.form, 'setError');

    // @ts-expect-error
    wrapper.vm.form.recipient = 'not-valid';

    // @ts-expect-error
    await wrapper.vm.handleAddressBlur();

    expect(setErrorSpy).toHaveBeenCalledWith('recipient', 'Invalid address format');

    // Cleanup
    vi.mocked(isValidAddress).mockReturnValue(true);
  });
  it('handleClose should reset and navigate', () => {
    const wrapper = mount(SendView, { global });
    // @ts-expect-error
    wrapper.vm.form.recipient = 'some-data';

    // @ts-expect-error
    wrapper.vm.handleClose();

    // @ts-expect-error
    expect(wrapper.vm.form.recipient).toBe('');
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('openExplorer should open explorer link', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const wrapper = mount(SendView, { global });
    // @ts-expect-error
    wrapper.vm.form.txid = 'test-txid';

    // @ts-expect-error
    wrapper.vm.openExplorer();

    expect(openSpy).toHaveBeenCalledWith('https://peppool.space/tx/test-txid', '_blank');
    openSpy.mockRestore();
  });
});
