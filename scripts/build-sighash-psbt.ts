// Builds a 1-in / 1-out PSBT with sighashType 0x83 (SIGHASH_SINGLE | ANYONECANPAY)
// on input 0, spending a confirmed UTXO from the given address back to itself.
// Usage: npx tsx scripts/build-sighash-psbt.ts <Paddr...>
import { Psbt } from 'bitcoinjs-lib';
import { PEPECOIN } from '../src/utils/networks';

const API_BASE = 'https://peppool.space/api';
const FEE_RIBBITS = 50_000;
const SIGHASH_SINGLE_ANYONECANPAY = 0x83;

async function main() {
  const address = process.argv[2];
  if (!address) {
    console.error('Usage: npx tsx scripts/build-sighash-psbt.ts <address>');
    process.exit(1);
  }

  const utxos = await (await fetch(`${API_BASE}/address/${address}/utxo`)).json();
  const utxo = utxos.find((u: any) => u.status?.confirmed && u.value > FEE_RIBBITS + 1000);
  if (!utxo) throw new Error('No confirmed UTXO with sufficient value');

  const rawHex = (await (await fetch(`${API_BASE}/tx/${utxo.txid}/hex`)).text()).trim();

  const psbt = new Psbt({ network: PEPECOIN });
  psbt.setVersion(1);
  psbt.addInput({
    hash: utxo.txid,
    index: utxo.vout,
    nonWitnessUtxo: Buffer.from(rawHex, 'hex'),
    sighashType: SIGHASH_SINGLE_ANYONECANPAY
  });
  psbt.addOutput({ address, value: BigInt(utxo.value - FEE_RIBBITS) });

  console.log(psbt.toBase64());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
