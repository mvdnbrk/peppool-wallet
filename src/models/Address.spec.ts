import { describe, it, expect } from 'vitest';
import { Address } from './Address';

describe('Address Model', () => {
  const fullAddress = 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU';

  it('should return the full string via toString()', () => {
    const addr = new Address(fullAddress);
    expect(addr.toString()).toBe(fullAddress);
    expect(addr.value).toBe(fullAddress);
  });

  it('should return a truncated string with ellipsis', () => {
    const addr = new Address(fullAddress);
    expect(addr.truncated).toBe('PmuXQD…7rFZSU');
  });

  it('should return start and end pieces from truncateId', () => {
    const addr = new Address('abcdefghijklmnop');
    // truncateId uses 6 as default endLength
    expect(addr.start).toBe('abcdefghij');
    expect(addr.end).toBe('klmnop');
  });

  it('should handle short addresses gracefully', () => {
    const addr = new Address('abc');
    expect(addr.truncated).toBe('abc');
    expect(addr.start).toBe('');
    expect(addr.end).toBe('abc');
  });

  it('should handle empty input', () => {
    const addr = new Address('');
    expect(addr.truncated).toBe('');
    expect(addr.start).toBe('');
    expect(addr.end).toBe('');
  });
});
