import { describe, it, expect, vi, beforeEach } from 'vitest';

// Must mock constants BEFORE importing cache module
vi.mock('./constants', () => ({
  APP_VERSION: '2.0.0'
}));

import { wipeCacheOnVersionChange } from './cache';

describe('wipeCacheOnVersionChange', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should wipe derived cache keys when version changes', () => {
    localStorage.setItem('peppool_app_version', '1.0.0');
    localStorage.setItem('peppool_balance', '42');
    localStorage.setItem('peppool_transactions', '[{"txid":"1"}]');
    localStorage.setItem('peppool_price_usd', '0.001');
    localStorage.setItem('peppool_price_eur', '0.0009');
    localStorage.setItem('peppool_inscriptions_Paddr1', '{}');
    localStorage.setItem('peppool_auth_token', 'tok');
    localStorage.setItem('peppool_auth_expires', '999');
    localStorage.setItem('peppool_auth_address', 'Paddr');
    localStorage.setItem('peppool_last_route', '/send');
    localStorage.setItem('peppool_form_send', '{"recipient":"x"}');

    const wiped = wipeCacheOnVersionChange();

    expect(wiped).toBe(true);
    expect(localStorage.getItem('peppool_balance')).toBeNull();
    expect(localStorage.getItem('peppool_transactions')).toBeNull();
    expect(localStorage.getItem('peppool_price_usd')).toBeNull();
    expect(localStorage.getItem('peppool_price_eur')).toBeNull();
    expect(localStorage.getItem('peppool_inscriptions_Paddr1')).toBeNull();
    expect(localStorage.getItem('peppool_auth_token')).toBeNull();
    expect(localStorage.getItem('peppool_auth_expires')).toBeNull();
    expect(localStorage.getItem('peppool_auth_address')).toBeNull();
    expect(localStorage.getItem('peppool_last_route')).toBeNull();
    expect(localStorage.getItem('peppool_form_send')).toBeNull();
  });

  it('should preserve user data and settings', () => {
    localStorage.setItem('peppool_app_version', '1.0.0');
    localStorage.setItem('peppool_vault', 'encrypted-mnemonic');
    localStorage.setItem('peppool_accounts', '[{"address":"P1"}]');
    localStorage.setItem('peppool_active_account', '0');
    localStorage.setItem('peppool_currency', 'EUR');
    localStorage.setItem('peppool_explorer', 'pepeblocks');
    localStorage.setItem('peppool_lock_duration', '30');
    localStorage.setItem('peppool_failed_attempts', '2');
    localStorage.setItem('peppool_lockout_until', '1700000000');

    wipeCacheOnVersionChange();

    expect(localStorage.getItem('peppool_vault')).toBe('encrypted-mnemonic');
    expect(localStorage.getItem('peppool_accounts')).toBe('[{"address":"P1"}]');
    expect(localStorage.getItem('peppool_active_account')).toBe('0');
    expect(localStorage.getItem('peppool_currency')).toBe('EUR');
    expect(localStorage.getItem('peppool_explorer')).toBe('pepeblocks');
    expect(localStorage.getItem('peppool_lock_duration')).toBe('30');
    expect(localStorage.getItem('peppool_failed_attempts')).toBe('2');
    expect(localStorage.getItem('peppool_lockout_until')).toBe('1700000000');
  });

  it('should update stored version after wipe', () => {
    localStorage.setItem('peppool_app_version', '1.0.0');

    wipeCacheOnVersionChange();

    expect(localStorage.getItem('peppool_app_version')).toBe('2.0.0');
  });

  it('should not wipe when version matches', () => {
    localStorage.setItem('peppool_app_version', '2.0.0');
    localStorage.setItem('peppool_balance', '42');
    localStorage.setItem('peppool_transactions', '[{"txid":"1"}]');

    const wiped = wipeCacheOnVersionChange();

    expect(wiped).toBe(false);
    expect(localStorage.getItem('peppool_balance')).toBe('42');
    expect(localStorage.getItem('peppool_transactions')).toBe('[{"txid":"1"}]');
  });

  it('should wipe on first launch (no stored version)', () => {
    localStorage.setItem('peppool_balance', '42');
    localStorage.setItem('peppool_vault', 'keep-me');

    const wiped = wipeCacheOnVersionChange();

    expect(wiped).toBe(true);
    expect(localStorage.getItem('peppool_balance')).toBeNull();
    expect(localStorage.getItem('peppool_vault')).toBe('keep-me');
    expect(localStorage.getItem('peppool_app_version')).toBe('2.0.0');
  });

  it('should not touch non-peppool keys', () => {
    localStorage.setItem('peppool_app_version', '1.0.0');
    localStorage.setItem('some_other_app', 'data');

    wipeCacheOnVersionChange();

    expect(localStorage.getItem('some_other_app')).toBe('data');
  });
});
