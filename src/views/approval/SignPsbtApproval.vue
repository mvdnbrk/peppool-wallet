<script setup lang="ts">
import { computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { deriveSigner, parseDerivationPath } from '@/utils/crypto';
import { broadcastTx } from '@/utils/api';
import { formatPep } from '@/utils/price';
import { useApprovalRequest } from '@/composables/useApprovalRequest';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import * as bitcoin from 'bitcoinjs-lib';
import { PEPECOIN } from '@/utils/networks';
import { ALLOWED_SIGHASHES, SIGHASH, getInputSighash, sighashLabel } from '@/utils/psbt';

interface SignPsbtParams {
  psbt: string;
  signInputs: Record<string, number[]>;
  broadcast?: boolean;
}

interface PsbtIO {
  address: string | null;
  amountRibbits: number | null;
  mine: boolean;
}

const walletStore = useWalletStore();

const { origin, requestData, error, isProcessing, runWithMnemonic, approve, reject } =
  useApprovalRequest<SignPsbtParams>();

const psbtDetails = computed(() => {
  if (!requestData.value) return null;
  return {
    psbt: requestData.value.params.psbt,
    broadcast: requestData.value.params.broadcast === true,
    ...decodePsbtSummary(requestData.value.params.psbt, walletStore.address)
  };
});

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
      return {
        address,
        amountRibbits: value,
        mine: !!myAddress && address === myAddress
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

    const indices = signInputs[myAddress] ?? [];
    if (indices.length === 0) {
      throw new Error('This PSBT is not for the active account.');
    }
    for (const i of indices) {
      if (i < 0 || i >= psbt.inputCount) {
        throw new Error(`signInputs index ${i} is out of range.`);
      }
    }

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
          v-if="psbtDetails.netChangeRibbits !== null"
          class="rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">
            {{ psbtDetails.netChangeRibbits < 0 ? 'You will send' : 'You will receive' }}
          </span>
          <p class="text-pepe-green mt-1 text-lg font-bold">
            {{ formatPep(Math.abs(psbtDetails.netChangeRibbits)) }}
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
            class="flex items-start justify-between gap-3 border-t border-slate-800 pt-2 first:border-t-0 first:pt-0"
          >
            <div class="min-w-0 space-y-0.5">
              <p class="font-mono text-xs break-all text-slate-300">
                {{ io.address ?? 'Non-standard script' }}
              </p>
              <span
                v-if="io.mine"
                class="text-pepe-green inline-block text-[10px] font-bold tracking-wider uppercase"
                >Your wallet</span
              >
            </div>
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
            class="flex items-start justify-between gap-3 border-t border-slate-800 pt-2 first:border-t-0 first:pt-0"
          >
            <div class="min-w-0 space-y-0.5">
              <p class="font-mono text-xs break-all text-slate-300">
                {{ io.address ?? 'Non-standard script' }}
              </p>
              <span
                v-if="io.mine"
                class="text-pepe-green inline-block text-[10px] font-bold tracking-wider uppercase"
                >Your wallet</span
              >
            </div>
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

        <div
          v-if="!psbtDetails.broadcast"
          class="rounded-xl border border-amber-900/50 bg-amber-950/20 p-3"
        >
          <p class="text-xs leading-relaxed text-amber-400">
            This transaction will not be broadcast from your wallet. It may be broadcast later by a
            third party.
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
          @click="handleReject"
          :disabled="isProcessing"
          >Cancel</PepButton
        >
        <PepButton id="approve-transaction-button" @click="handleApprove" :loading="isProcessing"
          >Approve</PepButton
        >
      </div>
    </template>
  </PepMainLayout>
</template>
