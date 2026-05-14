import type { Form } from '@/utils/form';

export type SendForm = Form<{
  recipient: string;
  amountRibbits: number;
  isFiatMode: boolean;
  password: string;
  step: number;
  txid: string;
}>;

// The subset of SendTransaction the review step renders. Avoids structurally
// requiring the class's private members, which Vue's reactive unwrapping
// drops from the prop type.
export interface SendTransactionView {
  amountPep: string;
}
