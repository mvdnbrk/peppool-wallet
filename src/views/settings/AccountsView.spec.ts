import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AccountsView from './AccountsView.vue';
import { useApp } from '@/composables/useApp';
import PepButton from '@/components/ui/PepButton.vue';
import PepListItem from '@/components/ui/list/PepListItem.vue';
import PepIcon from '@/components/ui/PepIcon.vue';

// Mock useApp
const pushMock = vi.fn();
const backMock = vi.fn();
vi.mock('@/composables/useApp');

describe('AccountsView', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      accounts: [
        { address: 'addr1', path: "m/44'/3434'/0'/0/0", label: 'Account 1' },
        { address: 'addr2', path: "m/44'/3434'/1'/0/0", label: 'Account 2' }
      ],
      activeAccountIndex: 0,
      switchAccount: vi.fn().mockResolvedValue(undefined),
      addAccount: vi.fn().mockResolvedValue(undefined)
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock, back: backMock } as any,
      wallet: mockWallet
    } as any);
  });

  const global = {
    components: {
      PepButton,
      PepListItem,
      PepIcon
    },
    stubs: {
      PepMainLayout: { template: '<div><slot name="header"/><slot /><slot name="actions"/></div>' },
      PepPageHeader: { template: '<div>Accounts</div>' },
      PepList: { template: '<div><slot /></div>' }
    }
  };

  it('should render account list', () => {
    const wrapper = mount(AccountsView, { global });
    expect(wrapper.text()).toContain('Account 1');
    expect(wrapper.text()).toContain('Account 2');
    expect(wrapper.find('#account-item-0').exists()).toBe(true);
    expect(wrapper.find('#account-item-1').exists()).toBe(true);
  });

  it('should switch account on click', async () => {
    const wrapper = mount(AccountsView, { global });
    await wrapper.find('#account-item-1').trigger('click');

    expect(mockWallet.switchAccount).toHaveBeenCalledWith(1);
    expect(backMock).toHaveBeenCalled();
  });

  it('should navigate to rename page', async () => {
    const wrapper = mount(AccountsView, { global });
    await wrapper.find('#rename-account-button-0').trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/settings/accounts/rename/0');
  });

  it('should call addAccount on button click', async () => {
    const wrapper = mount(AccountsView, { global });
    await wrapper.find('#add-account-button').trigger('click');

    expect(mockWallet.addAccount).toHaveBeenCalled();
  });
});
