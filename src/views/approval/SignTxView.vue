<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import {
  deriveSigner,
  createSignedTx,
  isValidAddress,
  type UTXO,
  parseDerivationPath
} from '@/utils/crypto';
import {
  fetchUtxos,
  broadcastTx,
  fetchTxHex,
  fetchRecommendedFees,
  isInscriptionUtxo
} from '@/utils/api';
import { useInscriptionStore } from '@/stores/inscriptions';
import { RIBBITS_PER_PEP } from '@/utils/constants';
import { SendTransaction } from '@/models/SendTransaction';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';
import * as bitcoin from 'bitcoinjs-lib';
import { PEPECOIN } from '@/utils/networks';

const walletStore = useWalletStore();
const inscriptionStore = useInscriptionStore();

const requestId = ref('');
const origin = ref('');
const method = ref('');
const requestData = ref<any>(null);
const password = ref('');
const error = ref('');
const invalidRequest = ref('');
const isProcessing = ref(false);

const isMnemonicLoaded = computed(() => walletStore.isMnemonicLoaded);

const transferDetails = computed(() => {
  if (!requestData.value || method.value !== 'sendTransfer') return null;
  const params = requestData.value.params;
  const recipients = Array.isArray(params.recipients)
    ? params.recipients
    : [{ address: params.recipient, amount: params.amount }];

  return {
    recipients: recipients.map((r: any) => ({
      address: r.address,
      amountPep: r.amount / RIBBITS_PER_PEP
    })),
    totalAmountPep: recipients.reduce((sum: number, r: any) => sum + r.amount, 0) / RIBBITS_PER_PEP
  };
});

const psbtDetails = computed(() => {
  if (!requestData.value || method.value !== 'signPsbt') return null;
  return {
    psbt: requestData.value.params.psbt,
    broadcast: requestData.value.params.broadcast === true,
    ...decodePsbtSummary(requestData.value.params.psbt, walletStore.address)
  };
});

const hasDetails = computed(() => !!transferDetails.value || !!psbtDetails.value);

interface PsbtIO {
  address: string | null;
  amountPep: number | null;
  mine: boolean;
}

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

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  requestId.value = params.get('id') || '';
  origin.value = params.get('origin') || '';
  method.value = params.get('method') || '';

  const key = `request_${requestId.value}`;
  const data = await chrome.storage.local.get(key);
  requestData.value = data[key];

  // Validate recipient addresses using bitcoinjs-lib
  if (method.value === 'sendTransfer' && requestData.value?.params) {
    const params = requestData.value.params;
    const recipients = Array.isArray(params.recipients)
      ? params.recipients
      : [{ address: params.recipient, amount: params.amount }];

    const hasInvalid = recipients.some((r: any) => !isValidAddress(r.address));
    if (hasInvalid) {
      invalidRequest.value = 'Invalid Pepecoin address.';
      return;
    }
  }

  await walletStore.checkSession();
});

async function handleApprove() {
  if (!requestId.value || !requestData.value) return;
  error.value = '';

  try {
    if (!walletStore.isMnemonicLoaded) {
      if (!password.value) {
        error.value = 'Please enter your password';
        return;
      }
      isProcessing.value = true;
      const success = await walletStore.unlock(password.value);
      if (!success) {
        error.value = 'Invalid password';
        isProcessing.value = false;
        return;
      }
    }

    isProcessing.value = true;
    await walletStore.withMnemonic(async (mnemonic) => {
      if (method.value === 'sendTransfer') {
        await handleSendTransfer(mnemonic);
      } else if (method.value === 'signPsbt') {
        await handleSignPsbt(mnemonic);
      }
    });
  } catch (err: any) {
    console.error('Transaction failed', err);
    error.value = err.message || 'Transaction failed';
    isProcessing.value = false;
  }
}

async function handleSendTransfer(mnemonic: string) {
  const params = requestData.value.params;
  const recipients = Array.isArray(params.recipients)
    ? params.recipients
    : [{ address: params.recipient, amount: params.amount }];

  const recipient = recipients[0];
  const address = walletStore.address!;

  // 1. Fetch requirements (inscription outputs from cache, API fallback)
  const [fees, rawUtxos] = await Promise.all([fetchRecommendedFees(), fetchUtxos(address)]);

  const inscriptionSet = await inscriptionStore.getOutputsSet(address);

  // 2. Coin selection via SendTransaction model (shared with main send flow)
  const sendTx = new SendTransaction(address);
  sendTx.utxos = rawUtxos.filter(
    (u) => u.status.confirmed && !isInscriptionUtxo(u, inscriptionSet)
  );
  sendTx.fees = fees;
  sendTx.amountRibbits = recipient.amount;
  sendTx.recipient = recipient.address;

  if (!sendTx.isValid) {
    throw new Error('Insufficient confirmed balance');
  }

  const { selectedUtxos } = sendTx.selectUtxos(false);
  const finalFee = sendTx.estimatedFeeRibbits;

  // 3. Fetch UTXO hexes
  const utxosWithHex: UTXO[] = [];
  for (const u of selectedUtxos) {
    const rawHex = await fetchTxHex(u.txid);
    utxosWithHex.push({ ...u, rawHex });
  }

  // 4. Sign and broadcast
  const { accountIndex, addressIndex } = parseDerivationPath(walletStore.activeAccount!.path);
  const signer = deriveSigner(mnemonic, accountIndex, addressIndex);

  const txHex = await createSignedTx(
    signer,
    recipient.address,
    recipient.amount,
    utxosWithHex,
    finalFee
  );

  const txid = await broadcastTx(txHex);

  chrome.runtime.sendMessage({
    target: 'peppool-background-response',
    requestId: requestId.value,
    result: { txid }
  });

  await chrome.storage.local.remove(`request_${requestId.value}`);
  await walletStore.refreshBalance(true);
  window.close();
}

async function handleSignPsbt(mnemonic: string) {
  const { psbt: base64Psbt, broadcast } = requestData.value.params;
  const psbt = bitcoin.Psbt.fromBase64(base64Psbt, { network: PEPECOIN });

  const { accountIndex, addressIndex } = parseDerivationPath(walletStore.activeAccount!.path);
  const signer = deriveSigner(mnemonic, accountIndex, addressIndex);

  // Only sign inputs that belong to this signer's key
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

  chrome.runtime.sendMessage({
    target: 'peppool-background-response',
    requestId: requestId.value,
    result
  });

  await chrome.storage.local.remove(`request_${requestId.value}`);
  if (broadcast === true) {
    await walletStore.refreshBalance(true);
  }
  window.close();
}

async function handleReject() {
  if (!requestId.value) return;

  chrome.runtime.sendMessage({
    target: 'peppool-background-response',
    requestId: requestId.value,
    error: 'User rejected the transaction'
  });

  // Cleanup storage
  await chrome.storage.local.remove(`request_${requestId.value}`);

  window.close();
}
</script>

<template>
  <PepMainLayout>
    <div v-if="invalidRequest" class="space-y-6">
      <div class="space-y-2 text-center">
        <h2 class="truncate text-sm font-medium text-slate-400">{{ origin }}</h2>
        <p class="text-lg font-bold text-white">Invalid Request</p>
      </div>
      <div class="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
        {{ invalidRequest }}
      </div>
    </div>

    <div v-else-if="hasDetails" class="space-y-6">
      <div class="space-y-2 text-center">
        <h2 class="truncate text-sm font-medium text-slate-400">{{ origin }}</h2>
        <p class="text-lg font-bold text-white">Review Transaction</p>
      </div>

      <div v-if="transferDetails" class="space-y-4">
        <div
          v-for="(r, i) in transferDetails.recipients"
          :key="i"
          class="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">Amount</span>
            <span class="text-pepe-green font-bold">{{ r.amountPep }} PEP</span>
          </div>
          <div class="space-y-1">
            <span class="text-xs font-bold tracking-widest text-slate-500 uppercase">To</span>
            <p class="font-mono text-xs leading-relaxed break-all text-slate-300">
              {{ r.address }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="psbtDetails" class="space-y-3">
        <!-- Net effect -->
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

        <!-- Inputs -->
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

        <!-- Outputs -->
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

        <!-- Decode failure fallback -->
        <div
          v-if="psbtDetails.decodeError"
          class="rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <p class="text-xs leading-relaxed text-slate-400">
            Unable to decode this PSBT. Only proceed if you trust this dApp.
          </p>
        </div>

        <!-- Broadcast warning -->
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

      <div v-if="!isMnemonicLoaded" class="space-y-2">
        <PepPasswordInput
          id="sign-tx-password"
          v-model="password"
          label="Enter Password to Confirm"
          placeholder="Your password"
          :error="error"
          @keyup.enter="handleApprove"
        />
      </div>
      <div v-else-if="error" class="px-1 text-sm text-red-400">
        {{ error }}
      </div>
    </div>

    <template #actions>
      <div v-if="invalidRequest">
        <PepButton id="reject-transaction-button" variant="secondary" @click="handleReject" block
          >Close</PepButton
        >
      </div>
      <div v-else class="grid grid-cols-2 gap-4">
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
