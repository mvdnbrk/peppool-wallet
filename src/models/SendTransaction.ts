import { estimateTxSize, type UTXO } from '../utils/crypto';
import type { RecommendedFees } from '../utils/api';
import { RIBBITS_PER_PEP, RECOMMENDED_FEE_RATE } from '../utils/constants';

export class SendTransaction {
  public utxos: UTXO[] = [];
  public fees: RecommendedFees | null = null;
  public recipient: string = '';
  public amountPep: number = 0;
  public readonly userAddress: string;

  constructor(userAddress: string) {
    this.userAddress = userAddress;
  }

  get balanceRibbits(): number {
    return this.utxos.reduce((sum, u) => sum + u.value, 0);
  }

  get balancePep(): number {
    return this.balanceRibbits / RIBBITS_PER_PEP;
  }

  get estimatedFeeRibbits(): number {
    const isMax = this.amountPep > 0 && Math.abs(this.amountPep - (this.calculateMaxPep())) < 0.0000001;
    const { selectedUtxos } = this.selectUtxos(isMax);
    const outputCount = isMax ? 1 : 2;
    const size = estimateTxSize(selectedUtxos.length || 1, outputCount);

    // Fallback if API is down
    if (!this.fees) return Math.ceil(size * RECOMMENDED_FEE_RATE);

    /**
     * Logic: 
     * Use API fastestFee but force a floor of RECOMMENDED_FEE_RATE (1000) 
     * to ensure we always meet the network recommendation.
     */
    const feeRate = Math.max(RECOMMENDED_FEE_RATE, this.fees.fastestFee);
    return Math.ceil(size * feeRate);
  }

  public selectUtxos(isMax = false) {
    if (isMax) {
      return { 
        selectedUtxos: [...this.utxos], 
        totalValue: this.balanceRibbits 
      };
    }

    const amountRibbits = Math.floor(this.amountPep * RIBBITS_PER_PEP);
    const selectedUtxos: UTXO[] = [];
    let totalValue = 0;
    
    // Safety buffer for selection - use the exact rate
    const feeRate = this.fees ? Math.max(RECOMMENDED_FEE_RATE, this.fees.fastestFee) : RECOMMENDED_FEE_RATE;
    const buffer = Math.ceil(estimateTxSize(this.utxos.length, 2) * feeRate);

    for (const utxo of this.utxos) {
      selectedUtxos.push(utxo);
      totalValue += utxo.value;
      if (totalValue >= amountRibbits + buffer) break;
    }

    return { selectedUtxos, totalValue };
  }

  public calculateMaxPep(): number {
    const utxoCount = this.utxos.length || 1;
    const txSize = estimateTxSize(utxoCount, 1); // 1 output, no change
    const feeRate = this.fees ? Math.max(RECOMMENDED_FEE_RATE, this.fees.fastestFee) : RECOMMENDED_FEE_RATE;
    const feeRibbits = Math.ceil(txSize * feeRate);
    
    return Math.max(0, (this.balanceRibbits - feeRibbits) / RIBBITS_PER_PEP);
  }

  get isValid(): boolean {
    if (!this.recipient || this.amountPep <= 0) return false;
    const needed = Math.floor(this.amountPep * RIBBITS_PER_PEP) + this.estimatedFeeRibbits;
    return this.balanceRibbits >= needed;
  }
}
