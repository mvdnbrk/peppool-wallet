import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useImportWallet } from './useImportWallet';
import { useApp } from '@/composables/useApp';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, createApp } from 'vue';

// Mock dependencies
vi.mock('@/composables/useApp');

const VALID_MNEMONIC =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

// Helper to test composables that use lifecycle hooks
function withSetup<T>(composable: () => T): [T, ReturnType<typeof createApp>] {
  let result: T;
  const app = createApp(
    defineComponent({
      setup() {
        result = composable();
        return () => {};
      }
    })
  );
  app.mount(document.createElement('div'));
  return [result!, app];
}

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
    const [composable] = withSetup(() => useImportWallet());
    expect(composable.mnemonic.value).toBe('');
    expect(composable.invalidWords.value).toEqual([]);
    expect(composable.isValid.value).toBe(false);
  });

  it('should restore draft from session storage on mount', async () => {
    vi.mocked(chrome.storage.session.get).mockResolvedValue({
      import_draft_mnemonic: 'restored word',
      import_draft_ts: Date.now()
    });

    const [composable] = withSetup(() => useImportWallet());
    await flushPromises();

    expect(chrome.storage.session.get).toHaveBeenCalled();
    expect(composable.mnemonic.value).toBe('restored word');
  });

  it('should persist draft to session storage on change', async () => {
    const [composable] = withSetup(() => useImportWallet());
    composable.mnemonic.value = 'new word';
    await flushPromises();

    expect(chrome.storage.session.set).toHaveBeenCalledWith(
      expect.objectContaining({ import_draft_mnemonic: 'new word' })
    );
  });

  it('should validate mnemonic and word list', () => {
    const [composable] = withSetup(() => useImportWallet());

    // Invalid word
    composable.mnemonic.value = 'notaword ';
    expect(composable.invalidWords.value).toContain('notaword');
    expect(composable.isValid.value).toBe(false);

    // Valid mnemonic
    composable.mnemonic.value = VALID_MNEMONIC;
    expect(composable.invalidWords.value).toEqual([]);
    expect(composable.isValid.value).toBe(true);
  });

  it('should sanitize mnemonic by replacing commas and normalizing whitespace', () => {
    const [composable] = withSetup(() => useImportWallet());
    composable.mnemonic.value = 'word1, word2,,  word3';
    composable.sanitizeMnemonic();
    expect(composable.mnemonic.value).toBe('word1 word2 word3');
  });

  it('should call importWallet and clear draft on success', async () => {
    const [composable] = withSetup(() => useImportWallet());
    composable.mnemonic.value = VALID_MNEMONIC;

    await composable.importAction('Password123!', 'Password123!');

    expect(mockWallet.importWallet).toHaveBeenCalledWith(VALID_MNEMONIC, 'Password123!');
    expect(chrome.storage.session.remove).toHaveBeenCalled();
  });

  it('should throw error on password mismatch', async () => {
    const [composable] = withSetup(() => useImportWallet());
    composable.mnemonic.value = VALID_MNEMONIC;

    await expect(composable.importAction('Password123!', 'mismatch-long-enough')).rejects.toThrow(
      'Passwords do not match'
    );
  });
});
