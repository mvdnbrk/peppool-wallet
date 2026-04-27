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
    localStorage.setItem('peppool_prices', '{"USD":0.001,"EUR":0.0009}');
    localStorage.setItem('peppool_inscriptions_Paddr1', '{}');
    localStorage.setItem('peppool_auth_token', 'tok');
    localStorage.setItem('peppool_auth_expires', '999');
    localStorage.setItem('peppool_auth_address', 'Paddr');

    const wiped = wipeCacheOnVersionChange();

    expect(wiped).toBe(true);
    expect(localStorage.getItem('peppool_balance')).toBeNull();
    expect(localStorage.getItem('peppool_transactions')).toBeNull();
    expect(localStorage.getItem('peppool_prices')).toBeNull();
    expect(localStorage.getItem('peppool_inscriptions_Paddr1')).toBeNull();
    expect(localStorage.getItem('peppool_auth_token')).toBeNull();
    expect(localStorage.getItem('peppool_auth_expires')).toBeNull();
    expect(localStorage.getItem('peppool_auth_address')).toBeNull();
  });

  it('should preserve vault (only persistent localStorage key)', () => {
    localStorage.setItem('peppool_app_version', '1.0.0');
    localStorage.setItem('peppool_vault', 'encrypted-mnemonic');

    wipeCacheOnVersionChange();

    expect(localStorage.getItem('peppool_vault')).toBe('encrypted-mnemonic');
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
