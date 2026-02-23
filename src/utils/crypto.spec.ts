import * as bitcoin from 'bitcoinjs-lib';
import { describe, it, expect, vi } from 'vitest';
import {
  generateMnemonic,
  validateMnemonic,
  deriveAddress,
  deriveSigner,
  parseDerivationPath,
  createSignedTx,
  signMessage,
  type UTXO,
  estimateTxSize,
  isValidAddress,
  getInvalidMnemonicWords
} from './crypto';
import { RIBBITS_PER_PEP } from './constants';

// Mock bitcoinjs-lib
vi.mock('bitcoinjs-lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('bitcoinjs-lib')>();
  return {
    ...actual,
    Psbt: vi.fn().mockImplementation(function (this: any) {
      this.version = 0;
      this.addInput = vi.fn();
      this.addOutput = vi.fn();
      this.signAllInputs = vi.fn();
      this.finalizeAllInputs = vi.fn();
      this.extractTransaction = vi.fn().mockReturnValue({
        toHex: () => 'signed-hex-output'
      });
    })
  };
});

describe('Crypto Utils', () => {
  const mnemonic = 'suffer dish east miss seat great brother hello motion mountain celery plunge';

  it('should generate a valid 12-word mnemonic', () => {
    const m = generateMnemonic();
    expect(validateMnemonic(m)).toBe(true);
    expect(m.split(' ').length).toBe(12);
  });

  it('should derive a Pepecoin address starting with P', () => {
    const addr = deriveAddress(mnemonic);
    expect(addr.startsWith('P')).toBe(true);
    expect(addr).toBe('PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU');
  });

  it('should return consistency for the same mnemonic with different indices', () => {
    const a1 = deriveAddress(mnemonic, 0, 0);
    const a2 = deriveAddress(mnemonic, 0, 0);
    expect(a1).toBe(a2);

    const a3 = deriveAddress(mnemonic, 1, 0);
    expect(a3).not.toBe(a1);

    const a4 = deriveAddress(mnemonic, 0, 1);
    expect(a4).not.toBe(a1);
    expect(a4).not.toBe(a3);
  });

  it('should correctly parse a derivation path and strip hardened suffixes', () => {
    const path = "m/44'/3434'/1'/0/5";
    const parsed = parseDerivationPath(path);

    expect(parsed.purpose).toBe(44);
    expect(parsed.coinType).toBe(3434);
    expect(parsed.accountIndex).toBe(1);
    expect(parsed.change).toBe(0);
    expect(parsed.addressIndex).toBe(5);
  });

  it('should validate the provided address', () => {
    const validAddress = 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU';
    expect(isValidAddress(validAddress)).toBe(true);
    expect(isValidAddress('PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU')).toBe(true); // Derived address
    expect(isValidAddress('PinvalidAddressHere')).toBe(false);
  });

  it('should handle different mnemonic separators', () => {
    const messy =
      'suffer, dish  east\nmiss\rseat\tgreat brother hello motion mountain celery plunge';
    const normalized = messy
      .replace(/[,\s\n\r\t]+/g, ' ')
      .trim()
      .toLowerCase();
    expect(validateMnemonic(normalized)).toBe(true);
    expect(normalized.split(' ').length).toBe(12);
  });

  it('should estimate transaction size correctly', () => {
    // 1 input, 2 outputs: 1*148 + 2*34 + 10 = 148 + 68 + 10 = 226
    expect(estimateTxSize(1, 2)).toBe(226);
  });

  it('should return empty array for valid mnemonic words', () => {
    expect(getInvalidMnemonicWords('suffer dish east ')).toEqual([]);
  });

  it('should detect invalid mnemonic words', () => {
    expect(getInvalidMnemonicWords('suffer lxfxfjxjh east')).toEqual(['lxfxfjxjh']);
  });

  it('should detect multiple invalid words', () => {
    expect(getInvalidMnemonicWords('xfoo suffer xbaz ')).toEqual(['xfoo', 'xbaz']);
  });

  it('should return empty array for empty input', () => {
    expect(getInvalidMnemonicWords('')).toEqual([]);
    expect(getInvalidMnemonicWords('   ')).toEqual([]);
  });

  it('should not validate the word currently being typed', () => {
    // 'suf' is incomplete — should not be flagged
    expect(getInvalidMnemonicWords('suffer suf')).toEqual([]);
    // but once followed by a space, it should be checked
    expect(getInvalidMnemonicWords('suffer suf ')).toEqual(['suf']);
  });

  it('should derive a signer with a valid publicKey', () => {
    const signer = deriveSigner(mnemonic, 0, 0);
    expect(signer.publicKey).toBeDefined();
    expect(signer.publicKey.length).toBe(33); // compressed public key
    expect(typeof signer.sign).toBe('function');
  });

  it('should derive different signers for different indices', () => {
    const s0 = deriveSigner(mnemonic, 0, 0);
    const s1 = deriveSigner(mnemonic, 1, 0);
    expect(Buffer.from(s0.publicKey).toString('hex')).not.toBe(
      Buffer.from(s1.publicKey).toString('hex')
    );

    const s2 = deriveSigner(mnemonic, 0, 1);
    expect(Buffer.from(s0.publicKey).toString('hex')).not.toBe(
      Buffer.from(s2.publicKey).toString('hex')
    );
  });

  describe('Message Signing', () => {
    it('should return a base64 signature string', () => {
      const sig = signMessage(mnemonic, 'Hello Pepecoin');
      expect(typeof sig).toBe('string');
      // Base64 regex
      expect(sig).toMatch(/^[A-Za-z0-9+/]+=*$/);
    });

    it('should produce deterministic signatures for the same message', () => {
      const sig1 = signMessage(mnemonic, 'test message');
      const sig2 = signMessage(mnemonic, 'test message');
      expect(sig1).toBe(sig2);
    });

    it('should produce different signatures for different messages', () => {
      const sig1 = signMessage(mnemonic, 'message A');
      const sig2 = signMessage(mnemonic, 'message B');
      expect(sig1).not.toBe(sig2);
    });

    it('should produce different signatures for different account indices', () => {
      const sig1 = signMessage(mnemonic, 'same message', 0, 0);
      const sig2 = signMessage(mnemonic, 'same message', 1, 0);
      expect(sig1).not.toBe(sig2);
    });
  });

  describe('Transaction Signing', () => {
    const toAddress = 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU';
    // Valid Pepecoin transaction hex structure (version 1, 1 input, 1 output)
    const validDummyHex =
      '0100000001bc9606ba9ed606fa66006000000000000000000000000000000000000000000000000000ffffffff0100e1f505000000001976a91476a91476a91476a91476a91476a91476a91476a91488ac00000000';
    const txid1 = '0'.repeat(64);
    const txid2 = '1'.repeat(64);
    const signer = deriveSigner(mnemonic);
    const mockUtxos: UTXO[] = [
      { txid: txid1, vout: 0, value: RIBBITS_PER_PEP, rawHex: validDummyHex },
      { txid: txid2, vout: 1, value: RIBBITS_PER_PEP, rawHex: validDummyHex }
    ];

    it('should throw error if funds are insufficient', async () => {
      await expect(
        createSignedTx(signer, toAddress, RIBBITS_PER_PEP * 3, mockUtxos, RIBBITS_PER_PEP * 0.01)
      ).rejects.toThrow('Insufficient funds to cover amount and fee');
    });

    it('should throw error if rawHex is missing', async () => {
      const badUtxos: UTXO[] = [{ txid: 'tx1', vout: 0, value: RIBBITS_PER_PEP * 2 }];
      await expect(
        createSignedTx(signer, toAddress, RIBBITS_PER_PEP, badUtxos, RIBBITS_PER_PEP * 0.01)
      ).rejects.toThrow('Missing raw hex');
    });

    it('should successfully create a signed transaction hex', async () => {
      const signedHex = await createSignedTx(
        signer,
        toAddress,
        RIBBITS_PER_PEP,
        mockUtxos,
        RIBBITS_PER_PEP * 0.01
      );

      expect(signedHex).toBe('signed-hex-output');
    });
  });
});
