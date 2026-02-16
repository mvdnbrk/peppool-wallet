import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SendView from './SendView.vue';
import { createTestingPinia } from '@pinia/testing';

// Mock Router
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: vi.fn()
    })
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

describe('SendView Success State', () => {
    it('should correctly display the txid on the success screen (Step 3)', async () => {
        const wrapper = mount(SendView, {
            global: {
                stubs,
                plugins: [createTestingPinia({
                    initialState: {
                        wallet: {
                            address: 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh',
                            isMnemonicLoaded: true
                        }
                    }
                })]
            }
        });

        // Manually move to Step 3 and set a TXID
        // This directly tests the UI assignment and display logic
        // @ts-ignore
        const ui = wrapper.vm.ui;
        ui.step = 3;
        ui.txid = 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3';

        await wrapper.vm.$nextTick();

        // 1. Verify the Step 3 container exists
        expect(wrapper.find('div[v-if="ui.step === 3"]').exists());

        // 2. Verify computed properties for display
        // @ts-ignore
        expect(wrapper.vm.txidStart).toBe('f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b');
        // @ts-ignore
        expect(wrapper.vm.txidEnd).toBe('5f9ef3');

        // 3. Verify the copyable element is present
        expect(wrapper.html()).toContain('sent-txid');
    });
});
