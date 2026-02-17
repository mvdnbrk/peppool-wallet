import { describe, it, expect } from 'vitest';
import { getPasswordStrength, getStrengthLabel, getStrengthColor, getStrengthBgColor, getStrengthWidth } from './password';

describe('Password Utilities', () => {
  describe('getPasswordStrength', () => {
    it('returns a low score for common passwords', () => {
      const result = getPasswordStrength('12345678');
      expect(result.score).toBeLessThan(2);
    });

    it('returns a high score for complex passwords', () => {
      const result = getPasswordStrength('Correct-Horse-Battery-Staple-2026!');
      expect(result.score).toBe(4);
    });

    it('sanitizes the confusing "abc" warning from zxcvbn', () => {
      const result = getPasswordStrength('12345');
      // zxcvbn usually gives: 'Common character sequences like "abc" are easy to guess.'
      expect(result.feedback.warning).not.toContain('"abc"');
      expect(result.feedback.warning).toBe('Common character sequences are easy to guess.');
    });
  });

  describe('getStrengthLabel', () => {
    it('returns correct uppercase labels', () => {
      expect(getStrengthLabel(0)).toBe('VERY WEAK');
      expect(getStrengthLabel(1)).toBe('WEAK');
      expect(getStrengthLabel(2)).toBe('FAIR');
      expect(getStrengthLabel(3)).toBe('STRONG');
      expect(getStrengthLabel(4)).toBe('EXCELLENT');
    });
  });

  describe('getStrengthWidth', () => {
    it('returns discrete widths for each score', () => {
      expect(getStrengthWidth(undefined)).toBe('0%');
      expect(getStrengthWidth(0)).toBe('10%');
      expect(getStrengthWidth(1)).toBe('25%');
      expect(getStrengthWidth(2)).toBe('50%');
      expect(getStrengthWidth(3)).toBe('75%');
      expect(getStrengthWidth(4)).toBe('100%');
    });
  });

  describe('getStrengthColor', () => {
    it('returns red for weak, yellow for fair, green for strong', () => {
      expect(getStrengthColor(0)).toBe('text-red-400');
      expect(getStrengthColor(1)).toBe('text-red-400');
      expect(getStrengthColor(2)).toBe('text-yellow-500');
      expect(getStrengthColor(3)).toBe('text-pep-green-light');
      expect(getStrengthColor(4)).toBe('text-pep-green-light');
    });
  });
});
