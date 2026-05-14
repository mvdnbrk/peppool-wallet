import * as bitcoin from 'bitcoinjs-lib';
import { PEPECOIN } from '@/utils/networks';

export const SIGHASH = {
  ALL: 0x01,
  NONE: 0x02,
  SINGLE: 0x03,
  ANYONECANPAY: 0x80,
  ALL_ANYONECANPAY: 0x81,
  NONE_ANYONECANPAY: 0x82,
  SINGLE_ANYONECANPAY: 0x83
} as const;

// Sighash flags the wallet will sign with. ANYONECANPAY variants enable
// half-signed PSBTs (e.g. inscription listings) where a counterparty can
// later add inputs/outputs without invalidating our signature.
export const ALLOWED_SIGHASHES: ReadonlySet<number> = new Set([
  SIGHASH.ALL,
  SIGHASH.SINGLE_ANYONECANPAY
]);

export function sighashLabel(flag: number): string {
  switch (flag) {
    case SIGHASH.ALL:
      return 'SIGHASH_ALL';
    case SIGHASH.NONE:
      return 'SIGHASH_NONE';
    case SIGHASH.SINGLE:
      return 'SIGHASH_SINGLE';
    case SIGHASH.ALL_ANYONECANPAY:
      return 'SIGHASH_ALL | ANYONECANPAY';
    case SIGHASH.NONE_ANYONECANPAY:
      return 'SIGHASH_NONE | ANYONECANPAY';
    case SIGHASH.SINGLE_ANYONECANPAY:
      return 'SIGHASH_SINGLE | ANYONECANPAY';
    default:
      return `0x${flag.toString(16).padStart(2, '0')}`;
  }
}

export function getInputSighash(psbt: bitcoin.Psbt, index: number): number {
  return psbt.data.inputs[index]?.sighashType ?? SIGHASH.ALL;
}

const PEP_ADDRESS_RE = /^P[1-9A-HJ-NP-Za-km-z]{25,33}$/;

/**
 * Validates the shape of signPsbt request params before opening the approval
 * popup. Deeper checks (PSBT decoding, index range, sighash allowlist) happen
 * in the approval view which already parses the PSBT.
 */
export function validatePsbtParams(params: any): string | null {
  if (!params || typeof params !== 'object') return 'Missing PSBT parameters.';

  if (typeof params.psbt !== 'string' || params.psbt.length === 0) {
    return 'Missing or invalid psbt.';
  }

  if (params.signInputs == null || typeof params.signInputs !== 'object') {
    return 'signInputs is required.';
  }

  const entries = Object.entries(params.signInputs as Record<string, unknown>);
  if (entries.length === 0) return 'signInputs must include at least one address.';

  for (const [address, indices] of entries) {
    if (!PEP_ADDRESS_RE.test(address)) {
      return `Invalid address in signInputs: ${address}`;
    }
    if (!Array.isArray(indices) || indices.length === 0) {
      return `signInputs[${address}] must be a non-empty array of input indices.`;
    }
    const seen = new Set<number>();
    for (const idx of indices) {
      if (typeof idx !== 'number' || !Number.isInteger(idx) || idx < 0) {
        return `signInputs[${address}] contains invalid index: ${idx}`;
      }
      if (seen.has(idx)) {
        return `signInputs[${address}] contains duplicate index: ${idx}`;
      }
      seen.add(idx);
    }
  }

  if (params.broadcast != null && typeof params.broadcast !== 'boolean') {
    return 'broadcast must be a boolean.';
  }

  return null;
}

export function verifyPsbtOwnership(
  params: { psbt: string; signInputs: Record<string, number[]> },
  activeAddress: string
): string | null {
  const indices = params.signInputs[activeAddress];
  if (!indices || indices.length === 0) {
    return 'This PSBT is not for the active account.';
  }

  let psbt: bitcoin.Psbt;
  try {
    psbt = bitcoin.Psbt.fromBase64(params.psbt, { network: PEPECOIN });
  } catch {
    return 'Unable to decode PSBT.';
  }

  for (const i of indices) {
    if (i < 0 || i >= psbt.inputCount) {
      return `signInputs index ${i} is out of range.`;
    }
    const data = psbt.data.inputs[i];
    if (!data?.nonWitnessUtxo) {
      return `Input ${i} is missing nonWitnessUtxo; cannot verify ownership.`;
    }
    const txIn = psbt.txInputs[i]!;
    let prevAddress: string;
    try {
      const prevTx = bitcoin.Transaction.fromBuffer(data.nonWitnessUtxo);
      const out = prevTx.outs[txIn.index];
      if (!out) return `Input ${i} prevout vout is out of range.`;
      prevAddress = bitcoin.address.fromOutputScript(out.script, PEPECOIN);
    } catch {
      return `Input ${i} prevout could not be decoded.`;
    }
    if (prevAddress !== activeAddress) {
      return `Input ${i} does not belong to the active account.`;
    }
  }

  return null;
}
