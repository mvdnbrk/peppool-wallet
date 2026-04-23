import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useWalletStore } from './wallet';
import { useLockoutStore } from './lockout';

import { Transaction } from '@/models/Transaction';
import * as api from '@/utils/api';

// Mock the API and Crypto utils
vi.mock('@/utils/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils/api')>();
  return {
    ...actual,
    fetchAddressInfo: vi.fn(() => Promise.resolve(100000000)),
    fetchPepPrice: vi.fn(() => Promise.resolve({ USD: 0.5, EUR: 0.4 })),
    fetchTransactions: vi.fn(() => Promise.resolve([])),
    hasAddressActivity: vi.fn(() => Promise.resolve(false)),
    fetchRecommendedFees: vi.fn(() =>
      Promise.resolve({ fastestFee: 1, halfHourFee: 1, hourFee: 1, economyFee: 1, minimumFee: 1 })
    ),
    fetchTipHeight: vi.fn(() => Promise.resolve(100)),
    fetchUtxos: vi.fn(() =>
      Promise.resolve([{ txid: 'a', vout: 0, value: 100000000, status: { confirmed: true } }])
    ),
    fetchInscriptionOutputs: vi.fn(() => Promise.resolve([])),
    fetchAddressInscriptions: vi.fn(() =>
      Promise.resolve({ inscriptions: [], outputs: [], total: 0 })
    ),
    fetchInscription: vi.fn()
  };
});

describe('Wallet Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize as not created', () => {
    const store = useWalletStore();
    expect(store.isCreated).toBe(false);
    expect(store.isUnlocked).toBe(false);
    expect(store.canLoadMore).toBe(true);
  });

  it('should create a wallet and persist it', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    expect(store.isCreated).toBe(true);
    expect(store.isUnlocked).toBe(true);
    expect(store.address).not.toBeNull();
    expect(store.accounts).toHaveLength(1);
    expect(store.accounts[0].label).toBe('Account 1');
    expect(store.accounts[0].path).toBe("m/44'/3434'/0'/0/0");
    expect(localStorage.getItem('peppool_vault')).not.toBeNull();
    expect(localStorage.getItem('peppool_accounts')).not.toBeNull();
  });

  it('should sync accounts to chrome.storage.local on wallet creation', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        peppool_accounts: expect.any(String),
        peppool_active_account: '0'
      })
    );
  });

  it('should sync accounts to chrome.storage.local on switchAccount', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');
    vi.mocked(global.chrome.storage.local.set).mockClear();

    await store.addAccount('Account 2');

    expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        peppool_active_account: '1'
      })
    );
  });

  it('should unlock an existing wallet', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');
    const originalAddress = store.address;

    store.lock();
    expect(store.isUnlocked).toBe(false);
    vi.mocked(chrome.storage.session.set).mockClear();

    const success = await store.unlock('password123');
    expect(success).toBe(true);
    expect(store.isUnlocked).toBe(true);
    expect(store.address).toBe(originalAddress);
    expect(chrome.storage.session.set).toHaveBeenCalledWith(
      expect.objectContaining({ sessionStartTime: expect.any(Number) })
    );
  });

  it('should fail unlock if mnemonic derives different primary address', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');
    store.lock();

    // Manually corrupt the stored accounts in localStorage
    localStorage.setItem(
      'peppool_accounts',
      JSON.stringify([
        {
          address: 'PcorruptedAddress',
          path: "m/44'/3434'/0'/0/0",
          label: 'Account 1'
        }
      ])
    );
    localStorage.setItem('peppool_active_account', '0');

    // Re-init store from corrupted localStorage
    setActivePinia(createPinia());
    const freshStore = useWalletStore();

    const success = await freshStore.unlock('password123');
    expect(success).toBe(false);
    expect(freshStore.isUnlocked).toBe(false);
  });

  it('should handle failed unlock and trigger lockout after 5 attempts', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');
    store.lock();

    // 5 attempts should trigger 30s lockout
    for (let i = 0; i < 5; i++) {
      const success = await store.unlock('wrong-pass');
      expect(success).toBe(false);
    }

    const lockout = useLockoutStore();
    expect(lockout.isLockedOut).toBe(true);
    expect(lockout.lockoutUntil).toBeGreaterThan(Date.now());
  });

  it('should auto-unlock via checkSession if chrome.storage has mnemonic', async () => {
    localStorage.setItem('peppool_vault', 'any-vault');
    localStorage.setItem(
      'peppool_accounts',
      JSON.stringify([{ address: 'any-addr', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }])
    );
    localStorage.setItem('peppool_active_account', '0');

    // Mock chrome.storage.session.get — store returns sessionStartTime and dataKey
    (global.chrome.storage.session.get as any).mockResolvedValue({
      sessionStartTime: Date.now(),
      dataKey: '0102030405060708091011121314151617181920212223242526272829303132' // 32-byte AES key as hex
    });

    const store = useWalletStore();
    const success = await store.checkSession();
    expect(success).toBe(true);
    expect(store.isUnlocked).toBe(true);
    expect(store.isMnemonicLoaded).toBe(true);
  });

  it('should import a wallet with a mnemonic', async () => {
    const store = useWalletStore();
    const mnemonic = 'suffer dish east miss seat great brother hello motion mountain celery plunge';
    await store.importWallet(mnemonic, 'newpassword');

    expect(store.isCreated).toBe(true);
    expect(store.isUnlocked).toBe(true);
    expect(store.address).toBe('PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU');
    expect(store.accounts).toHaveLength(1);
    expect(chrome.storage.session.set).toHaveBeenCalledWith(
      expect.objectContaining({ sessionStartTime: expect.any(Number) })
    );
  });

  it('should perform a full wallet reset', async () => {
    const store = useWalletStore();
    localStorage.setItem('other_app_key', 'keep-me');
    await store.createWallet('password123');
    store.prices.USD = 10;

    expect(store.isCreated).toBe(true);
    await store.resetWallet();

    expect(store.address).toBeNull();
    expect(store.accounts).toHaveLength(0);
    expect(store.isCreated).toBe(false);
    expect(store.prices.USD).toBe(0);
    expect(localStorage.getItem('peppool_vault')).toBeNull();
    expect(localStorage.getItem('other_app_key')).toBe('keep-me');
    expect(chrome.storage.local.remove).toHaveBeenCalledWith('peppool_permissions');
    expect(chrome.storage.session.remove).toHaveBeenCalledWith(['sessionStartTime', 'dataKey']);
  });

  it('encryptedMnemonic should be exposed as readonly', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    const original = store.encryptedMnemonic;
    expect(original).toBeTruthy();

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      (store as any).encryptedMnemonic = 'hacked';
    } catch {
      // Expected
    }

    expect(store.encryptedMnemonic).toBe(original);
    warnSpy.mockRestore();
  });

  it('should switch accounts correctly', async () => {
    const store = useWalletStore();
    // Manually setup two accounts
    store.accounts = [
      { address: 'addr1', path: "m/44'/3434'/0'/0/0", label: 'Account 1' },
      { address: 'addr2', path: "m/44'/3434'/1'/0/0", label: 'Account 2' }
    ];
    store.activeAccountIndex = 0;

    await store.switchAccount(1);
    expect(store.address).toBe('addr2');
    expect(localStorage.getItem('peppool_active_account')).toBe('1');
    expect(store.balance).toBe(1); // Should be refreshed on switch
    expect(store.transactions).toHaveLength(0); // Should be cleared on switch
  });

  it('should add a new account correctly', async () => {
    const store = useWalletStore();
    const mnemonic = 'suffer dish east miss seat great brother hello motion mountain celery plunge';
    await store.importWallet(mnemonic, 'password123');

    expect(store.accounts).toHaveLength(1);

    await store.addAccount('Savings');
    expect(store.accounts).toHaveLength(2);
    expect(store.accounts[1].label).toBe('Savings');
    expect(store.accounts[1].path).toBe("m/44'/3434'/1'/0/0");
    expect(store.address).toBe(store.accounts[1].address);
    expect(store.address).not.toBe(store.accounts[0].address);
  });

  it('should throw error when adding account without mnemonic', async () => {
    const store = useWalletStore();
    // No import/unlock, so no mnemonic
    await expect(store.addAccount()).rejects.toThrow('Wallet is locked');
  });

  it('should rename an account correctly', async () => {
    const store = useWalletStore();
    store.accounts = [{ address: 'addr1', path: "m/44'/3434'/0'/0/0", label: 'Old Name' }];

    await store.renameAccount(0, 'New Name');
    expect(store.accounts[0].label).toBe('New Name');
    expect(JSON.parse(localStorage.getItem('peppool_accounts')!).length).toBe(1);
    expect(JSON.parse(localStorage.getItem('peppool_accounts')!)[0].label).toBe('New Name');
  });

  it('should sync accounts to chrome.storage.local on changes', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        peppool_accounts: expect.any(String),
        peppool_active_account: '0'
      })
    );
  });

  it('should calculate fiat balance correctly', async () => {
    const store = useWalletStore();
    // Mock an account
    store.accounts = [
      {
        address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
        path: "m/44'/3434'/0'/0/0",
        label: 'Account 1'
      }
    ];
    store.activeAccountIndex = 0;

    await store.refreshBalance();

    store.setCurrency('USD');
    expect(store.balanceFiat).toBe(0.5); // 1 PEP * 0.5 USD

    store.setCurrency('EUR');
    expect(store.balanceFiat).toBe(0.4); // 1 PEP * 0.4 EUR
  });

  it('should compute spendable balance excluding inscription UTXOs', async () => {
    const store = useWalletStore();
    store.accounts = [
      {
        address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
        path: "m/44'/3434'/0'/0/0",
        label: 'Account 1'
      }
    ];
    store.activeAccountIndex = 0;

    vi.mocked(api.fetchAddressInfo).mockResolvedValue(300000000); // 3 PEP total
    vi.mocked(api.fetchUtxos).mockResolvedValue([
      { txid: 'spendable1', vout: 0, value: 200000000, status: { confirmed: true } },
      { txid: 'inscribed1', vout: 1, value: 10000, status: { confirmed: true } },
      { txid: 'spendable2', vout: 0, value: 99990000, status: { confirmed: true } }
    ]);
    vi.mocked(api.fetchAddressInscriptions).mockResolvedValue({
      inscriptions: [],
      outputs: ['inscribed1:1'],
      total: 0
    });

    await store.refreshBalance(true);

    expect(store.balance).toBe(3); // Total balance
    expect(store.spendableBalance).toBe(2.9999); // Excludes inscription UTXO (10000 ribbits)
  });

  it('should fall back to total balance when inscription fetch fails', async () => {
    const store = useWalletStore();
    store.accounts = [
      {
        address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
        path: "m/44'/3434'/0'/0/0",
        label: 'Account 1'
      }
    ];
    store.activeAccountIndex = 0;

    vi.mocked(api.fetchAddressInfo).mockResolvedValue(100000000);
    vi.mocked(api.fetchUtxos).mockRejectedValue(new Error('Network error'));

    await store.refreshBalance(true);

    expect(store.balance).toBe(1);
    expect(store.spendableBalance).toBe(1); // Falls back to total
  });

  it('should handle currency changes correctly', () => {
    const store = useWalletStore();
    expect(store.selectedCurrency).toBe('USD');

    store.setCurrency('EUR');
    expect(store.selectedCurrency).toBe('EUR');
    expect(store.currencySymbol).toBe('€');
    expect(localStorage.getItem('peppool_currency')).toBe('EUR');
  });

  it('should handle explorer changes correctly', () => {
    const store = useWalletStore();
    expect(store.selectedExplorer).toBe('peppool');

    store.setExplorer('pepeblocks');
    expect(store.selectedExplorer).toBe('pepeblocks');
    expect(localStorage.getItem('peppool_explorer')).toBe('pepeblocks');
  });

  it('should open explorer links through actions', () => {
    const store = useWalletStore();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    store.openExplorerTx('tx123');
    expect(openSpy).toHaveBeenCalledWith('https://peppool.space/tx/tx123', '_blank');

    store.setExplorer('pepeblocks');
    store.openExplorerAddress('addr123');
    expect(openSpy).toHaveBeenCalledWith('https://pepeblocks.com/address/addr123', '_blank');

    openSpy.mockRestore();
  });

  it('should update and persist lock duration', () => {
    const store = useWalletStore();
    expect(store.lockDuration).toBe(15);

    store.setLockDuration(180);
    expect(store.lockDuration).toBe(180);
    expect(localStorage.getItem('peppool_lock_duration')).toBe('180');
  });

  it('should trigger lock after timeout', async () => {
    vi.useFakeTimers();
    const store = useWalletStore();
    store.isUnlocked = true;
    store.setLockDuration(15);
    await store.resetLockTimer();

    vi.advanceTimersByTime(14 * 60 * 1000);
    expect(store.isUnlocked).toBe(true);

    vi.advanceTimersByTime(2 * 60 * 1000);
    expect(store.isUnlocked).toBe(false);

    vi.useRealTimers();
  });

  it('withMnemonic decrypts on demand using session key', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    expect(store.isMnemonicLoaded).toBe(true);
    const mnemonic = await store.withMnemonic((m) => m);
    expect(mnemonic.split(' ')).toHaveLength(12);
  });

  it('withMnemonic throws when wallet is locked', async () => {
    const store = useWalletStore();
    await store.createWallet('password123');

    await store.lock();
    expect(store.isMnemonicLoaded).toBe(false);
    await expect(store.withMnemonic((m) => m)).rejects.toThrow('Wallet is locked');
  });

  describe('Transaction Caching', () => {
    const mockTx = {
      txid: 'f1e24cd438c630792bdeacf8509eaad1e7248ba4314633189e17da069b5f9ef3',
      version: 1,
      locktime: 0,
      vin: [],
      vout: [
        {
          value: 100000000,
          scriptpubkey: '',
          scriptpubkey_address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU'
        }
      ],
      status: {
        confirmed: true,
        block_height: 100,
        block_hash: '...',
        block_time: Date.now() / 1000
      }
    };

    it('should cache transactions in localStorage when refreshed', async () => {
      const api = await import('@/utils/api');
      vi.mocked(api.fetchTransactions).mockResolvedValue([mockTx] as any);

      const store = useWalletStore();
      store.accounts = [
        {
          address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
          path: "m/44'/3434'/0'/0/0",
          label: 'Account 1'
        }
      ];
      store.activeAccountIndex = 0;

      await store.refreshTransactions();

      const cached = localStorage.getItem('peppool_transactions');
      expect(cached).not.toBeNull();
      expect(JSON.parse(cached!)).toHaveLength(1);
      expect(JSON.parse(cached!)[0].txid).toBe(mockTx.txid);
    });

    it('should restore transactions from cache on initialization', () => {
      localStorage.setItem('peppool_transactions', JSON.stringify([mockTx]));
      localStorage.setItem('peppool_active_account', '0');
      localStorage.setItem(
        'peppool_accounts',
        JSON.stringify([
          {
            address: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
            path: "m/44'/3434'/0'/0/0",
            label: 'Account 1'
          }
        ])
      );

      const store = useWalletStore();
      expect(store.transactions).toHaveLength(1);
      expect(store.transactions[0]!.txid).toBe(mockTx.txid);
    });

    it('should clear cached transactions on lock', async () => {
      localStorage.setItem('peppool_transactions', JSON.stringify([mockTx]));
      const store = useWalletStore();

      await store.lock();
      expect(localStorage.getItem('peppool_transactions')).toBeNull();
    });

    it('should clear cached transactions on resetWallet', async () => {
      localStorage.setItem('peppool_transactions', JSON.stringify([mockTx]));
      const store = useWalletStore();

      await store.resetWallet();
      expect(localStorage.getItem('peppool_transactions')).toBeNull();
    });

    it('should fetch more transactions and append them uniquely', async () => {
      const api = await import('@/utils/api');
      const store = useWalletStore();
      const addr = 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU';
      store.accounts = [{ address: addr, path: "m/44'/3434'/0'/0/0", label: 'Account 1' }];
      store.activeAccountIndex = 0;

      // Setup initial transactions
      const tx1 = { ...mockTx, txid: 'tx1' };
      store.transactions = [new Transaction(tx1, addr)];

      // Mock API to return a full page of transactions
      const fullPage = Array(25)
        .fill(null)
        .map((_, i) => ({ ...mockTx, txid: `page-${i}` }));
      vi.mocked(api.fetchTransactions).mockResolvedValue(fullPage as any);

      const hasMore = await store.fetchMoreTransactions();

      expect(hasMore).toBe(true);
      expect(store.canLoadMore).toBe(true);

      // Mock API to return nothing (end of list)
      vi.mocked(api.fetchTransactions).mockResolvedValue([]);
      const hasNoMore = await store.fetchMoreTransactions();
      expect(hasNoMore).toBe(false);
      expect(store.canLoadMore).toBe(false);
    });
  });

  describe('Account Discovery', () => {
    it('should discover multiple used accounts on import', async () => {
      const api = await import('../utils/api');
      const store = useWalletStore();
      const mnemonic =
        'suffer dish east miss seat great brother hello motion mountain celery plunge';

      // Mock sequential activity checks: Account 1 used, Account 2 used, Account 3 unused
      vi.mocked(api.hasAddressActivity).mockResolvedValueOnce(true);
      vi.mocked(api.hasAddressActivity).mockResolvedValueOnce(true);
      vi.mocked(api.hasAddressActivity).mockResolvedValueOnce(false);

      await store.importWallet(mnemonic, 'password123');

      expect(store.accounts).toHaveLength(3); // Account 1 + 2 + 3 (0, 1, 2 indices)
      expect(store.accounts[1].label).toBe('Account 2');
      expect(store.accounts[2].label).toBe('Account 3');
    });

    it('should stop discovery at first gap', async () => {
      const api = await import('../utils/api');
      const store = useWalletStore();
      const mnemonic =
        'suffer dish east miss seat great brother hello motion mountain celery plunge';

      vi.mocked(api.hasAddressActivity).mockResolvedValueOnce(false); // Account 1 unused

      await store.importWallet(mnemonic, 'password123');

      expect(store.accounts).toHaveLength(1); // Only Account 1 (index 0)
    });
  });

  describe('Background Synchronization', () => {
    it('should sync accounts to chrome.storage on import', async () => {
      const store = useWalletStore();
      const mnemonic =
        'suffer dish east miss seat great brother hello motion mountain celery plunge';
      await store.importWallet(mnemonic, 'password123');

      expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          peppool_accounts: expect.any(String),
          peppool_active_account: '0'
        })
      );
    });

    it('should sync active account index on switchAccount', async () => {
      const store = useWalletStore();
      store.accounts = [
        { address: 'addr1', path: "m/44'/3434'/0'/0/0", label: 'Account 1' },
        { address: 'addr2', path: "m/44'/3434'/1'/0/0", label: 'Account 2' }
      ];

      await store.switchAccount(1);

      expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          peppool_active_account: '1'
        })
      );
    });

    it('should sync accounts on addAccount', async () => {
      const store = useWalletStore();
      const mnemonic =
        'suffer dish east miss seat great brother hello motion mountain celery plunge';
      await store.importWallet(mnemonic, 'password123');
      vi.clearAllMocks();

      await store.addAccount('New Account');

      expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          peppool_accounts: expect.stringContaining('New Account')
        })
      );
    });
  });
});
