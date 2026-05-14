<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { useInscriptionStore } from '@/stores/inscriptions';
import { deriveSigner, parseDerivationPath } from '@/utils/crypto';
import { broadcastTx } from '@/utils/api';
import { formatPep } from '@/utils/price';
import { useApprovalRequest } from '@/composables/useApprovalRequest';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepInlineAddress from '@/components/ui/PepInlineAddress.vue';
import PepInscription from '@/components/ui/PepInscription.vue';
import type { Inscription } from '@/models/Inscription';
import * as bitcoin from 'bitcoinjs-lib';
import { PEPECOIN } from '@/utils/networks';
import {
  ALLOWED_SIGHASHES,
  SIGHASH,
  getInputSighash,
  sighashLabel,
  verifyPsbtOwnership
} from '@/utils/psbt';

interface SignPsbtParams {
  psbt: string;
  signInputs: Record<string, number[]>;
  broadcast?: boolean;
}

interface PsbtIO {
  address: string | null;
  amountRibbits: number | null;
  mine: boolean;
  inscription?: Inscription | null;
  sighashType?: number | null;
}

type HeroSide =
  | { kind: 'pep'; amountRibbits: number }
  | { kind: 'inscription'; inscription: Inscription | null }
  | null;

const walletStore = useWalletStore();
const inscriptionStore = useInscriptionStore();

// Best-effort sync so the inscription cache catches up while the user reads.
// Non-blocking: render works against whatever is in the store right now and
// re-renders reactively when the sync resolves.
onMounted(() => {
  void walletStore.refreshBalance();
});

function findInscriptionByOutput(txid: string, vout: number): Inscription | null {
  if (!inscriptionStore.outputs.includes(`${txid}:${vout}`)) return null;
  const prefix = `${txid}:${vout}:`;
  for (const insc of Object.values(inscriptionStore.inscriptions)) {
    if (insc.satpoint.startsWith(prefix)) return insc as Inscription;
  }
  return null;
}

const { origin, requestData, error, isProcessing, runWithMnemonic, approve, reject } =
  useApprovalRequest<SignPsbtParams>();

const psbtDetails = computed(() => {
  if (!requestData.value) return null;
  // Touch the inscription store so changes from background sync re-trigger
  // this computed. We read it inside decodePsbtSummary too, but reading at the
  // top level keeps the dependency explicit.
  void inscriptionStore.outputs;
  void inscriptionStore.inscriptions;
  return {
    psbt: requestData.value.params.psbt,
    broadcast: requestData.value.params.broadcast === true,
    ...decodePsbtSummary(requestData.value.params.psbt, walletStore.address)
  };
});

const hero = computed(() => {
  if (!psbtDetails.value || psbtDetails.value.decodeError) return null;
  return buildHero(psbtDetails.value.inputs, psbtDetails.value.outputs);
});

function buildHero(inputs: PsbtIO[], outputs: PsbtIO[]): { transfer: HeroSide; receive: HeroSide } {
  const mineIn = inputs.filter((i) => i.mine);
  const mineOut = outputs.filter((o) => o.mine);
  const mineInscriptionInput = mineIn.find((i) => i.inscription);

  let transfer: HeroSide = null;
  if (mineInscriptionInput) {
    transfer = { kind: 'inscription', inscription: mineInscriptionInput.inscription! };
  } else if (mineIn.length) {
    const sumIn = mineIn.reduce((s, i) => s + (i.amountRibbits ?? 0), 0);
    const sumOut = mineOut.reduce((s, o) => s + (o.amountRibbits ?? 0), 0);
    const net = sumIn - sumOut;
    if (net > 0) transfer = { kind: 'pep', amountRibbits: net };
  }

  let receive: HeroSide = null;
  if (mineOut.length) {
    const sumIn = mineIn.reduce((s, i) => s + (i.amountRibbits ?? 0), 0);
    const sumOut = mineOut.reduce((s, o) => s + (o.amountRibbits ?? 0), 0);
    const net = sumOut - sumIn;
    if (net > 0) receive = { kind: 'pep', amountRibbits: net };
    // Buy-listing heuristic: a foreign 0x83 input means a counterparty is
    // delegating SIGHASH_SINGLE | ANYONECANPAY — the matching output landing
    // on me is almost certainly the inscription. We can't yet name it without
    // a per-output lookup, so render an "Inscription" placeholder.
    if (!receive) {
      const foreignAnyoneCanPay = inputs.some((i) => !i.mine && i.sighashType === 0x83);
      if (foreignAnyoneCanPay) receive = { kind: 'inscription', inscription: null };
    }
  }

  return { transfer, receive };
}

function decodePsbtSummary(
  base64: string,
  myAddress: string | null
): { inputs: PsbtIO[]; outputs: PsbtIO[]; netChangeRibbits: number | null; decodeError: boolean } {
  try {
    const psbt = bitcoin.Psbt.fromBase64(base64, { network: PEPECOIN });

    const inputs: PsbtIO[] = psbt.txInputs.map((txIn: any, i: number) => {
      const data = psbt.data.inputs[i];
      let address: string | null = null;
      let value: number | null = null;
      let inscription: Inscription | null = null;
      if (data?.nonWitnessUtxo) {
        const prevTx = bitcoin.Transaction.fromBuffer(data.nonWitnessUtxo);
        const out = prevTx.outs[txIn.index];
        if (out) {
          value = Number(out.value);
          try {
            address = bitcoin.address.fromOutputScript(out.script, PEPECOIN);
          } catch {
            /* non-standard script */
          }
        }
      }
      const prevTxid = Buffer.from(txIn.hash).reverse().toString('hex');
      inscription = findInscriptionByOutput(prevTxid, txIn.index);
      return {
        address,
        amountRibbits: value,
        mine: !!myAddress && address === myAddress,
        inscription,
        sighashType: data?.sighashType ?? null
      };
    });

    const outputs: PsbtIO[] = psbt.txOutputs.map((o: any) => {
      let address: string | null = null;
      try {
        address = bitcoin.address.fromOutputScript(o.script, PEPECOIN);
      } catch {
        /* non-standard script */
      }
      return {
        address,
        amountRibbits: Number(o.value),
        mine: !!myAddress && address === myAddress
      };
    });

    const allInputAmountsKnown = inputs.every((i) => i.amountRibbits !== null);
    let netChangeRibbits: number | null = null;
    if (allInputAmountsKnown) {
      const myIn = inputs.filter((i) => i.mine).reduce((s, i) => s + (i.amountRibbits ?? 0), 0);
      const myOut = outputs.filter((o) => o.mine).reduce((s, o) => s + (o.amountRibbits ?? 0), 0);
      netChangeRibbits = myOut - myIn;
    }

    return { inputs, outputs, netChangeRibbits, decodeError: false };
  } catch {
    return { inputs: [], outputs: [], netChangeRibbits: null, decodeError: true };
  }
}

async function handleApprove() {
  await runWithMnemonic(async (mnemonic) => {
    const { psbt: base64Psbt, signInputs, broadcast } = requestData.value!.params;
    const psbt = bitcoin.Psbt.fromBase64(base64Psbt, { network: PEPECOIN });

    const myAddress = walletStore.address;
    if (!myAddress) throw new Error('No active account.');

    const ownershipError = verifyPsbtOwnership({ psbt: base64Psbt, signInputs }, myAddress);
    if (ownershipError) throw new Error(ownershipError);

    const indices = signInputs[myAddress] ?? [];

    const sighashes = indices.map((i) => getInputSighash(psbt, i));
    for (const flag of sighashes) {
      if (!ALLOWED_SIGHASHES.has(flag)) {
        throw new Error(`Unsupported sighash: ${sighashLabel(flag)}`);
      }
    }
    const hasNonDefault = sighashes.some((s) => s !== SIGHASH.ALL);
    if (broadcast === true && hasNonDefault) {
      throw new Error('Cannot broadcast a PSBT with non-default sighash.');
    }

    const { accountIndex, addressIndex } = parseDerivationPath(walletStore.activeAccount!.path);
    const signer = deriveSigner(mnemonic, accountIndex, addressIndex);

    indices.forEach((inputIndex, k) => {
      psbt.signInput(inputIndex, signer, [sighashes[k]!]);
    });

    const result: { psbt: string; txid?: string } = { psbt: psbt.toBase64() };

    if (broadcast === true) {
      psbt.finalizeAllInputs();
      const txHex = psbt.extractTransaction().toHex();
      result.txid = await broadcastTx(txHex);
      result.psbt = psbt.toBase64();
    }

    await approve(result);
    if (broadcast === true) {
      await walletStore.refreshBalance(true);
    }
  });
}

function handleReject() {
  reject('User rejected the transaction');
}
</script>

<template>
  <PepMainLayout>
    <div v-if="psbtDetails" class="space-y-6">
      <div class="space-y-2 text-center">
        <h2 class="truncate text-sm font-medium text-slate-400">{{ origin }}</h2>
        <p class="text-lg font-bold text-white">Review Transaction</p>
      </div>

      <div class="space-y-3">
        <div
          v-if="!psbtDetails.broadcast"
          class="rounded-xl border border-amber-900/50 bg-amber-950/20 p-3"
        >
          <p class="text-xs leading-relaxed text-amber-400">
            This transaction will not be broadcast from your wallet. It may be broadcast later by a
            third party.
          </p>
        </div>

        <div v-if="hero?.transfer" class="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">
            You will transfer
          </span>
          <div v-if="hero.transfer.kind === 'inscription'" class="mt-2 flex items-center gap-3">
            <div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-700">
              <PepInscription
                v-if="hero.transfer.inscription"
                :id="hero.transfer.inscription.id"
                :content-type="hero.transfer.inscription.contentType"
              />
            </div>
            <span class="text-offwhite text-base font-bold">
              {{
                hero.transfer.inscription
                  ? `Inscription ${hero.transfer.inscription.number}`
                  : 'Inscription'
              }}
            </span>
          </div>
          <p v-else class="text-pepe-green mt-1 text-lg font-bold">
            {{ formatPep(hero.transfer.amountRibbits) }}
          </p>
        </div>

        <div v-if="hero?.receive" class="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">
            You will receive
          </span>
          <div v-if="hero.receive.kind === 'inscription'" class="mt-2 flex items-center gap-3">
            <div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-700">
              <PepInscription
                v-if="hero.receive.inscription"
                :id="hero.receive.inscription.id"
                :content-type="hero.receive.inscription.contentType"
              />
            </div>
            <span class="text-offwhite text-base font-bold">
              {{
                hero.receive.inscription
                  ? `Inscription ${hero.receive.inscription.number}`
                  : 'Inscription'
              }}
            </span>
          </div>
          <p v-else class="text-pepe-green mt-1 text-lg font-bold">
            {{ formatPep(hero.receive.amountRibbits) }}
          </p>
        </div>

        <div
          v-if="psbtDetails.inputs.length"
          class="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">From</span>
          <div
            v-for="(io, i) in psbtDetails.inputs"
            :key="`in-${i}`"
            class="flex items-center justify-between gap-3 border-t border-slate-800 pt-2 first:border-t-0 first:pt-0"
          >
            <PepInlineAddress :address="io.address" />
            <span class="shrink-0 text-xs font-bold text-slate-200">{{
              io.amountRibbits === null ? '—' : formatPep(io.amountRibbits)
            }}</span>
          </div>
        </div>

        <div
          v-if="psbtDetails.outputs.length"
          class="space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">To</span>
          <div
            v-for="(io, i) in psbtDetails.outputs"
            :key="`out-${i}`"
            class="flex items-center justify-between gap-3 border-t border-slate-800 pt-2 first:border-t-0 first:pt-0"
          >
            <PepInlineAddress :address="io.address" />
            <span class="shrink-0 text-xs font-bold text-slate-200">{{
              io.amountRibbits === null ? '—' : formatPep(io.amountRibbits)
            }}</span>
          </div>
        </div>

        <div
          v-if="psbtDetails.decodeError"
          class="rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <p class="text-xs leading-relaxed text-slate-400">
            Unable to decode this PSBT. Only proceed if you trust this dApp.
          </p>
        </div>
      </div>

      <div v-if="error" class="px-1 text-sm text-red-400">
        {{ error }}
      </div>
    </div>

    <template #actions>
      <div class="grid grid-cols-2 gap-4">
        <PepButton
          id="reject-transaction-button"
          variant="secondary"
          :disabled="isProcessing"
          @click="handleReject"
          >Cancel</PepButton
        >
        <PepButton id="approve-transaction-button" :loading="isProcessing" @click="handleApprove"
          >Approve</PepButton
        >
      </div>
    </template>
  </PepMainLayout>
</template>
