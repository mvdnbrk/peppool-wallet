import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { reactive } from 'vue';
import InscriptionDetailView from './InscriptionDetailView.vue';
import { useApp } from '@/composables/useApp';
import { useInscriptionStore } from '@/stores/inscriptions';
import * as api from '@/utils/api';
import type { Inscription } from '@/models/Inscription';

vi.mock('@/composables/useApp');
vi.mock('@/stores/inscriptions');
vi.mock('@/utils/api', () => ({
  fetchInscription: vi.fn()
}));

const stubs = {
  PepMainLayout: {
    template: '<div><slot name="header" /><slot /><slot name="actions" /></div>'
  },
  PepPageHeader: { template: '<div />', props: ['title', 'onBack'] },
  PepSpinner: { template: '<div />' },
  PepCard: { template: '<div><slot /></div>' },
  PepCopyableId: { template: '<div />', props: ['id', 'label'] },
  PepButton: {
    template: '<button @click="$emit(\'click\')"><slot /></button>'
  },
  PepInscriptionContent: {
    template: '<div class="stub-content" />',
    props: ['id', 'contentType', 'interactive']
  }
};

function makeInscription(overrides: Partial<Inscription> = {}): Inscription {
  return {
    id: 'abc123i0',
    number: 42,
    contentType: 'image/png',
    contentLength: 2048,
    height: 100,
    value: 10000,
    parents: [],
    properties: null,
    satpoint: 'aa:0:0',
    timestamp: 1700000000,
    ...overrides
  };
}

function mockStore(inscriptions: Record<string, Inscription>) {
  vi.mocked(useInscriptionStore).mockReturnValue(
    reactive({
      inscriptions,
      outputs: [],
      lastSyncedHeight: 0,
      utxoValueRibbits: 0,
      syncing: false
    }) as any
  );
}

describe('InscriptionDetailView', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  function bindRoute(id: string) {
    vi.mocked(useApp).mockReturnValue({
      router: { push: pushMock } as any,
      route: { params: { id } } as any,
      wallet: {} as any,
      account: {} as any,
      settings: {} as any
    } as any);
  }

  it('uses the inscription from the store when available without fetching', async () => {
    mockStore({ abc123i0: makeInscription() });
    bindRoute('abc123i0');

    const wrapper = mount(InscriptionDetailView, { global: { stubs } });
    await flushPromises();

    expect(api.fetchInscription).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('#42');
    expect(wrapper.text()).toContain('image/png');
  });

  it('fetches the inscription when missing from the store', async () => {
    mockStore({});
    bindRoute('xyz9i0');
    vi.mocked(api.fetchInscription).mockResolvedValue(makeInscription({ id: 'xyz9i0', number: 7 }));

    const wrapper = mount(InscriptionDetailView, { global: { stubs } });
    await flushPromises();

    expect(api.fetchInscription).toHaveBeenCalledWith('xyz9i0');
    expect(wrapper.text()).toContain('#7');
  });

  it('navigates to the send-inscription route when Send is clicked', async () => {
    mockStore({ abc123i0: makeInscription() });
    bindRoute('abc123i0');

    const wrapper = mount(InscriptionDetailView, { global: { stubs } });
    await flushPromises();
    await wrapper.find('#send-inscription').trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/send-inscription/abc123i0');
  });
});
