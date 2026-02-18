import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SendView from './SendView.vue';
import { createTestingPinia } from '@pinia/testing';

// Mock Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

// Mock API
const mockFetchUtxos = vi.fn();
const mockFetchRecommendedFees = vi.fn();
vi.mock('../../utils/api', () => ({
  fetchUtxos: (...args: any[]) => mockFetchUtxos(...args),
  fetchRecommendedFees: (...args: any[]) => mockFetchRecommendedFees(...args),
  broadcastTx: vi.fn(),
  fetchTxHex: vi.fn(),
  validateAddress: vi.fn()
}));

// Mock global components
const stubs = {
  PepHeader: { template: '<div><slot /></div>' },
  PepIcon: { template: '<div></div>' },
  PepInput: { template: '<div><slot /></div>' },
  PepButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  PepPasswordInput: { template: '<div><slot /></div>' },
  PepInputGroup: { template: '<div><slot /></div>' }
};

describe('SendView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should correctly display the txid on the success screen (Step 3)', async () => {
    const wrapper = mount(SendView, {
      global: {
        stubs,
        plugins: [
          createTestingPinia({
            initialState: {
              wallet: {
                address: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh',
                isMnemonicLoaded: true
              }
            }
          })
        ]
      }
    });

    // Manually move to Step 3 and set a TXID
    // @ts-ignore
    const ui = wrapper.vm.ui;
    ui.step = 3;
    ui.txid = 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3';

    await wrapper.vm.$nextTick();

    // @ts-ignore
    expect(wrapper.vm.txidStart).toBe('f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b');
    // @ts-ignore
    expect(wrapper.vm.txidEnd).toBe('5f9ef3');

    expect(wrapper.html()).toContain('sent-txid');
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

    const wrapper = mount(SendView, {
      global: {
        stubs,
        plugins: [
          createTestingPinia({
            initialState: {
              wallet: {
                address: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh',
                isMnemonicLoaded: true
              }
            }
          })
        ]
      }
    });

    await flushPromises();

    // @ts-ignore - access internal tx object
    const txUtxos = wrapper.vm.tx.utxos;

    // Only confirmed UTXOs should be present
    expect(txUtxos).toHaveLength(2);
    expect(txUtxos.every((u: any) => u.status.confirmed)).toBe(true);
    expect(txUtxos.map((u: any) => u.txid)).toEqual(['confirmed-1', 'confirmed-2']);
  });
});
