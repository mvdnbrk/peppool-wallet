import { describe, it, expect } from 'vitest';
import { formatAmount, formatFiat } from './constants';

describe('Constants Utilities', () => {
  describe('formatAmount', () => {
    it('should format small numbers with full precision', () => {
      expect(formatAmount(1234.56789)).toBe('1,234.56789');
    });

    it('should format millions with 2 decimals', () => {
      expect(formatAmount(1234567.89123)).toBe('1,234,567.89');
    });

    it('should format billions with 0 decimals', () => {
      expect(formatAmount(3643664907.738473)).toBe('3,643,664,908');
    });

    it('should handle zero correctly', () => {
      expect(formatAmount(0)).toBe('0');
    });
  });

  describe('formatFiat', () => {
    it('should format standard amounts with 2 decimals', () => {
      expect(formatFiat(12.3456)).toBe('12.35');
    });

    it('should format tiny amounts with extra precision', () => {
      expect(formatFiat(0.0001234)).toBe('0.00012');
    });
  });
});
