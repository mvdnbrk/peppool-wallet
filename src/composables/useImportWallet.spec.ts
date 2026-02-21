import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useImportWallet } from './useImportWallet';
import { useApp } from '@/composables/useApp';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

// Mock dependencies
vi.mock('@/composables/useApp');

const VALID_MNEMONIC =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

describe('useImportWallet Composable', () => {
  let mockWallet: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWallet = {
      importWallet: vi.fn().mockResolvedValue(true)
    };
    vi.mocked(useApp).mockReturnValue({
      wallet: mockWallet
    } as any);

    // Mock chrome.storage.session
    (global as any).chrome = {
      storage: {
        session: {
          get: vi.fn().mockResolvedValue({}),
          set: vi.fn().mockResolvedValue(undefined),
          remove: vi.fn().mockResolvedValue(undefined)
        }
      }
    };
  });

  it('should initialize with empty mnemonic', () => {
    const { mnemonic, invalidWords, isValid } = useImportWallet();
    expect(mnemonic.value).toBe('');
    expect(invalidWords.value).toEqual([]);
    expect(isValid.value).toBe(false);
  });

  it('should restore draft from session storage on mount', async () => {
    vi.mocked(chrome.storage.session.get).mockResolvedValue({
      import_draft_mnemonic: 'restored word',
      import_draft_ts: Date.now()
    });

    const TestComponent = defineComponent({
      setup() {
        const { mnemonic } = useImportWallet();
        return { mnemonic };
      },
      template: '<div></div>'
    });

    const wrapper = mount(TestComponent);
    await flushPromises();

    expect(chrome.storage.session.get).toHaveBeenCalled();
    expect(wrapper.vm.mnemonic).toBe('restored word');
  });

  it('should persist draft to session storage on change', async () => {
    const { mnemonic } = useImportWallet();
    mnemonic.value = 'new word';
    await flushPromises();

    expect(chrome.storage.session.set).toHaveBeenCalledWith(
      expect.objectContaining({ import_draft_mnemonic: 'new word' })
    );
  });

  it('should validate mnemonic and word list', () => {
    const { mnemonic, isValid, invalidWords } = useImportWallet();

    // Invalid word
    mnemonic.value = 'notaword ';
    expect(invalidWords.value).toContain('notaword');
    expect(isValid.value).toBe(false);

    // Valid mnemonic
    mnemonic.value = VALID_MNEMONIC;
    expect(invalidWords.value).toEqual([]);
    expect(isValid.value).toBe(true);
  });

  it('should sanitize mnemonic by replacing commas and normalizing whitespace', () => {
    const { mnemonic, sanitizeMnemonic } = useImportWallet();
    mnemonic.value = 'word1, word2,,  word3';
    sanitizeMnemonic();
    expect(mnemonic.value).toBe('word1 word2 word3');
  });

  it('should call importWallet and clear draft on success', async () => {
    const { mnemonic, importAction } = useImportWallet();
    mnemonic.value = VALID_MNEMONIC;

    await importAction('Password123!', 'Password123!');

    expect(mockWallet.importWallet).toHaveBeenCalledWith(VALID_MNEMONIC, 'Password123!');
    expect(chrome.storage.session.remove).toHaveBeenCalled();
  });

  it('should throw error on password mismatch', async () => {
    const { mnemonic, importAction } = useImportWallet();
    mnemonic.value = VALID_MNEMONIC;

    await expect(importAction('Password123!', 'mismatch-long-enough')).rejects.toThrow(
      'Passwords do not match'
    );
  });
});
