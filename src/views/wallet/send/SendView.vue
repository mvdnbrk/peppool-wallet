<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useApp } from '@/composables/useApp';
import { useSendTransaction } from '@/composables/useSendTransaction';
import { isValidAddress } from '@/utils/crypto';
import { useForm } from '@/utils/form';
import { UX_DELAY_FAST, UX_DELAY_SLOW } from '@/utils/constants';

import SendStepForm from './SendStepForm.vue';
import SendStepReview from './SendStepReview.vue';
import SendStepSuccess from './SendStepSuccess.vue';

const { router, wallet: walletStore } = useApp();
const {
  tx,
  txid,
  isLoadingRequirements,
  currentPrice,
  isInsufficientFunds,
  displayBalance,
  displayFee,
  loadRequirements,
  validateStep1,
  send
} = useSendTransaction();

const form = useForm(
  {
    recipient: '',
    amountRibbits: 0,
    isFiatMode: false,
    password: '',
    isMax: false,
    step: 1,
    txid: ''
  },
  { persistKey: 'send', sensitiveFields: ['password'] }
);

// Sync txid from composable to persisted form
watch(txid, (newTxid) => {
  if (newTxid) form.txid = newTxid;
});

// Step 2 can't survive remount — password isn't persisted
if (form.step === 2) form.step = 1;

const canReview = computed(() => {
  return (
    !isLoadingRequirements.value &&
    form.recipient &&
    tx.value.amountRibbits > 0 &&
    !form.hasError() &&
    !isInsufficientFunds.value
  );
});

const nextButtonLabel = computed(() => {
  if (isLoadingRequirements.value) return 'Loading...';
  if (isInsufficientFunds.value) return 'Insufficient funds';
  return 'Next';
});

// Strip whitespace from recipient as the user types
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

function setMax() {
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
  form.clearError('recipient');
}

async function handleReview() {
  form.isProcessing = true;
  form.clearError('general');
  const startTime = Date.now();

  try {
    await validateStep1(form.recipient, form.amountRibbits);

    const elapsed = Date.now() - startTime;
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));
    form.step = 2;
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
    await send(form.password, form.isMax);

    const elapsed = Date.now() - startTime;
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));

    // Clear inputs but keep success screen
    form.recipient = '';
    form.amountRibbits = 0;
    form.password = '';
    form.isMax = false;
    form.step = 3;
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

function handleClose() {
  form.reset();
  router.push('/dashboard');
}

function openExplorer() {
  walletStore.openExplorerTx(form.txid);
}

onMounted(async () => {
  // Sync persisted form data to tx object on mount
  if (form.recipient) {
    tx.value.recipient = form.recipient;
    handleAddressBlur();
  }

  try {
    await loadRequirements(form.isMax);
  } catch (e) {
    // Error handled in composable
  }
});
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader
        :title="form.step === 3 ? 'Success' : 'Send PEP'"
        :onBack="
          form.step === 3
            ? handleClose
            : form.step === 2
              ? () => {
                  form.step = 1;
                  form.clearError();
                  form.password = '';
                }
              : form.step === 1
                ? handleCancel
                : undefined
        "
      />
    </template>

    <SendStepForm
      v-if="form.step === 1"
      :form="form"
      :isLoadingRequirements="isLoadingRequirements"
      :isInsufficientFunds="isInsufficientFunds"
      :currentPrice="currentPrice"
      :displayBalance="displayBalance(form.isFiatMode)"
      :displayFee="displayFee"
      @address-blur="handleAddressBlur"
      @set-max="setMax"
      @next="handleReview"
    />

    <SendStepReview
      v-if="form.step === 2"
      :form="form"
      :tx="tx"
      :displayFee="displayFee"
      @send="handleSend"
    />

    <SendStepSuccess v-if="form.step === 3" :txid="form.txid" />

    <template #actions>
      <!-- Step 1 Actions -->
      <PepLoadingButton
        v-if="form.step === 1"
        @click="handleReview"
        :loading="form.isProcessing"
        :minLoadingMs="UX_DELAY_FAST"
        :disabled="!canReview"
        :variant="isInsufficientFunds ? 'danger' : 'primary'"
        class="w-full"
      >
        {{ nextButtonLabel }}
      </PepLoadingButton>

      <!-- Step 2 Actions -->
      <div v-if="form.step === 2" class="space-y-3">
        <PepLoadingButton
          @click="handleSend"
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

      <!-- Step 3 Actions -->
      <div v-if="form.step === 3" class="w-full space-y-3">
        <PepButton @click="openExplorer" class="w-full"> View on Explorer </PepButton>
        <PepButton @click="handleClose" variant="secondary" class="w-full"> Close </PepButton>
      </div>
    </template>
  </PepMainLayout>
</template>
