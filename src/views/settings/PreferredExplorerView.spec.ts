import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PreferredExplorerView from './PreferredExplorerView.vue';
import { useApp } from '@/composables/useApp';
import PepRadioList from '@/components/ui/form/PepRadioList.vue';

// Mock useApp
const pushMock = vi.fn();
const backMock = vi.fn();
vi.mock('@/composables/useApp');

describe('PreferredExplorerView', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockWallet = {
      selectedExplorer: 'peppool',
      setExplorer: vi.fn()
    };
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock, back: backMock } as any,
      wallet: mockWallet
    } as any);
  });

  const global = {
    components: {
      PepRadioList
    }
  };

  it('should render and handle selection', async () => {
    const wrapper = mount(PreferredExplorerView, { global });
    expect(wrapper.text()).toContain('Select Explorer');

    const radioList = wrapper.findComponent(PepRadioList);
    await radioList.vm.$emit('update:modelValue', 'pepeblocks');

    expect(mockWallet.setExplorer).toHaveBeenCalledWith('pepeblocks');
    vi.advanceTimersByTime(200);
    expect(backMock).toHaveBeenCalled();
  });
});
