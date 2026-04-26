import * as v from 'valibot';
import { RIBBITS_PER_PEP, truncateId } from '@/utils/constants';

export const RawTransactionSchema = v.object({
  txid: v.string(),
  version: v.number(),
  locktime: v.number(),
  vin: v.array(
    v.object({
      txid: v.string(),
      vout: v.number(),
      prevout: v.nullable(
        v.object({
          scriptpubkey_address: v.string(),
          value: v.number()
        })
      )
    })
  ),
  vout: v.array(
    v.object({
      scriptpubkey_address: v.string(),
      value: v.number()
    })
  ),
  size: v.number(),
  weight: v.number(),
  fee: v.number(),
  status: v.object({
    confirmed: v.boolean(),
    block_height: v.optional(v.number()),
    block_time: v.optional(v.number())
  })
});

export type RawTransaction = v.InferOutput<typeof RawTransactionSchema>;

export class Transaction {
  public readonly raw: RawTransaction;
  public readonly userAddress: string;

  constructor(raw: RawTransaction, userAddress: string) {
    this.raw = raw;
    this.userAddress = userAddress;
  }

  get txid() {
    return this.raw.txid;
  }

  get fee() {
    return this.raw.fee / RIBBITS_PER_PEP;
  }

  get isConfirmed() {
    return this.raw.status.confirmed;
  }

  get confirmationLabel() {
    return this.isConfirmed ? 'Confirmed' : 'In mempool';
  }

  get statusLabel() {
    if (this.isConfirmed) {
      return this.isOutgoing ? 'Sent' : 'Received';
    }
    return this.isOutgoing ? 'Sending' : 'Receiving';
  }

  get statusColor() {
    if (!this.isConfirmed) return 'text-yellow-500';
    return this.isOutgoing ? 'text-offwhite' : 'text-pep-green-light';
  }

  get blockHeight() {
    return this.raw.status.block_height ?? null;
  }

  get date() {
    return this.raw.status.block_time
      ? new Date(this.raw.status.block_time * 1000).toLocaleString()
      : '';
  }

  get isOutgoing() {
    return this.raw.vin.some((vin) => vin.prevout?.scriptpubkey_address === this.userAddress);
  }

  get valueRibbits() {
    const userOutputs = this.raw.vout
      .filter((vout) => vout.scriptpubkey_address === this.userAddress)
      .reduce((sum, vout) => sum + vout.value, 0);

    if (this.isOutgoing) {
      // Net debit from this address: own inputs minus change back to self.
      // Using non-user vouts would overstate the amount when inputs are co-funded
      // by another address (the user's wallet only lost what they put in).
      const userInputs = this.raw.vin
        .filter((vin) => vin.prevout?.scriptpubkey_address === this.userAddress)
        .reduce((sum, vin) => sum + (vin.prevout?.value ?? 0), 0);
      return userInputs - userOutputs;
    }

    return userOutputs;
  }

  get valuePep() {
    return this.valueRibbits / RIBBITS_PER_PEP;
  }

  get formattedAmount() {
    const prefix = this.isOutgoing ? '-' : '+';
    return `${prefix}${parseFloat(this.valuePep.toFixed(8))}`;
  }

  get txidStart() {
    return truncateId(this.txid).start;
  }

  get txidEnd() {
    return truncateId(this.txid).end;
  }

  get txidShort() {
    return `${this.txid.slice(0, 8)}...${this.txid.slice(-8)}`;
  }
}
