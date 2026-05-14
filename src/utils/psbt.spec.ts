import { describe, it, expect } from 'vitest';
import {
  ALLOWED_SIGHASHES,
  SIGHASH,
  getInputSighash,
  sighashLabel,
  validatePsbtParams
} from './psbt';

const VALID_ADDR = 'PJGSjPmY3PzGyE54M3VGiRaEQFBhxuokV1';
const VALID_ADDR_2 = 'PWnYJiJtFWcksb6Ex4WaPEoa5y3CnXzVmh';

describe('sighashLabel', () => {
  it('labels common flags', () => {
    expect(sighashLabel(SIGHASH.ALL)).toBe('SIGHASH_ALL');
    expect(sighashLabel(SIGHASH.SINGLE_ANYONECANPAY)).toBe('SIGHASH_SINGLE | ANYONECANPAY');
  });

  it('falls back to hex for unknown flags', () => {
    expect(sighashLabel(0x05)).toBe('0x05');
  });
});

describe('ALLOWED_SIGHASHES', () => {
  it('includes SIGHASH_ALL and SIGHASH_SINGLE | ANYONECANPAY', () => {
    expect(ALLOWED_SIGHASHES.has(SIGHASH.ALL)).toBe(true);
    expect(ALLOWED_SIGHASHES.has(SIGHASH.SINGLE_ANYONECANPAY)).toBe(true);
  });

  it('excludes plain SINGLE/NONE and ANYONECANPAY variants of ALL/NONE', () => {
    expect(ALLOWED_SIGHASHES.has(SIGHASH.NONE)).toBe(false);
    expect(ALLOWED_SIGHASHES.has(SIGHASH.SINGLE)).toBe(false);
    expect(ALLOWED_SIGHASHES.has(SIGHASH.ALL_ANYONECANPAY)).toBe(false);
    expect(ALLOWED_SIGHASHES.has(SIGHASH.NONE_ANYONECANPAY)).toBe(false);
  });
});

describe('getInputSighash', () => {
  it('returns SIGHASH_ALL when input has no sighashType', () => {
    const psbt = { data: { inputs: [{}] } } as any;
    expect(getInputSighash(psbt, 0)).toBe(SIGHASH.ALL);
  });

  it('returns the explicit sighashType when set', () => {
    const psbt = { data: { inputs: [{ sighashType: SIGHASH.SINGLE_ANYONECANPAY }] } } as any;
    expect(getInputSighash(psbt, 0)).toBe(SIGHASH.SINGLE_ANYONECANPAY);
  });
});

describe('validatePsbtParams', () => {
  it('accepts a minimal valid request', () => {
    expect(validatePsbtParams({ psbt: 'base64', signInputs: { [VALID_ADDR]: [0] } })).toBeNull();
  });

  it('accepts multiple addresses with multiple indices', () => {
    expect(
      validatePsbtParams({
        psbt: 'base64',
        signInputs: { [VALID_ADDR]: [0], [VALID_ADDR_2]: [1, 2] },
        broadcast: true
      })
    ).toBeNull();
  });

  it('rejects missing psbt', () => {
    expect(validatePsbtParams({ signInputs: { [VALID_ADDR]: [0] } })).toContain('psbt');
  });

  it('rejects missing signInputs', () => {
    expect(validatePsbtParams({ psbt: 'base64' })).toContain('signInputs is required');
  });

  it('rejects empty signInputs', () => {
    expect(validatePsbtParams({ psbt: 'base64', signInputs: {} })).toContain('at least one');
  });

  it('rejects invalid address keys', () => {
    expect(validatePsbtParams({ psbt: 'base64', signInputs: { bc1qxyz: [0] } })).toContain(
      'Invalid address'
    );
  });

  it('rejects empty index arrays', () => {
    expect(validatePsbtParams({ psbt: 'base64', signInputs: { [VALID_ADDR]: [] } })).toContain(
      'non-empty array'
    );
  });

  it('rejects negative or non-integer indices', () => {
    expect(validatePsbtParams({ psbt: 'base64', signInputs: { [VALID_ADDR]: [-1] } })).toContain(
      'invalid index'
    );
    expect(validatePsbtParams({ psbt: 'base64', signInputs: { [VALID_ADDR]: [1.5] } })).toContain(
      'invalid index'
    );
  });

  it('rejects duplicate indices for the same address', () => {
    expect(validatePsbtParams({ psbt: 'base64', signInputs: { [VALID_ADDR]: [0, 0] } })).toContain(
      'duplicate'
    );
  });

  it('rejects non-boolean broadcast', () => {
    expect(
      validatePsbtParams({
        psbt: 'base64',
        signInputs: { [VALID_ADDR]: [0] },
        broadcast: 'yes'
      })
    ).toContain('broadcast');
  });
});
