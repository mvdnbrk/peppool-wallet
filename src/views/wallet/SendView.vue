<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useApp } from '@/composables/useApp';
import { useSendTransaction } from '@/composables/useSendTransaction';
import { isValidAddress } from '@/utils/crypto';
import { useForm } from '@/utils/form';
import { UX_DELAY_FAST, UX_DELAY_SLOW } from '@/utils/constants';

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

const recipientInput = ref<any>(null);

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
  step: 1
});

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
    await send(form.password, form.isMax);

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
  walletStore.openExplorerTx(txid.value);
}

onMounted(async () => {
  // Manual autofocus only if empty
  if (!form.recipient) {
    setTimeout(() => recipientInput.value?.focus(), 50);
  }

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
      <PepForm id="send-review-form" class="flex flex-1 flex-col" @submit="handleReview">
        <PepInput
          ref="recipientInput"
          v-model="form.recipient"
          id="recipient"
          label="Recipient Address"
          placeholder="Enter address"
          :error="form.errors.recipient"
          :disabled="form.isProcessing || isLoadingRequirements"
          clearable
          autofocus
          @blur="handleAddressBlur"
        />

        <div class="space-y-1">
          <PepAmountInput
            v-model:ribbits="form.amountRibbits"
            v-model:isFiatMode="form.isFiatMode"
            :price="currentPrice"
            :disabled="form.isProcessing || isLoadingRequirements"
            @change-max="form.isMax = $event"
          >
            <template #extra>
              <div class="flex items-center space-x-2 text-sm font-bold tracking-wider uppercase">
                <span class="text-slate-500">Available:</span>
                <span class="text-slate-300">{{ displayBalance(form.isFiatMode) }}</span>
                <button
                  id="send-max-button"
                  type="button"
                  @click="setMax"
                  :disabled="form.isProcessing || isLoadingRequirements"
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

        <div class="mt-2 flex h-6 items-center justify-center">
          <p
            class="text-center text-sm font-medium text-red-400 transition-opacity duration-200"
            :class="form.hasError() ? 'opacity-100' : 'pointer-events-none opacity-0 select-none'"
          >
            {{ form.errors.general }}
          </p>
        </div>

        <template #actions>
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
        </template>
      </PepForm>
    </div>

    <!-- Step 2 -->
    <div v-if="ui.step === 2" class="flex flex-1 flex-col">
      <PepForm
        id="send-transaction-form"
        :loading="form.isProcessing"
        @submit="handleSend"
        class="flex flex-1 flex-col"
      >
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

        <div v-if="walletStore.isMnemonicLoaded" class="mt-2 flex h-6 items-center justify-center">
          <p
            class="text-center text-sm font-medium text-red-400 transition-opacity duration-200"
            :class="form.hasError() ? 'opacity-100' : 'pointer-events-none opacity-0 select-none'"
          >
            {{ form.errors.general }}
          </p>
        </div>

        <template #actions>
          <div class="space-y-3">
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
    <PepSuccessState
      v-if="ui.step === 3"
      title="Transaction sent!"
      description="Your PEP is on its way."
    >
      <PepCopyableId label="Transaction ID" :id="txid" />
    </PepSuccessState>

    <template #actions>
      <div v-if="ui.step === 3" class="w-full space-y-3">
        <PepButton @click="openExplorer" class="w-full"> View on Explorer </PepButton>
        <PepButton @click="router.push('/dashboard')" variant="secondary" class="w-full">
          Close
        </PepButton>
      </div>
    </template>
  </PepMainLayout>
</template>
