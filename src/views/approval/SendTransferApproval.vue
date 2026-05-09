<script setup lang="ts">
import { computed } from 'vue';
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
import { useApprovalRequest } from '@/composables/useApprovalRequest';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';

interface Recipient {
  address: string;
  amount: number;
}

interface SendTransferParams {
  recipient?: string;
  amount?: number;
  recipients?: Recipient[];
}

function normalizeRecipients(params: SendTransferParams): Recipient[] {
  if (Array.isArray(params.recipients)) return params.recipients;
  return [{ address: params.recipient!, amount: params.amount! }];
}

const walletStore = useWalletStore();
const inscriptionStore = useInscriptionStore();

const {
  requestId,
  origin,
  requestData,
  password,
  error,
  invalidRequest,
  isProcessing,
  isMnemonicLoaded,
  runWithMnemonic,
  approve,
  reject
} = useApprovalRequest<SendTransferParams>({
  validate: (request) => {
    const recipients = normalizeRecipients(request.params);
    return recipients.some((r) => !isValidAddress(r.address)) ? 'Invalid Pepecoin address.' : null;
  }
});

const transferDetails = computed(() => {
  if (!requestData.value) return null;
  const recipients = normalizeRecipients(requestData.value.params);
  return {
    recipients: recipients.map((r) => ({
      address: r.address,
      amountPep: r.amount / RIBBITS_PER_PEP
    })),
    totalAmountPep: recipients.reduce((sum, r) => sum + r.amount, 0) / RIBBITS_PER_PEP
  };
});

async function handleApprove() {
  await runWithMnemonic(async (mnemonic) => {
    const recipients = normalizeRecipients(requestData.value!.params);
    const recipient = recipients[0]!;
    const address = walletStore.address!;

    const [fees, rawUtxos] = await Promise.all([fetchRecommendedFees(), fetchUtxos(address)]);

    const inscriptionSet = await inscriptionStore.getOutputsSet(address);

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

    const utxosWithHex: UTXO[] = [];
    for (const u of selectedUtxos) {
      const rawHex = await fetchTxHex(u.txid);
      utxosWithHex.push({ ...u, rawHex });
    }

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

    await approve({ txid });
    await walletStore.refreshBalance(true);
  });
}

function handleReject() {
  reject('User rejected the transaction');
}

// Expose for template clarity (parity with previous SignTxView ids)
void requestId;
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

    <div v-else-if="transferDetails" class="space-y-6">
      <div class="space-y-2 text-center">
        <h2 class="truncate text-sm font-medium text-slate-400">{{ origin }}</h2>
        <p class="text-lg font-bold text-white">Review Transaction</p>
      </div>

      <div class="space-y-4">
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
