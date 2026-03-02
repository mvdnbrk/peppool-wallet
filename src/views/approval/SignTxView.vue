<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { deriveSigner, createSignedTx, type UTXO, parseDerivationPath } from '@/utils/crypto';
import { fetchUtxos, broadcastTx, fetchTxHex, fetchRecommendedFees } from '@/utils/api';
import { RIBBITS_PER_PEP } from '@/utils/constants';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';
import * as bitcoin from 'bitcoinjs-lib';
import { PEPECOIN } from '@/utils/networks';

const walletStore = useWalletStore();

const requestId = ref('');
const origin = ref('');
const method = ref('');
const requestData = ref<any>(null);
const password = ref('');
const error = ref('');
const isProcessing = ref(false);

const isUnlocked = computed(() => walletStore.isUnlocked);
const isMnemonicLoaded = computed(() => walletStore.isMnemonicLoaded);

const txDetails = computed(() => {
  if (!requestData.value) return null;

  if (method.value === 'sendTransfer') {
    const params = requestData.value.params;
    const recipients = Array.isArray(params.recipients)
      ? params.recipients
      : [{ address: params.recipient, amount: params.amount }];
    return {
      type: 'Transfer',
      recipients: recipients.map((r: any) => ({
        address: r.address,
        amountPep: r.amount / RIBBITS_PER_PEP
      })),
      totalAmountPep:
        recipients.reduce((sum: number, r: any) => sum + r.amount, 0) / RIBBITS_PER_PEP
    };
  }

  if (method.value === 'signPsbt') {
    return {
      type: 'Sign PSBT',
      psbt: requestData.value.params.psbt
    };
  }

  return null;
});

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  requestId.value = params.get('id') || '';
  origin.value = params.get('origin') || '';
  method.value = params.get('method') || '';

  const key = `request_${requestId.value}`;
  const data = await chrome.storage.local.get(key);
  requestData.value = data[key];

  await walletStore.checkSession();
});

async function handleApprove() {
  if (!requestId.value || !requestData.value) return;
  error.value = '';

  try {
    let mnemonic = walletStore.plaintextMnemonic;

    if (!mnemonic) {
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
      mnemonic = walletStore.plaintextMnemonic;
    }

    if (!mnemonic) {
      error.value = 'Could not access mnemonic';
      return;
    }

    isProcessing.value = true;

    if (method.value === 'sendTransfer') {
      await handleSendTransfer(mnemonic);
    } else if (method.value === 'signPsbt') {
      await handleSignPsbt(mnemonic);
    }
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

  // 1. Fetch requirements
  const [fees, rawUtxos] = await Promise.all([fetchRecommendedFees(), fetchUtxos(address)]);

  const confirmedUtxos = rawUtxos.filter((u) => u.status.confirmed);
  const feeRate = Math.max(1000, fees.fastestFee);

  // 2. Simple coin selection
  let selectedUtxos: any[] = [];
  let totalIn = 0;
  const needed = recipient.amount;

  for (const u of confirmedUtxos) {
    selectedUtxos.push(u);
    totalIn += u.value;
    const estFee = Math.ceil((148 * selectedUtxos.length + 34 * 2 + 10) * feeRate);
    if (totalIn >= needed + estFee) break;
  }

  const finalFee = Math.ceil((148 * selectedUtxos.length + 34 * 2 + 10) * feeRate);
  if (totalIn < needed + finalFee) {
    throw new Error('Insufficient confirmed balance');
  }

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
  const { psbt: base64Psbt } = requestData.value.params;
  const psbt = bitcoin.Psbt.fromBase64(base64Psbt, { network: PEPECOIN });

  const { accountIndex, addressIndex } = parseDerivationPath(walletStore.activeAccount!.path);
  const signer = deriveSigner(mnemonic, accountIndex, addressIndex);

  psbt.signAllInputs(signer);

  const result = {
    psbt: psbt.toBase64()
  };

  chrome.runtime.sendMessage({
    target: 'peppool-background-response',
    requestId: requestId.value,
    result
  });

  await chrome.storage.local.remove(`request_${requestId.value}`);
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
    <template #header>
      <PepPageHeader :title="method === 'sendTransfer' ? 'Send PEP' : 'Sign Transaction'" />
    </template>

    <div v-if="!isUnlocked" class="flex flex-col items-center justify-center space-y-6 py-12">
      <div class="space-y-2 text-center">
        <h2 class="text-xl font-bold">Wallet Locked</h2>
        <p class="text-slate-400">Please unlock your wallet to continue.</p>
      </div>
      <PepButton id="unlock-wallet-button" @click="$router.push('/')">Go to Login</PepButton>
    </div>

    <div v-else-if="txDetails" class="space-y-6">
      <div class="space-y-2 text-center">
        <h2 class="truncate text-sm font-medium text-slate-400">{{ origin }}</h2>
        <p class="text-lg font-bold text-white">Requests {{ txDetails.type }}</p>
      </div>

      <div v-if="method === 'sendTransfer'" class="space-y-4">
        <div
          v-for="(r, i) in txDetails.recipients"
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

      <div v-if="method === 'signPsbt'" class="space-y-4">
        <div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p class="text-xs leading-relaxed text-slate-400">
            This dApp wants to sign a Partially Signed Transaction (PSBT). Review the details
            carefully.
          </p>
          <div
            class="mt-4 h-24 overflow-hidden rounded border border-slate-800 bg-slate-950 p-2 font-mono text-[10px] break-all text-slate-500"
          >
            {{ txDetails.psbt }}
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

    <template #actions v-if="isUnlocked">
      <div class="grid grid-cols-2 gap-4">
        <PepButton id="reject-transaction-button" variant="secondary" @click="handleReject" :disabled="isProcessing"
          >Cancel</PepButton
        >
        <PepButton id="approve-transaction-button" @click="handleApprove" :loading="isProcessing">Approve</PepButton>
      </div>
    </template>
  </PepMainLayout>
</template>
