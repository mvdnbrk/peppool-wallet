import { describe, it, expect } from 'vitest';
import { Transaction, type RawTransaction } from './Transaction';

const mockRawTx: RawTransaction = {
  txid: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  version: 1,
  locktime: 0,
  vin: [
    {
      txid: 'prev-tx',
      vout: 0,
      prevout: { scriptpubkey_address: 'user-address', value: 100000000 }
    }
  ],
  vout: [
    { scriptpubkey_address: 'other-address', value: 50000000 },
    { scriptpubkey_address: 'user-address', value: 40000000 }
  ],
  size: 226,
  weight: 904,
  fee: 10000000,
  status: {
    confirmed: true,
    block_height: 100,
    block_time: 1700000000
  }
};

describe('Transaction Model', () => {
  const userAddress = 'user-address';

  it('should identify outgoing transactions correctly', () => {
    const tx = new Transaction(mockRawTx, userAddress);
    expect(tx.isOutgoing).toBe(true);
  });

  it('should calculate outgoing value correctly (excluding change)', () => {
    const tx = new Transaction(mockRawTx, userAddress);
    expect(tx.valueRibbits).toBe(50000000);
    expect(tx.valuePep).toBe(0.5);
  });

  it('should format amount correctly with sign', () => {
    const tx = new Transaction(mockRawTx, userAddress);
    expect(tx.formattedAmount).toBe('-0.5');
  });

  it('should identify incoming transactions correctly', () => {
    const incomingRaw: RawTransaction = {
      ...mockRawTx,
      vin: [
        {
          txid: 'someone-else-tx',
          vout: 0,
          prevout: { scriptpubkey_address: 'someone-else', value: 100000000 }
        }
      ]
    };
    const tx = new Transaction(incomingRaw, userAddress);
    expect(tx.isOutgoing).toBe(false);
    expect(tx.valueRibbits).toBe(40000000);
    expect(tx.formattedAmount).toBe('+0.4');
  });

  it('should handle pending status correctly', () => {
    const pendingRaw: RawTransaction = { ...mockRawTx, status: { confirmed: false } };
    const tx = new Transaction(pendingRaw, userAddress);
    expect(tx.isConfirmed).toBe(false);
    expect(tx.blockHeight).toBe(null);
    expect(tx.date).toBe('');
  });

  it('should provide short txid formats', () => {
    const tx = new Transaction(mockRawTx, userAddress);
    expect(tx.txidShort).toBe('12345678...90abcdef');
  });

  it('should sum all outputs for self-send (consolidation) transactions', () => {
    const selfSendRaw: RawTransaction = {
      ...mockRawTx,
      vout: [
        { scriptpubkey_address: 'user-address', value: 30000000 },
        { scriptpubkey_address: 'user-address', value: 60000000 }
      ]
    };
    const tx = new Transaction(selfSendRaw, userAddress);
    expect(tx.isOutgoing).toBe(true);
    expect(tx.valueRibbits).toBe(90000000);
  });

  describe('Status Display', () => {
    it('should return correct label and color for confirmed outgoing', () => {
      const tx = new Transaction(mockRawTx, userAddress);
      expect(tx.statusLabel).toBe('Sent');
      expect(tx.statusColor).toBe('text-offwhite');
    });

    it('should return correct label and color for unconfirmed outgoing', () => {
      const raw = { ...mockRawTx, status: { confirmed: false } };
      const tx = new Transaction(raw, userAddress);
      expect(tx.statusLabel).toBe('Sending');
      expect(tx.statusColor).toBe('text-yellow-500');
    });

    it('should return correct label and color for confirmed incoming', () => {
      const raw = {
        ...mockRawTx,
        vin: [
          {
            txid: 'other',
            vout: 0,
            prevout: { scriptpubkey_address: 'other', value: 100000000 }
          }
        ]
      };
      const tx = new Transaction(raw, userAddress);
      expect(tx.statusLabel).toBe('Received');
      expect(tx.statusColor).toBe('text-pep-green-light');
    });

    it('should return correct label and color for unconfirmed incoming', () => {
      const raw = {
        ...mockRawTx,
        status: { confirmed: false },
        vin: [
          {
            txid: 'other',
            vout: 0,
            prevout: { scriptpubkey_address: 'other', value: 100000000 }
          }
        ]
      };
      const tx = new Transaction(raw, userAddress);
      expect(tx.statusLabel).toBe('Receiving');
      expect(tx.statusColor).toBe('text-yellow-500');
    });
  });
});
