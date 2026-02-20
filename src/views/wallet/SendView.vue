<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useApp } from '@/composables/useApp';

import {
  fetchUtxos,
  broadcastTx,
  fetchTxHex,
  validateAddress,
  fetchRecommendedFees
} from '@/utils/api';
import { createSignedTx, isValidAddress, deriveSigner, type UTXO } from '@/utils/crypto';
import { decrypt as decryptMnemonic } from '@/utils/encryption';
import { useForm } from '@/utils/form';
import { SendTransaction } from '@/models/SendTransaction';
import {
  RIBBITS_PER_PEP,
  MIN_SEND_PEP,
  formatFiat,
  UX_DELAY_FAST,
  UX_DELAY_SLOW
} from '@/utils/constants';

const { router, wallet: walletStore } = useApp();

const recipientInput = ref<any>(null);

// The logical object for the transaction
const tx = ref(new SendTransaction(walletStore.address!));

const form = useForm(
  {
    recipient: '',
    amountRibbits: 0,
    isFiatMode: false,
    password: '',
    isMax: false
  },
  { persistKey: 'send', sensitiveFields: ['password'] }
);

const ui = reactive({
  step: 1,
  txid: '',
  isLoadingRequirements: true
});

const currentPrice = computed(() => walletStore.prices[walletStore.selectedCurrency]);

const isInsufficientFunds = computed(() => {
  if (ui.isLoadingRequirements || tx.value.amountRibbits <= 0) return false;
  const needed = tx.value.amountRibbits + tx.value.estimatedFeeRibbits;
  return tx.value.balanceRibbits < needed;
});

const canReview = computed(() => {
  return (
    !ui.isLoadingRequirements &&
    form.recipient &&
    tx.value.amountRibbits > 0 &&
    !form.hasError() &&
    !isInsufficientFunds.value
  );
});

const nextButtonLabel = computed(() => {
  if (ui.isLoadingRequirements) return 'Loading...';
  if (isInsufficientFunds.value) return 'Insufficient funds';
  return 'Next';
});

// Strip whitespace from recipient as the user types (addresses never contain spaces)
watch(
  () => form.recipient,
  (val) => {
    const stripped = val.replace(/\s/g, '');
    if (stripped !== val) form.recipient = stripped;
    tx.value.recipient = stripped;
  }
);

// Sync persisted amount to tx object
watch(
  () => form.amountRibbits,
  (val) => {
    tx.value.amountRibbits = val;
  },
  { immediate: true }
);

// Show spendable balance (confirmed UTXOs only), not the full wallet balance
const displayBalance = computed(() => {
  const spendable = tx.value.balancePep;
  if (form.isFiatMode) {
    const fiatValue = spendable * currentPrice.value;
    return `${walletStore.currencySymbol}${formatFiat(fiatValue)} ${walletStore.selectedCurrency}`;
  }
  return `${parseFloat(spendable.toFixed(8))} PEP`;
});

const displayFee = computed(() => {
  const feePep = tx.value.estimatedFeeRibbits / RIBBITS_PER_PEP;
  return `${parseFloat(feePep.toFixed(8))} PEP`;
});

function setMax() {
  // Set the canonical ribbits amount directly — no precision loss
  form.isMax = true;
  form.amountRibbits = tx.value.maxRibbits;
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
  if (!form.recipient || tx.value.amountRibbits <= 0) {
    form.setError('general', 'Please enter a valid address and amount');
    return;
  }

  if (tx.value.amountRibbits < Math.round(MIN_SEND_PEP * RIBBITS_PER_PEP)) {
    form.setError('general', `Minimum amount to send is ${MIN_SEND_PEP} PEP`);
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

    const { selectedUtxos } = tx.value.selectUtxos(form.isMax);
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
  // Manual autofocus only if empty
  if (!form.recipient) {
    setTimeout(() => recipientInput.value?.focus(), 50);
  }

  // Sync persisted form data to tx object on mount
  if (form.recipient) tx.value.recipient = form.recipient;

  try {
    const [fees, utxos] = await Promise.all([
      fetchRecommendedFees(),
      fetchUtxos(walletStore.address!)
    ]);

    tx.value.fees = fees;
    // Only use confirmed UTXOs for spending — unconfirmed outputs could be
    // invalidated if the parent transaction is dropped from the mempool.
    tx.value.utxos = utxos.filter((u) => u.status.confirmed);

    // If we were in MAX state, recalculate it now that fees/utxos are fresh
    if (form.isMax) {
      setMax();
    }
  } catch (e) {
    console.error('Failed to load transaction requirements', e);
  } finally {
    ui.isLoadingRequirements = false;
  }
});
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader
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
      />
    </template>

    <!-- Step 1 -->
    <div v-if="ui.step === 1" class="flex flex-1 flex-col">
      <PepForm class="flex flex-1 flex-col" @submit="handleReview">
        <PepInput
          ref="recipientInput"
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
          <PepAmountInput
            v-model:ribbits="form.amountRibbits"
            v-model:isFiatMode="form.isFiatMode"
            :price="currentPrice"
            :disabled="form.isProcessing || ui.isLoadingRequirements"
            @change-max="form.isMax = $event"
          >
            <template #extra>
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
            </template>
          </PepAmountInput>

          <div class="mt-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
            <div class="flex flex-col">
              <span class="text-[10px] font-bold tracking-wider text-slate-500 uppercase"
                >Estimated Fee</span
              >
              <span class="text-xs font-bold text-slate-300">{{ displayFee }}</span>
            </div>
          </div>
        </div>

        <template #actions>
          <div>
            <div class="mb-2 flex h-6 items-center justify-center">
              <p
                class="text-center text-sm font-medium text-red-400 transition-opacity duration-200"
                :class="
                  form.hasError() ? 'opacity-100' : 'pointer-events-none opacity-0 select-none'
                "
              >
                {{ form.errors.general || form.errors.recipient }}
              </p>
            </div>
            <PepLoadingButton
              type="submit"
              :loading="form.isProcessing"
              :minLoadingMs="UX_DELAY_FAST"
              :disabled="!canReview"
              :variant="isInsufficientFunds ? 'danger' : 'primary'"
              class="w-full"
            >
              {{ nextButtonLabel }}
            </PepLoadingButton>
          </div>
        </template>
      </PepForm>
    </div>

    <!-- Step 2 -->
    <div v-if="ui.step === 2" class="flex flex-1 flex-col">
      <PepForm :loading="form.isProcessing" @submit="handleSend" class="flex flex-1 flex-col">
        <div class="space-y-4 rounded-2xl border border-slate-700 bg-slate-800 p-4 text-left">
          <div class="flex flex-col space-y-0.5">
            <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
              >Sending</span
            >
            <span class="text-offwhite text-xl font-bold">{{ tx.amountPep }} PEP</span>
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

        <div v-if="!walletStore.isMnemonicLoaded" class="mt-0">
          <PepPasswordInput
            v-model="form.password"
            id="confirm-password"
            label="Enter Password to Confirm"
            placeholder="Enter your password"
            :error="form.errors.general"
          />
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
              :minLoadingMs="UX_DELAY_SLOW"
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

        <PepCopyableId label="Transaction ID" :id="ui.txid" />
      </div>

      <div class="w-full space-y-3 pt-8">
        <PepButton @click="openExplorer" class="w-full"> View on Explorer </PepButton>
        <PepButton @click="router.push('/dashboard')" variant="secondary" class="w-full">
          Back to Dashboard
        </PepButton>
      </div>
    </div>
  </PepMainLayout>
</template>
