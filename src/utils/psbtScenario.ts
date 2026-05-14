import type { Inscription } from '@/models/Inscription';

/**
 * Minimal shape the scenario detector needs for each input/output. Outputs
 * should already have their predicted inscription attached (see the cumulative
 * sat-offset walk in `SignPsbtApproval.decodePsbtSummary`).
 */
export interface PsbtIo {
  address: string | null;
  amountRibbits: number | null;
  mine: boolean;
  inscription?: Inscription | null;
  sighashType?: number | null;
}

export type PsbtScenario =
  | { kind: 'listing'; inscription: Inscription; priceRibbits: number }
  | { kind: 'buy'; priceRibbits: number; feeRibbits: number | null }
  | { kind: 'send-pep'; recipient: string; amountRibbits: number; feeRibbits: number }
  | { kind: 'send-inscription'; recipient: string; inscription: Inscription }
  | { kind: 'self-send'; inscription: Inscription }
  | { kind: 'unknown' };

const SIGHASH_DEFAULT = 0x01;
const SIGHASH_SINGLE_ANYONECANPAY = 0x83;

function sighashOf(io: PsbtIo): number {
  return io.sighashType ?? SIGHASH_DEFAULT;
}

export function detectPsbtScenario(inputs: PsbtIo[], outputs: PsbtIo[]): PsbtScenario {
  if (!inputs.length || !outputs.length) return { kind: 'unknown' };

  const mineInputs = inputs.filter((i) => i.mine);
  const foreignInputs = inputs.filter((i) => !i.mine);
  const mineOutputs = outputs.filter((o) => o.mine);
  const foreignOutputs = outputs.filter((o) => !o.mine);

  const mineInputsAllDefault = mineInputs.every((i) => sighashOf(i) === SIGHASH_DEFAULT);
  const foreignHasAnyoneCanPay = foreignInputs.some(
    (i) => sighashOf(i) === SIGHASH_SINGLE_ANYONECANPAY
  );

  // Listing (create): exactly one mine input with SIGHASH_SINGLE|ANYONECANPAY
  // carrying an inscription, one mine output (the price), no foreign legs yet.
  if (
    inputs.length === 1 &&
    outputs.length === 1 &&
    inputs[0]!.mine &&
    sighashOf(inputs[0]!) === SIGHASH_SINGLE_ANYONECANPAY &&
    inputs[0]!.inscription &&
    outputs[0]!.mine &&
    outputs[0]!.amountRibbits !== null
  ) {
    return {
      kind: 'listing',
      inscription: inputs[0]!.inscription,
      priceRibbits: outputs[0]!.amountRibbits!
    };
  }

  // Buy listing: counterparty contributed a SIGHASH_SINGLE|ANYONECANPAY input,
  // we add default-sighash inputs to fund the trade and receive on a mine
  // output. The seller's price is captured by the foreign output(s).
  if (
    mineInputs.length >= 1 &&
    mineInputsAllDefault &&
    foreignHasAnyoneCanPay &&
    mineOutputs.length >= 1
  ) {
    const priceRibbits = foreignOutputs.reduce((s, o) => s + (o.amountRibbits ?? 0), 0);
    const allAmountsKnown = inputs.every((i) => i.amountRibbits !== null);
    let feeRibbits: number | null = null;
    if (allAmountsKnown) {
      const totalIn = inputs.reduce((s, i) => s + (i.amountRibbits ?? 0), 0);
      const totalOut = outputs.reduce((s, o) => s + (o.amountRibbits ?? 0), 0);
      feeRibbits = totalIn - totalOut;
    }
    return { kind: 'buy', priceRibbits, feeRibbits };
  }

  // Beyond this point, any foreign ANYONECANPAY input means the PSBT is
  // positionally undefined and we cannot reason about scenarios further.
  if (foreignHasAnyoneCanPay) return { kind: 'unknown' };

  // Remaining scenarios require all signed inputs to use the default sighash.
  if (!mineInputsAllDefault) return { kind: 'unknown' };

  const mineInscriptionInputs = mineInputs.filter((i) => i.inscription);
  const allMine = foreignInputs.length === 0 && foreignOutputs.length === 0;

  // Self-send / cancel-listing: only my UTXOs involved, a single inscription
  // input ends up on a single mine output.
  if (
    allMine &&
    mineInscriptionInputs.length === 1 &&
    outputs.length === 1 &&
    outputs[0]!.inscription &&
    outputs[0]!.inscription.id === mineInscriptionInputs[0]!.inscription!.id
  ) {
    return { kind: 'self-send', inscription: mineInscriptionInputs[0]!.inscription! };
  }

  // Send inscription: an inscription riding on a mine input lands on a
  // non-mine output (sat-offset prediction is reliable here — no ANYONECANPAY).
  if (mineInscriptionInputs.length >= 1) {
    const target = foreignOutputs.find((o) => !!o.inscription && !!o.address);
    if (target?.address && target.inscription) {
      return {
        kind: 'send-inscription',
        recipient: target.address,
        inscription: target.inscription
      };
    }
    return { kind: 'unknown' };
  }

  // Simple PEP transfer: no inscriptions anywhere, exactly one non-mine output
  // (the recipient), optional mine change.
  const noInscriptionsAnywhere =
    inputs.every((i) => !i.inscription) && outputs.every((o) => !o.inscription);
  if (
    noInscriptionsAnywhere &&
    foreignOutputs.length === 1 &&
    foreignOutputs[0]!.address &&
    foreignOutputs[0]!.amountRibbits !== null &&
    inputs.every((i) => i.amountRibbits !== null)
  ) {
    const totalIn = inputs.reduce((s, i) => s + (i.amountRibbits ?? 0), 0);
    const totalOut = outputs.reduce((s, o) => s + (o.amountRibbits ?? 0), 0);
    return {
      kind: 'send-pep',
      recipient: foreignOutputs[0]!.address!,
      amountRibbits: foreignOutputs[0]!.amountRibbits!,
      feeRibbits: totalIn - totalOut
    };
  }

  return { kind: 'unknown' };
}
