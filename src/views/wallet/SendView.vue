<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletStore } from '../../stores/wallet';
import {
  fetchUtxos,
  broadcastTx,
  fetchTxHex,
  validateAddress,
  fetchRecommendedFees
} from '../../utils/api';
import { createSignedTx, isValidAddress, deriveSigner, type UTXO } from '../../utils/crypto';
import { decrypt as decryptMnemonic } from '../../utils/encryption';
import { useForm } from '../../utils/form';
import { SendTransaction } from '../../models/SendTransaction';
import PepLoadingButton from '../../components/ui/PepLoadingButton.vue';
import PepForm from '../../components/ui/PepForm.vue';
import {
  RIBBITS_PER_PEP,
  MIN_SEND_PEP,
  formatFiat,
  truncateId,
  UX_DELAY_SLOW
} from '../../utils/constants';

const router = useRouter();
const walletStore = useWalletStore();

// The logical object for the transaction
const tx = ref(new SendTransaction(walletStore.address!));

const form = useForm(
  {
    recipient: '',
    inputAmount: '',
    password: ''
  },
  { persistKey: 'send', sensitiveFields: ['password'] }
);

const ui = reactive({
  step: 1,
  txid: '',
  isFiatMode: false,
  isLoadingRequirements: true
});

const txidStart = computed(() => truncateId(ui.txid).start);
const txidEnd = computed(() => truncateId(ui.txid).end);

const currentPrice = computed(() => walletStore.prices[walletStore.selectedCurrency]);

const isInsufficientFunds = computed(() => {
  if (ui.isLoadingRequirements || tx.value.amountPep <= 0) return false;
  const needed = tx.value.amountRibbits + tx.value.estimatedFeeRibbits;
  return tx.value.balanceRibbits < needed;
});

const isMax = computed(() => {
  if (tx.value.amountRibbits <= 0) return false;
  return tx.value.amountRibbits >= tx.value.maxRibbits;
});

// Strip whitespace from recipient as the user types (addresses never contain spaces)
watch(
  () => form.recipient,
  (val) => {
    const stripped = val.replace(/\s/g, '');
    if (stripped !== val) form.recipient = stripped;
  }
);

// Sync form to logical object
let isMaxLocked = false;
watch([() => form.inputAmount, () => form.recipient], () => {
  if (!isMaxLocked) {
    const val = parseFloat(form.inputAmount);
    tx.value.amountPep = isNaN(val) ? 0 : ui.isFiatMode ? val / currentPrice.value : val;
  }
  isMaxLocked = false;
  tx.value.recipient = form.recipient;
});

const displayBalance = computed(() => {
  if (ui.isFiatMode) {
    return `${walletStore.currencySymbol}${formatFiat(walletStore.balanceFiat)} ${walletStore.selectedCurrency}`;
  }
  return `${parseFloat(walletStore.balance.toFixed(8))} PEP`;
});

const displayFee = computed(() => {
  const feePep = tx.value.estimatedFeeRibbits / RIBBITS_PER_PEP;
  return `${parseFloat(feePep.toFixed(8))} PEP`;
});

function toggleMode() {
  if (!form.inputAmount) {
    ui.isFiatMode = !ui.isFiatMode;
    return;
  }
  const currentVal = parseFloat(form.inputAmount);
  form.inputAmount = ui.isFiatMode
    ? (currentVal / currentPrice.value).toFixed(8).replace(/\.?0+$/, '')
    : formatFiat(currentVal * currentPrice.value);

  ui.isFiatMode = !ui.isFiatMode;
}

function setMax() {
  const maxPep = tx.value.calculateMaxPep();
  // Set the canonical PEP amount directly — avoids precision loss from fiat round-trip
  isMaxLocked = true;
  tx.value.amountPep = maxPep;
  form.inputAmount = ui.isFiatMode
    ? formatFiat(maxPep * currentPrice.value)
    : maxPep.toFixed(8).replace(/\.?0+$/, '');
}

async function handleAddressBlur() {
  if (!form.recipient) {
    form.clearError('recipient');
    return;
  }

  if (!isValidAddress(form.recipient)) {
    form.setError('recipient', 'Invalid address format');
    return;
  }

  try {
    const validation = await validateAddress(form.recipient);
    if (!validation.isvalid) {
      form.setError('recipient', 'Invalid Pepecoin address');
    }
  } catch (e) {
    form.clearError('recipient');
  }
}

async function handleReview() {
  if (!form.recipient || tx.value.amountPep <= 0) {
    form.setError('general', 'Please enter a valid address and amount');
    return;
  }

  if (tx.value.amountPep < MIN_SEND_PEP) {
    form.setError('general', `Minimum send amount is ${MIN_SEND_PEP} PEP`);
    return;
  }

  if (form.hasError()) return;

  form.isProcessing = true;
  form.clearError('general');
  const startTime = Date.now();

  try {
    if (!isValidAddress(form.recipient)) {
      form.setError('recipient', 'Invalid address format');
      form.isProcessing = false;
      return;
    }

    if (form.recipient === walletStore.address) {
      form.setError('recipient', 'Cannot send to your own address');
      form.isProcessing = false;
      return;
    }

    if (!tx.value.isValid) {
      form.setError('general', 'Insufficient balance');
      form.isProcessing = false;
      return;
    }

    const elapsed = Date.now() - startTime;
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));
    ui.step = 2;
  } catch (e: any) {
    form.setError('general', e.message || 'Validation failed');
  } finally {
    form.isProcessing = false;
  }
}

async function handleSend() {
  form.isProcessing = true;
  form.clearError('general');
  const startTime = Date.now();

  try {
    let mnemonic = walletStore.plaintextMnemonic;
    if (!mnemonic) {
      if (!form.password) {
        form.setError('general', 'Password required');
        form.isProcessing = false;
        return;
      }
      try {
        mnemonic = await decryptMnemonic(walletStore.encryptedMnemonic!, form.password);
        walletStore.cacheMnemonic(mnemonic);
      } catch (e) {
        form.setError('general', 'Incorrect password');
        form.isProcessing = false;
        return;
      }
    }

    const { selectedUtxos } = tx.value.selectUtxos(isMax.value);
    const usedUtxosWithHex: UTXO[] = [];

    for (const utxo of selectedUtxos) {
      const rawHex = await fetchTxHex(utxo.txid);
      usedUtxosWithHex.push({ ...utxo, rawHex });
    }

    const amountRibbits = tx.value.amountRibbits;
    const signer = deriveSigner(mnemonic);
    const signedHex = await createSignedTx(
      signer,
      form.recipient,
      amountRibbits,
      usedUtxosWithHex,
      tx.value.estimatedFeeRibbits
    );
    const result = await broadcastTx(signedHex);
    ui.txid = result;

    await walletStore.refreshBalance(true);
    const elapsed = Date.now() - startTime;
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));

    form.reset();
    ui.step = 3;
  } catch (e: any) {
    form.setError('general', e.message || 'Failed to send');
  } finally {
    form.isProcessing = false;
  }
}

function handleCancel() {
  form.reset();
  router.push('/dashboard');
}

function openExplorer() {
  walletStore.openExplorerTx(ui.txid);
}

onMounted(async () => {
  // Sync persisted form data to tx object on mount
  if (form.recipient) tx.value.recipient = form.recipient;
  if (form.inputAmount) {
    const val = parseFloat(form.inputAmount);
    tx.value.amountPep = isNaN(val) ? 0 : ui.isFiatMode ? val / currentPrice.value : val;
  }

  try {
    const [fees, utxos] = await Promise.all([
      fetchRecommendedFees(),
      fetchUtxos(walletStore.address!)
    ]);

    tx.value.fees = fees;
    // Only use confirmed UTXOs for spending — unconfirmed outputs could be
    // invalidated if the parent transaction is dropped from the mempool.
    tx.value.utxos = utxos.filter((u) => u.status.confirmed);
  } catch (e) {
    console.error('Failed to load transaction requirements', e);
  } finally {
    ui.isLoadingRequirements = false;
  }
});
</script>

<template>
  <div class="relative flex min-h-full flex-col p-6">
    <PepHeader
      :title="ui.step === 3 ? 'Success' : 'Send PEP'"
      :onBack="
        ui.step === 2
          ? () => {
              ui.step = 1;
              form.clearError();
              form.password = '';
            }
          : ui.step === 1
            ? handleCancel
            : undefined
      "
      :absolute="false"
    />

    <!-- Step 1 -->
    <div v-if="ui.step === 1" class="flex flex-1 flex-col pt-4">
      <div class="flex-1 space-y-6">
        <PepInput
          v-model="form.recipient"
          id="recipient"
          label="Recipient Address"
          placeholder="Enter address"
          :error="form.errors.recipient"
          :disabled="form.isProcessing || ui.isLoadingRequirements"
          clearable
          autofocus
          @blur="handleAddressBlur"
        />

        <div class="space-y-1">
          <div class="flex items-end justify-between px-1">
            <label for="amount" class="text-offwhite block text-sm font-medium">Amount</label>
            <div class="flex items-center space-x-2 text-sm font-bold tracking-wider uppercase">
              <span class="text-slate-500">Available:</span>
              <span class="text-slate-300">{{ displayBalance }}</span>
              <button
                @click="setMax"
                :disabled="form.isProcessing || ui.isLoadingRequirements"
                class="text-pep-green-light hover:text-pep-green cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                tabindex="-1"
              >
                MAX
              </button>
            </div>
          </div>

          <div
            class="focus-within:outline-pep-green mt-2 flex items-center rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 transition-opacity focus-within:outline-2 focus-within:-outline-offset-2"
            :class="{
              'pointer-events-none opacity-50': form.isProcessing || ui.isLoadingRequirements
            }"
          >
            <div class="shrink-0 pl-3 text-sm font-bold text-slate-500 select-none">
              {{ ui.isFiatMode ? walletStore.selectedCurrency : 'PEP' }}
            </div>
            <input
              id="amount"
              type="number"
              v-model="form.inputAmount"
              placeholder="0.00"
              :disabled="form.isProcessing || ui.isLoadingRequirements"
              class="text-offwhite block min-w-0 grow [appearance:textfield] bg-transparent py-1.5 pr-2 pl-1.5 text-base font-bold placeholder:text-gray-500 focus:outline-none sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              @click="toggleMode"
              :disabled="form.isProcessing || ui.isLoadingRequirements"
              class="hover:text-pep-green-light mr-2 shrink-0 cursor-pointer rounded p-1 text-slate-500 transition-colors disabled:cursor-not-allowed"
              title="Switch currency"
              tabindex="-1"
            >
              <PepIcon name="swap" size="16" />
            </button>
          </div>

          <div class="mt-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
            <div class="flex flex-col">
              <span class="text-[10px] font-bold tracking-wider text-slate-500 uppercase"
                >Estimated Fee</span
              >
              <span class="text-xs font-bold text-slate-300">{{ displayFee }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-6">
        <div class="mb-2 flex h-6 items-center justify-center">
          <p
            class="text-center text-sm font-medium text-red-400 transition-opacity duration-200"
            :class="form.hasError() ? 'opacity-100' : 'pointer-events-none opacity-0 select-none'"
          >
            {{ form.errors.general || form.errors.recipient }}
          </p>
        </div>
        <PepButton
          @click="handleReview"
          :loading="form.isProcessing || ui.isLoadingRequirements"
          :disabled="!form.recipient || tx.amountPep <= 0 || form.hasError() || isInsufficientFunds"
          :variant="isInsufficientFunds ? 'danger' : 'primary'"
          class="w-full"
        >
          {{ isInsufficientFunds ? 'Insufficient funds' : 'Next' }}
        </PepButton>
      </div>
    </div>

    <!-- Step 2 -->
    <div v-if="ui.step === 2" class="flex flex-1 flex-col pt-4">
      <PepForm :loading="form.isProcessing" @submit="handleSend" class="flex flex-1 flex-col">
        <div class="flex-1 space-y-4">
          <div class="space-y-4 rounded-2xl border border-slate-700 bg-slate-800 p-4 text-left">
            <div class="flex flex-col space-y-0.5">
              <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                >Sending</span
              >
              <span class="text-offwhite text-xl font-bold"
                >{{ parseFloat(tx.amountPep.toFixed(8)) }} PEP</span
              >
            </div>

            <div class="flex flex-col space-y-0.5">
              <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">To</span>
              <span class="font-mono text-xs leading-relaxed break-all text-slate-300">{{
                form.recipient
              }}</span>
            </div>

            <div class="flex flex-col space-y-0.5">
              <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
                >Network Fee</span
              >
              <span class="text-sm font-bold text-slate-400">{{ displayFee }}</span>
            </div>
          </div>

          <div v-if="!walletStore.isMnemonicLoaded" class="mt-4">
            <PepPasswordInput
              v-model="form.password"
              id="confirm-password"
              label="Enter Password to Confirm"
              placeholder="Enter your password"
              :error="form.errors.general"
            />
          </div>
        </div>

        <template #actions>
          <div class="space-y-3">
            <div
              v-if="walletStore.isMnemonicLoaded"
              class="mb-2 flex h-6 items-center justify-center"
            >
              <p
                class="text-center text-sm font-medium text-red-400 transition-opacity duration-200"
                :class="
                  form.hasError() ? 'opacity-100' : 'pointer-events-none opacity-0 select-none'
                "
              >
                {{ form.errors.general }}
              </p>
            </div>
            <PepLoadingButton
              type="submit"
              :loading="form.isProcessing"
              :min-loading-ms="UX_DELAY_SLOW"
              :disabled="form.hasError()"
              class="w-full"
            >
              Send
            </PepLoadingButton>
            <PepButton
              type="button"
              @click="handleCancel"
              variant="secondary"
              :disabled="form.isProcessing"
              class="w-full"
            >
              Cancel
            </PepButton>
          </div>
        </template>
      </PepForm>
    </div>

    <!-- Step 3 -->
    <div v-if="ui.step === 3" class="flex flex-1 flex-col items-center pt-12 text-center">
      <div class="w-full flex-1 space-y-8">
        <PepIcon name="checkmark-circle" size="80" class="text-pep-green-light mx-auto" />
        <div class="space-y-2">
          <h3 class="text-offwhite text-xl font-bold">Transaction sent!</h3>
          <p class="text-sm text-slate-400">Your PEP is on its way.</p>
        </div>

        <PepInputGroup
          label="Transaction ID"
          id="sent-txid"
          labelClass="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1 text-left"
        >
          <div class="flex items-center gap-2">
            <div
              class="flex h-[38px] flex-1 items-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-left"
            >
              <span class="inline-flex max-w-full min-w-0 font-mono text-[11px] text-slate-400">
                <span class="flex min-w-0">
                  <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{{
                    txidStart
                  }}</span>
                </span>
                <span class="whitespace-nowrap">{{ txidEnd }}</span>
              </span>
            </div>

            <span class="inline-flex">
              <el-copyable id="sent-txid" class="hidden">{{ ui.txid }}</el-copyable>
              <button
                type="button"
                command="--copy"
                commandfor="sent-txid"
                class="group text-offwhite copied:text-pep-green-light copied:hover:text-pep-green-light inline-flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-700 bg-slate-800 transition-colors hover:text-white"
              >
                <PepIcon name="copy" class="copied:hidden h-5 w-5" />
                <PepIcon name="check" class="copied:block hidden h-5 w-5" />
              </button>
            </span>
          </div>
        </PepInputGroup>
      </div>

      <div class="w-full space-y-3 pt-8">
        <PepButton @click="openExplorer" class="w-full"> View on Explorer </PepButton>
        <PepButton @click="router.push('/dashboard')" variant="secondary" class="w-full">
          Back to Dashboard
        </PepButton>
      </div>
    </div>
  </div>
</template>
