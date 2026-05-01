import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { reactive } from 'vue';
import InscriptionsView from './InscriptionsView.vue';
import { useApp } from '@/composables/useApp';
import { useInscriptionStore } from '@/stores/inscriptions';
import type { Inscription } from '@/models/Inscription';

vi.mock('@/composables/useApp');
vi.mock('@/stores/inscriptions');

const stubs = {
  PepMainLayout: {
    template: '<div><slot name="header" /><slot /></div>'
  },
  PepPageHeader: { template: '<div />', props: ['title', 'onBack'] },
  PepSpinner: { template: '<div />' },
  PepInscriptionContent: {
    template: '<div class="stub-content" />',
    props: ['id', 'contentType', 'interactive']
  }
};

function makeInscription(overrides: Partial<Inscription> = {}): Inscription {
  return {
    id: 'abc123i0',
    number: 1,
    contentType: 'image/png',
    contentLength: 100,
    height: 1,
    value: 10000,
    parents: [],
    properties: null,
    satpoint: 'aa:0:0',
    timestamp: 1700000000,
    ...overrides
  };
}

function mockStore(inscriptions: Record<string, Inscription>, syncing = false) {
  vi.mocked(useInscriptionStore).mockReturnValue(
    reactive({
      inscriptions,
      outputs: [],
      lastSyncedHeight: 0,
      utxoValueRibbits: 0,
      syncing
    }) as any
  );
}

describe('InscriptionsView', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      route: { params: {} } as any,
      wallet: reactive({ isUnlocked: true, refreshBalance: vi.fn() }) as any,
      account: {} as any,
      settings: {} as any
    } as any);
  });

  it('renders the empty state when there are no inscriptions', async () => {
    mockStore({});
    const wrapper = mount(InscriptionsView, { global: { stubs } });
    await flushPromises();
    expect(wrapper.text()).toContain('No inscriptions yet');
  });

  it('renders one tile per inscription, sorted by number descending', async () => {
    mockStore({
      a: makeInscription({ id: 'a', number: 1 }),
      b: makeInscription({ id: 'b', number: 5 }),
      c: makeInscription({ id: 'c', number: 3 })
    });

    const wrapper = mount(InscriptionsView, { global: { stubs } });
    await flushPromises();

    const tiles = wrapper.findAll('button[type="button"]');
    expect(tiles.length).toBe(3);
    expect(tiles[0].text()).toContain('#5');
    expect(tiles[1].text()).toContain('#3');
    expect(tiles[2].text()).toContain('#1');
  });

  it('navigates to the detail route when a tile is clicked', async () => {
    mockStore({ a: makeInscription({ id: 'a', number: 1 }) });

    const wrapper = mount(InscriptionsView, { global: { stubs } });
    await flushPromises();
    await wrapper.find('button[type="button"]').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/inscription/a');
  });
});
