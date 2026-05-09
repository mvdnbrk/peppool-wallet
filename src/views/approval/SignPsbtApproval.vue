<script setup lang="ts">
import { computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { deriveSigner, parseDerivationPath } from '@/utils/crypto';
import { broadcastTx } from '@/utils/api';
import { RIBBITS_PER_PEP } from '@/utils/constants';
import { useApprovalRequest } from '@/composables/useApprovalRequest';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import * as bitcoin from 'bitcoinjs-lib';
import { PEPECOIN } from '@/utils/networks';

interface SignPsbtParams {
  psbt: string;
  broadcast?: boolean;
}

interface PsbtIO {
  address: string | null;
  amountPep: number | null;
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
): { inputs: PsbtIO[]; outputs: PsbtIO[]; netChangePep: number | null; decodeError: boolean } {
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
        amountPep: value === null ? null : value / RIBBITS_PER_PEP,
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
        amountPep: Number(o.value) / RIBBITS_PER_PEP,
        mine: !!myAddress && address === myAddress
      };
    });

    const allInputAmountsKnown = inputs.every((i) => i.amountPep !== null);
    let netChangePep: number | null = null;
    if (allInputAmountsKnown) {
      const myIn = inputs.filter((i) => i.mine).reduce((s, i) => s + (i.amountPep ?? 0), 0);
      const myOut = outputs.filter((o) => o.mine).reduce((s, o) => s + (o.amountPep ?? 0), 0);
      netChangePep = myOut - myIn;
    }

    return { inputs, outputs, netChangePep, decodeError: false };
  } catch {
    return { inputs: [], outputs: [], netChangePep: null, decodeError: true };
  }
}

function formatPep(amount: number | null): string {
  if (amount === null) return '—';
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: 8 })} PEP`;
}

async function handleApprove() {
  await runWithMnemonic(async (mnemonic) => {
    const { psbt: base64Psbt, broadcast } = requestData.value!.params;
    const psbt = bitcoin.Psbt.fromBase64(base64Psbt, { network: PEPECOIN });

    const { accountIndex, addressIndex } = parseDerivationPath(walletStore.activeAccount!.path);
    const signer = deriveSigner(mnemonic, accountIndex, addressIndex);

    let signedCount = 0;
    for (let i = 0; i < psbt.inputCount; i++) {
      try {
        psbt.signInput(i, signer);
        signedCount++;
      } catch {
        // Input does not belong to this signer — skip
      }
    }

    if (signedCount === 0) {
      throw new Error('No inputs in this PSBT belong to your wallet');
    }

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
          v-if="psbtDetails.netChangePep !== null"
          class="rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">
            {{ psbtDetails.netChangePep < 0 ? 'You will send' : 'You will receive' }}
          </span>
          <p class="text-pepe-green mt-1 text-lg font-bold">
            {{ formatPep(Math.abs(psbtDetails.netChangePep)) }}
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
              formatPep(io.amountPep)
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
              formatPep(io.amountPep)
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
