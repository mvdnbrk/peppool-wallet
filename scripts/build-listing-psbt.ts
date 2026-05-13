// Builds a 1-in / 1-out listing PSBT with sighashType 0x83
// (SIGHASH_SINGLE | ANYONECANPAY) on input 0, spending an inscription UTXO
// to a payout address for a fixed asking price.
//
// Usage:
//   npx tsx scripts/build-listing-psbt.ts <inscriptionId> <priceInPep> <payoutAddress>
import { Psbt } from 'bitcoinjs-lib';
import { PEPECOIN } from '../src/utils/networks';

const API_BASE = 'https://peppool.space/api';
const SIGHASH_SINGLE_ANYONECANPAY = 0x83;

function parseSatpoint(satpoint: string): { txid: string; vout: number } {
  const match = satpoint.match(/^([0-9a-f]{64}):(\d+):\d+$/i);
  if (!match) throw new Error(`Invalid satpoint: ${satpoint}`);
  return { txid: match[1].toLowerCase(), vout: Number(match[2]) };
}

async function main() {
  const [inscriptionId, priceArg, payout] = process.argv.slice(2);
  if (!inscriptionId || !priceArg || !payout) {
    console.error(
      'Usage: npx tsx scripts/build-listing-psbt.ts <inscriptionId> <priceInPep> <payoutAddress>'
    );
    process.exit(1);
  }

  const priceRibbits = BigInt(Math.round(Number(priceArg) * 1e8));
  if (priceRibbits <= 0n) throw new Error('Price must be positive');

  // Resolve the inscription's current UTXO via the indexer — the reveal output
  // encoded in the inscription id is stale once the inscription has been moved.
  const insc = await (await fetch(`${API_BASE}/inscription/${inscriptionId}`)).json();
  if (!insc?.satpoint) throw new Error(`Inscription not found or has no satpoint: ${inscriptionId}`);
  const { txid, vout } = parseSatpoint(insc.satpoint);

  // Output = price + postage so the seller's net receive equals the advertised
  // price exactly (the postage from the inscription input is returned to them).
  const postage = BigInt(insc.value);
  const outputValue = priceRibbits + postage;

  const rawHex = (await (await fetch(`${API_BASE}/tx/${txid}/hex`)).text()).trim();
  if (!/^[0-9a-f]+$/i.test(rawHex)) throw new Error(`Could not fetch raw tx for ${txid}`);

  const psbt = new Psbt({ network: PEPECOIN });
  psbt.setVersion(1);
  psbt.addInput({
    hash: txid,
    index: vout,
    nonWitnessUtxo: Buffer.from(rawHex, 'hex'),
    sighashType: SIGHASH_SINGLE_ANYONECANPAY
  });
  psbt.addOutput({ address: payout, value: outputValue });

  console.log(
    `Listing ${inscriptionId} (held by ${insc.address} at ${insc.satpoint}, ` +
      `postage ${postage} ribbits) for ${priceArg} PEP (${priceRibbits} ribbits) → ${payout} ` +
      `[output ${outputValue} ribbits = price + postage]`
  );
  console.log();
  console.log(psbt.toBase64());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
