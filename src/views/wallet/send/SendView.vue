<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue';
import { useApp } from '@/composables/useApp';
import { useSendTransaction } from '@/composables/useSendTransaction';
import { useSessionDraft } from '@/composables/useSessionDraft';
import { isValidAddress } from '@/utils/crypto';
import { useForm } from '@/utils/form';
import { UX_DELAY_FAST, UX_DELAY_SLOW } from '@/utils/constants';
import { pepeExplorer } from '@/utils/explorer';
import * as price from '@/utils/price';

import SendStepForm from './SendStepForm.vue';
import SendStepReview from './SendStepReview.vue';
import SendStepSuccess from './SendStepSuccess.vue';

const { router, account, settings: settingsStore } = useApp();
const {
  tx,
  txid,
  isLoadingFees,
  currentPrice,
  isInsufficientFunds,
  displayFee,
  maxRibbits,
  loadFees,
  validateStep1,
  send
} = useSendTransaction();

const form = useForm({
  recipient: '',
  amountRibbits: 0,
  isFiatMode: false,
  password: '',
  step: 1,
  txid: ''
});

// Draft persists across popup close in chrome.storage.session, dies on browser
// restart. Password is in-memory only — never written to storage.
const draft = useSessionDraft({
  key: 'send_draft',
  data: () => ({
    recipient: form.recipient,
    amountRibbits: form.amountRibbits,
    isFiatMode: form.isFiatMode,
    step: form.step,
    txid: form.txid
  })
});

// Sync txid from composable to persisted form
watch(txid, (newTxid) => {
  if (newTxid) form.txid = newTxid;
});

const displayBalance = computed(() => {
  const ribbits = account.spendableBalanceRibbits;
  if (form.isFiatMode) {
    return price.format(ribbits);
  }
  return price.formatPep(ribbits);
});

const canReview = computed(() => {
  return (
    !isLoadingFees.value &&
    form.recipient &&
    tx.value.amountRibbits > 0 &&
    !form.hasError() &&
    !isInsufficientFunds.value
  );
});

const nextButtonLabel = computed(() => {
  if (isLoadingFees.value) return 'Loading...';
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
  form.amountRibbits = maxRibbits.value;
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
    await send(form.password);

    const elapsed = Date.now() - startTime;
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));

    // Clear inputs but keep success screen
    form.recipient = '';
    form.amountRibbits = 0;
    form.password = '';
    form.step = 3;
  } catch (e: any) {
    form.setError('general', e.message || 'Failed to send');
  } finally {
    form.isProcessing = false;
  }
}

function handleCancel() {
  form.reset();
  draft.clear();
  router.push('/dashboard');
}

function handleClose() {
  form.reset();
  draft.clear();
  router.push('/dashboard');
}

function openExplorer() {
  pepeExplorer.openTx(settingsStore.settings.explorer, form.txid);
}

onMounted(async () => {
  const data = await draft.load();
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) (form as any)[key] = value;
    }
    // Step 2 can't survive remount — password isn't persisted
    if (form.step === 2) form.step = 1;
  }

  // Let the form's auto-clear-error watcher flush against the restored
  // values before we run validation, so handleAddressBlur's error sticks.
  await nextTick();

  if (form.recipient) {
    tx.value.recipient = form.recipient;
    handleAddressBlur();
  }

  try {
    await loadFees();
  } catch {
    // Error handled in composable
  }
});
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader
        :title="form.step === 3 ? 'Success' : 'Send PEP'"
        :on-back="
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
      :is-insufficient-funds="isInsufficientFunds"
      :current-price="currentPrice"
      :display-balance="displayBalance"
      :display-fee="displayFee"
      @address-blur="handleAddressBlur"
      @set-max="setMax"
      @next="handleReview"
    />

    <SendStepReview
      v-if="form.step === 2"
      :form="form"
      :tx="tx"
      :display-fee="displayFee"
      @send="handleSend"
    />

    <SendStepSuccess v-if="form.step === 3" :txid="form.txid" />

    <template #actions>
      <!-- Step 1 Actions -->
      <PepLoadingButton
        v-if="form.step === 1"
        :loading="form.isProcessing"
        :min-loading-ms="UX_DELAY_FAST"
        :disabled="!canReview"
        :variant="isInsufficientFunds ? 'danger' : 'primary'"
        class="w-full"
        @click="handleReview"
      >
        {{ nextButtonLabel }}
      </PepLoadingButton>

      <!-- Step 2 Actions -->
      <div v-if="form.step === 2" class="space-y-3">
        <PepLoadingButton
          :loading="form.isProcessing"
          :min-loading-ms="UX_DELAY_SLOW"
          :disabled="form.hasError()"
          class="w-full"
          @click="handleSend"
        >
          Send
        </PepLoadingButton>
        <PepButton
          type="button"
          variant="secondary"
          :disabled="form.isProcessing"
          class="w-full"
          @click="handleCancel"
        >
          Cancel
        </PepButton>
      </div>

      <!-- Step 3 Actions -->
      <div v-if="form.step === 3" class="w-full space-y-3">
        <PepButton class="w-full" @click="openExplorer"> View on Explorer </PepButton>
        <PepButton variant="secondary" class="w-full" @click="handleClose"> Close </PepButton>
      </div>
    </template>
  </PepMainLayout>
</template>
