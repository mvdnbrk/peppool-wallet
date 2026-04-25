import { describe, it, expect } from 'vitest';
import { truncateId } from './constants';

describe('Constants Utilities', () => {
  describe('truncateId', () => {
    it('should split a long id into start and end', () => {
      const result = truncateId('abcdefghijklmnop');
      expect(result.start).toBe('abcdefghij');
      expect(result.end).toBe('klmnop');
      expect(result.full).toBe('abcdefghijklmnop');
    });

    it('should handle strings shorter than endLength gracefully', () => {
      const result = truncateId('abc');
      expect(result.start).toBe('');
      expect(result.end).toBe('abc');
    });

    it('should return empty strings for empty input', () => {
      const result = truncateId('');
      expect(result).toEqual({ start: '', end: '', full: '' });
    });
  });
});
