import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ResetWalletView from './ResetWalletView.vue';
import { createTestingPinia } from '@pinia/testing';
import { useWalletStore } from '../stores/wallet';

// Mock Router
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: pushMock
    })
}));

// Mock global components
const stubs = {
    PepHeader: { template: '<div><slot /></div>' },
    PepCheckbox: {
        template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
        props: ['modelValue']
    },
    PepButton: {
        template: '<button @click="$emit(\'click\')"><slot /></button>',
        props: ['disabled']
    }
};

describe('ResetWalletView Feature', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call resetWallet and redirect to home on confirm', async () => {
        const wrapper = mount(ResetWalletView, {
            global: {
                stubs,
                plugins: [createTestingPinia({
                    stubActions: false
                })]
            }
        });

        const walletStore = useWalletStore();
        const resetSpy = vi.spyOn(walletStore, 'resetWallet');

        // 1. Initial state: button should be disabled
        const button = wrapper.find('button');
        // Check disabled state via vm because of stub
        // @ts-ignore
        expect(wrapper.vm.confirmedBackup).toBe(false);

        // 2. Check the checkbox
        const checkbox = wrapper.find('input[type="checkbox"]');
        await checkbox.setValue(true);
        // @ts-ignore
        expect(wrapper.vm.confirmedBackup).toBe(true);

        // 3. Click reset
        await button.trigger('click');

        // 4. VERIFY: wallet is reset and user redirected
        expect(resetSpy).toHaveBeenCalled();
        expect(pushMock).toHaveBeenCalledWith('/');
    });
});
