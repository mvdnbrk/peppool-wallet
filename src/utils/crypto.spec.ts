import { describe, it, expect } from 'vitest';
import { generateMnemonic, validateMnemonic, deriveWallet, createSignedTx, type UTXO, estimateTxSize, isValidAddress } from './crypto';
import { RIBBITS_PER_PEP } from './constants';

describe('Crypto Utils', () => {
  const mnemonic = 'suffer dish east miss seat great brother hello motion mountain celery plunge';
  
  it('should generate a valid 12-word mnemonic', () => {
    const m = generateMnemonic();
    expect(validateMnemonic(m)).toBe(true);
    expect(m.split(' ').length).toBe(12);
  });

  it('should derive a Pepecoin address starting with P', () => {
    const wallet = deriveWallet(mnemonic);
    expect(wallet.address.startsWith('P')).toBe(true);
    expect(wallet.address).toBe('PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');
  });

  it('should derive consistent addresses for the same mnemonic', () => {
    const w1 = deriveWallet(mnemonic, 0);
    const w2 = deriveWallet(mnemonic, 0);
    expect(w1.address).toBe(w2.address);
    
    const w3 = deriveWallet(mnemonic, 1);
    expect(w3.address).not.toBe(w1.address);
  });

  it('should validate the provided address', () => {
    const validAddress = 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh';
    expect(isValidAddress(validAddress)).toBe(true);
    expect(isValidAddress('PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh')).toBe(true); // Derived address
    expect(isValidAddress('PinvalidAddressHere')).toBe(false);
  });

  it('should handle different mnemonic separators', () => {
    const messy = 'suffer, dish  east\nmiss\rseat\tgreat brother hello motion mountain celery plunge';
    const normalized = messy.replace(/[,\s\n\r\t]+/g, ' ').trim().toLowerCase();
    expect(validateMnemonic(normalized)).toBe(true);
    expect(normalized.split(' ').length).toBe(12);
  });

  it('should estimate transaction size correctly', () => {
    // 1 input, 2 outputs: 1*148 + 2*34 + 10 = 148 + 68 + 10 = 226
    expect(estimateTxSize(1, 2)).toBe(226);
  });

  describe('Transaction Signing', () => {
    const toAddress = 'PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh';
    // Use a more valid minimal transaction hex
    const validDummyHex = '010000000100000000000000000000000000000000000000000000000000000000000000000000000000ffffffff0100000000000000000000000000000000';
    const txid1 = '0'.repeat(64);
    const txid2 = '1'.repeat(64);
    const mockUtxos: UTXO[] = [
      { txid: txid1, vout: 0, value: RIBBITS_PER_PEP, rawHex: validDummyHex },
      { txid: txid2, vout: 1, value: RIBBITS_PER_PEP, rawHex: validDummyHex },
    ];

    it('should throw error if funds are insufficient', async () => {
      await expect(createSignedTx(mnemonic, toAddress, RIBBITS_PER_PEP * 3, mockUtxos, RIBBITS_PER_PEP * 0.01))
        .rejects.toThrow('Insufficient funds to cover amount and fee');
    });

    it('should throw error if rawHex is missing', async () => {
      const badUtxos: UTXO[] = [{ txid: 'tx1', vout: 0, value: RIBBITS_PER_PEP * 2 }];
      await expect(createSignedTx(mnemonic, toAddress, RIBBITS_PER_PEP, badUtxos, RIBBITS_PER_PEP * 0.01))
        .rejects.toThrow('Missing raw hex');
    });
  });
});
