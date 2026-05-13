import { estimateTxSize, type UTXO } from '@/utils/crypto';
import type { RecommendedFees } from '@/models/Fees';
import { RIBBITS_PER_PEP, RECOMMENDED_FEE_RATE, P2PKH_OUTPUT_BYTES } from '@/utils/constants';

export class SendTransaction {
  public utxos: UTXO[] = [];
  public fees: RecommendedFees | null = null;
  public recipient: string = '';
  public amountRibbits: number = 0;
  public readonly userAddress: string;

  constructor(userAddress: string) {
    this.userAddress = userAddress;
  }

  get amountPep(): string {
    if (this.amountRibbits === 0) return '0';

    const s = this.amountRibbits.toString().padStart(9, '0');
    const integerPart = s.slice(0, -8).replace(/^0+(?=\d)/, '');
    const decimalPart = s.slice(-8).replace(/0+$/, '');

    return decimalPart ? `${integerPart || '0'}.${decimalPart}` : integerPart;
  }

  set amountPep(val: number | string) {
    const numericVal = typeof val === 'string' ? parseFloat(val) : val;
    this.amountRibbits = Math.round((numericVal || 0) * RIBBITS_PER_PEP);
  }

  get balanceRibbits(): number {
    return this.utxos.reduce((sum, u) => sum + u.value, 0);
  }

  get balancePep(): number {
    return this.balanceRibbits / RIBBITS_PER_PEP;
  }

  private get feeRate(): number {
    if (!this.fees) return RECOMMENDED_FEE_RATE;
    return Math.max(RECOMMENDED_FEE_RATE, this.fees.fastestFee);
  }

  get estimatedFeeRibbits(): number {
    const feeRate = this.feeRate;
    const { selectedUtxos, totalValue } = this.selectUtxos();

    if (selectedUtxos.length === 0) {
      return Math.ceil(estimateTxSize(1, 2) * feeRate);
    }

    const fee2 = Math.ceil(estimateTxSize(selectedUtxos.length, 2) * feeRate);
    const change = totalValue - this.amountRibbits - fee2;

    if (change > P2PKH_OUTPUT_BYTES * feeRate) {
      return fee2;
    }

    // No worthwhile change output. The leftover (totalValue - amount) is the
    // fee — but never report below the 1-output size-based floor, otherwise
    // isValid would falsely accept a transaction that miners would reject.
    const fee1 = Math.ceil(estimateTxSize(selectedUtxos.length, 1) * feeRate);
    return Math.max(fee1, totalValue - this.amountRibbits);
  }

  public selectUtxos() {
    const amountRibbits = this.amountRibbits;
    const feeRate = this.feeRate;
    const selectedUtxos: UTXO[] = [];
    let totalValue = 0;

    for (const utxo of this.utxos) {
      selectedUtxos.push(utxo);
      totalValue += utxo.value;
      const buffer = Math.ceil(estimateTxSize(selectedUtxos.length, 2) * feeRate);
      if (totalValue >= amountRibbits + buffer) break;
    }

    return { selectedUtxos, totalValue };
  }

  get maxRibbits(): number {
    const utxoCount = this.utxos.length || 1;
    const feeRibbits = Math.ceil(estimateTxSize(utxoCount, 1) * this.feeRate);
    return Math.max(0, this.balanceRibbits - feeRibbits);
  }

  public calculateMaxPep(): number {
    return this.maxRibbits / RIBBITS_PER_PEP;
  }

  get isValid(): boolean {
    if (!this.recipient || this.amountRibbits <= 0) return false;
    const needed = this.amountRibbits + this.estimatedFeeRibbits;
    return this.balanceRibbits >= needed;
  }
}
