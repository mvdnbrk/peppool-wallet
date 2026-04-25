import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as api from './api';
import { resetSettingsState, saveSettings } from './settings';

vi.mock('./api', () => ({
  fetchPepPrice: vi.fn(() => Promise.resolve({ USD: 0.5, EUR: 0.4 }))
}));

// Must import after mocks are set up
import { getPrices, refreshPrices, clearPrices, convert, format, formatFiat } from './fiat';

describe('Fiat Module', () => {
  beforeEach(() => {
    localStorage.clear();
    clearPrices();
    resetSettingsState();
    vi.clearAllMocks();
  });

  describe('refreshPrices', () => {
    it('should fetch and cache prices', async () => {
      await refreshPrices();
      const prices = getPrices();
      expect(prices.USD).toBe(0.5);
      expect(prices.EUR).toBe(0.4);
      expect(localStorage.getItem('peppool_prices')).toBe('{"USD":0.5,"EUR":0.4}');
    });
  });

  describe('clearPrices', () => {
    it('should reset prices and remove cache', async () => {
      await refreshPrices();
      clearPrices();
      const prices = getPrices();
      expect(prices.USD).toBe(0);
      expect(prices.EUR).toBe(0);
      expect(localStorage.getItem('peppool_prices')).toBeNull();
    });
  });

  describe('convert', () => {
    it('should convert PEP to fiat using current currency setting', async () => {
      await refreshPrices();
      expect(convert(10)).toBe(5); // 10 PEP * 0.5 USD
    });

    it('should respect currency setting', async () => {
      await refreshPrices();
      await saveSettings({ currency: 'EUR' });
      expect(convert(10)).toBe(4); // 10 PEP * 0.4 EUR
    });

    it('should return 0 when no prices loaded', () => {
      expect(convert(10)).toBe(0);
    });
  });

  describe('format', () => {
    it('should format PEP amount as fiat string with symbol and code', async () => {
      await refreshPrices();
      expect(format(10)).toBe('$5.00 USD');
    });

    it('should format with EUR when currency is EUR', async () => {
      await refreshPrices();
      await saveSettings({ currency: 'EUR' });
      expect(format(10)).toBe('€4.00 EUR');
    });

    it('should handle zero balance', () => {
      expect(format(0)).toBe('$0.00 USD');
    });

    it('should handle tiny values with extra precision', async () => {
      vi.mocked(api.fetchPepPrice).mockResolvedValue({ USD: 0.00001, EUR: 0.000009 });
      await refreshPrices();
      expect(format(1)).toBe('$0.000010 USD');
    });
  });

  describe('formatFiat', () => {
    it('should format standard amounts with 2 decimals', () => {
      expect(formatFiat(12.3456)).toBe('12.35');
    });

    it('should format tiny amounts with extra precision', () => {
      expect(formatFiat(0.0001234)).toBe('0.00012');
    });

    it('should return 0.00 for NaN, Infinity, and -Infinity to avoid displaying garbage', () => {
      expect(formatFiat(NaN)).toBe('0.00');
      expect(formatFiat(Infinity)).toBe('0.00');
      expect(formatFiat(-Infinity)).toBe('0.00');
    });
  });
});
