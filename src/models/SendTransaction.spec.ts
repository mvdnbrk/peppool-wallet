import { describe, it, expect } from 'vitest';
import { SendTransaction } from './SendTransaction';
import type { RecommendedFees } from '../utils/api';
import { RIBBITS_PER_PEP, RECOMMENDED_FEE_RATE } from '../utils/constants';
import { estimateTxSize } from '../utils/crypto';

function createTx(
  utxoValues: number[] = [],
  fees: Partial<RecommendedFees> | null = null
): SendTransaction {
  const tx = new SendTransaction('PmiGhUQAajpEe9uZbWz2k9XDbxdYbHKhdh');
  tx.utxos = utxoValues.map((value, i) => ({
    txid: `${'0'.repeat(63)}${i}`,
    vout: 0,
    value
  }));
  if (fees) {
    tx.fees = {
      fastestFee: 1,
      halfHourFee: 1,
      hourFee: 1,
      economyFee: 1,
      minimumFee: 1,
      ...fees
    };
  }
  return tx;
}

describe('SendTransaction', () => {
  describe('balance', () => {
    it('should sum UTXO values for balanceRibbits', () => {
      const tx = createTx([100_000_000, 50_000_000]);
      expect(tx.balanceRibbits).toBe(150_000_000);
    });

    it('should convert to PEP correctly', () => {
      const tx = createTx([100_000_000]);
      expect(tx.balancePep).toBe(1.0);
    });

    it('should return 0 for empty UTXOs', () => {
      const tx = createTx([]);
      expect(tx.balanceRibbits).toBe(0);
      expect(tx.balancePep).toBe(0);
    });
  });

  describe('amountRibbits', () => {
    it('should convert PEP to ribbits as integer', () => {
      const tx = createTx([RIBBITS_PER_PEP]);
      tx.amountPep = 0.5;
      expect(tx.amountRibbits).toBe(50_000_000);
    });

    it('should floor fractional ribbits', () => {
      const tx = createTx([RIBBITS_PER_PEP]);
      tx.amountPep = 0.123456789;
      expect(tx.amountRibbits).toBe(12_345_678); // Floored, not 12_345_678.9
      expect(Number.isInteger(tx.amountRibbits)).toBe(true);
    });

    it('should be 0 when amountPep is 0', () => {
      const tx = createTx([RIBBITS_PER_PEP]);
      tx.amountPep = 0;
      expect(tx.amountRibbits).toBe(0);
    });
  });

  describe('fee estimation', () => {
    it('should use RECOMMENDED_FEE_RATE as fallback when no API fees', () => {
      const tx = createTx([RIBBITS_PER_PEP * 10]);
      tx.amountPep = 1;
      tx.recipient = 'PmockRecipientAddress1234567890123';

      const fee = tx.estimatedFeeRibbits;
      // With no API fees, should use RECOMMENDED_FEE_RATE
      // 1 input, 2 outputs (non-max): size = 1*148 + 2*34 + 10 = 226
      const expectedSize = estimateTxSize(1, 2);
      expect(fee).toBe(Math.ceil(expectedSize * RECOMMENDED_FEE_RATE));
    });

    it('should use API fee when higher than RECOMMENDED_FEE_RATE', () => {
      const highFee = RECOMMENDED_FEE_RATE * 2;
      const tx = createTx([RIBBITS_PER_PEP * 10], { fastestFee: highFee });
      tx.amountPep = 1;
      tx.recipient = 'PmockRecipientAddress1234567890123';

      const expectedSize = estimateTxSize(1, 2);
      expect(tx.estimatedFeeRibbits).toBe(Math.ceil(expectedSize * highFee));
    });

    it('should enforce RECOMMENDED_FEE_RATE as minimum even if API suggests lower', () => {
      const lowFee = 100; // Way below RECOMMENDED_FEE_RATE
      const tx = createTx([RIBBITS_PER_PEP * 10], { fastestFee: lowFee });
      tx.amountPep = 1;
      tx.recipient = 'PmockRecipientAddress1234567890123';

      const expectedSize = estimateTxSize(1, 2);
      // Should use RECOMMENDED_FEE_RATE, not the low API fee
      expect(tx.estimatedFeeRibbits).toBe(Math.ceil(expectedSize * RECOMMENDED_FEE_RATE));
    });

    it('should estimate 1 output when sending max', () => {
      const tx = createTx([RIBBITS_PER_PEP * 2]);
      // Set amount to max
      tx.amountPep = tx.calculateMaxPep();
      tx.recipient = 'PmockRecipientAddress1234567890123';

      // Max sends use 1 output (no change)
      const expectedSize = estimateTxSize(1, 1);
      expect(tx.estimatedFeeRibbits).toBe(Math.ceil(expectedSize * RECOMMENDED_FEE_RATE));
    });
  });

  describe('maxRibbits / calculateMaxPep', () => {
    it('should calculate max as balance minus fee for 1-output tx', () => {
      const balance = RIBBITS_PER_PEP * 5;
      const tx = createTx([balance]);

      const expectedFee = Math.ceil(estimateTxSize(1, 1) * RECOMMENDED_FEE_RATE);
      expect(tx.maxRibbits).toBe(balance - expectedFee);
      expect(tx.calculateMaxPep()).toBe(tx.maxRibbits / RIBBITS_PER_PEP);
    });

    it('should return 0 when balance is less than fee', () => {
      const tx = createTx([1000]); // Tiny balance, less than any fee
      expect(tx.maxRibbits).toBe(0);
      expect(tx.calculateMaxPep()).toBe(0);
    });

    it('should account for multiple UTXOs in fee calculation', () => {
      // More inputs = larger tx = higher fee = less max
      const singleUtxo = createTx([RIBBITS_PER_PEP * 5]);
      const multiUtxo = createTx([
        RIBBITS_PER_PEP,
        RIBBITS_PER_PEP,
        RIBBITS_PER_PEP,
        RIBBITS_PER_PEP,
        RIBBITS_PER_PEP
      ]);

      // Same total balance, but multi-UTXO should have lower max due to higher fees
      expect(singleUtxo.balanceRibbits).toBe(multiUtxo.balanceRibbits);
      expect(multiUtxo.maxRibbits).toBeLessThan(singleUtxo.maxRibbits);
    });
  });

  describe('UTXO selection', () => {
    it('should select all UTXOs when isMax is true', () => {
      const tx = createTx([RIBBITS_PER_PEP, RIBBITS_PER_PEP * 2, RIBBITS_PER_PEP * 3]);
      const { selectedUtxos, totalValue } = tx.selectUtxos(true);
      expect(selectedUtxos.length).toBe(3);
      expect(totalValue).toBe(RIBBITS_PER_PEP * 6);
    });

    it('should select minimal UTXOs to cover amount + fees', () => {
      const tx = createTx([RIBBITS_PER_PEP * 5, RIBBITS_PER_PEP * 3, RIBBITS_PER_PEP * 1]);
      tx.amountPep = 0.5; // Small amount, first UTXO should suffice

      const { selectedUtxos } = tx.selectUtxos(false);
      expect(selectedUtxos.length).toBe(1);
    });

    it('should select multiple UTXOs when needed for larger amounts', () => {
      const tx = createTx([RIBBITS_PER_PEP, RIBBITS_PER_PEP, RIBBITS_PER_PEP]);
      tx.amountPep = 2.5;

      const { selectedUtxos } = tx.selectUtxos(false);
      expect(selectedUtxos.length).toBe(3);
    });

    it('should return empty array when there are no UTXOs', () => {
      const tx = createTx([]);
      tx.amountPep = 1;
      const { selectedUtxos, totalValue } = tx.selectUtxos(true);
      expect(selectedUtxos.length).toBe(0);
      expect(totalValue).toBe(0);
    });
  });

  describe('isValid', () => {
    it('should be invalid with no recipient', () => {
      const tx = createTx([RIBBITS_PER_PEP * 10]);
      tx.amountPep = 1;
      tx.recipient = '';
      expect(tx.isValid).toBe(false);
    });

    it('should be invalid with zero amount', () => {
      const tx = createTx([RIBBITS_PER_PEP * 10]);
      tx.amountPep = 0;
      tx.recipient = 'PmockRecipientAddress1234567890123';
      expect(tx.isValid).toBe(false);
    });

    it('should be invalid when amount + fee exceeds balance', () => {
      const tx = createTx([RIBBITS_PER_PEP]);
      tx.amountPep = 1; // Exactly balance, no room for fee
      tx.recipient = 'PmockRecipientAddress1234567890123';
      expect(tx.isValid).toBe(false);
    });

    it('should be valid when balance covers amount + fee', () => {
      const tx = createTx([RIBBITS_PER_PEP * 10]);
      tx.amountPep = 1;
      tx.recipient = 'PmockRecipientAddress1234567890123';
      expect(tx.isValid).toBe(true);
    });

    it('should be valid at max amount', () => {
      const tx = createTx([RIBBITS_PER_PEP * 5]);
      tx.recipient = 'PmockRecipientAddress1234567890123';
      tx.amountPep = tx.calculateMaxPep();
      expect(tx.isValid).toBe(true);
    });
  });

  describe('integer safety', () => {
    it('isMax detection should work with integer comparison, not float epsilon', () => {
      const tx = createTx([RIBBITS_PER_PEP * 2]);
      tx.recipient = 'PmockRecipientAddress1234567890123';

      const maxPep = tx.calculateMaxPep();
      tx.amountPep = maxPep;

      // The amountRibbits should >= maxRibbits (isMax = true)
      expect(tx.amountRibbits).toBeGreaterThanOrEqual(tx.maxRibbits);

      // Fee with isMax should be for 1 output
      const maxFee = Math.ceil(estimateTxSize(1, 1) * RECOMMENDED_FEE_RATE);
      expect(tx.estimatedFeeRibbits).toBe(maxFee);
    });

    it('should not have floating point errors affect isValid at boundary', () => {
      // Regression: with float comparison, 0.1 + 0.2 !== 0.3 could cause issues
      const tx = createTx([RIBBITS_PER_PEP * 10]);
      tx.recipient = 'PmockRecipientAddress1234567890123';
      tx.amountPep = 0.1 + 0.2; // Classic float issue
      // Should still be valid since 0.3 PEP is well within 10 PEP balance
      expect(tx.isValid).toBe(true);
    });
  });
});
