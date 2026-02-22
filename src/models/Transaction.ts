import * as v from 'valibot';
import { RIBBITS_PER_PEP, truncateId } from '../utils/constants';

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
    if (this.isOutgoing) {
      const others = this.raw.vout.filter((vout) => vout.scriptpubkey_address !== this.userAddress);
      return others.length > 0
        ? others.reduce((sum, vout) => sum + vout.value, 0)
        : this.raw.vout.reduce((sum, vout) => sum + vout.value, 0);
    } else {
      return this.raw.vout
        .filter((vout) => vout.scriptpubkey_address === this.userAddress)
        .reduce((sum, vout) => sum + vout.value, 0);
    }
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
