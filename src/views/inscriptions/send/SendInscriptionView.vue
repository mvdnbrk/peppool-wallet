<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useApp } from '@/composables/useApp';
import { useSendInscription } from '@/composables/useSendInscription';
import { useInscriptionStore } from '@/stores/inscriptions';
import { fetchInscription } from '@/utils/api';
import { isValidAddress } from '@/utils/crypto';
import { useForm } from '@/utils/form';
import { UX_DELAY_FAST, UX_DELAY_SLOW } from '@/utils/constants';
import { pepeExplorer } from '@/utils/explorer';
import * as price from '@/utils/price';
import type { Inscription } from '@/models/Inscription';

import SendInscriptionStepForm from './SendInscriptionStepForm.vue';
import SendInscriptionStepReview from './SendInscriptionStepReview.vue';
import SendInscriptionStepSuccess from './SendInscriptionStepSuccess.vue';

const { router, route, settings: settingsStore } = useApp();
const inscriptionStore = useInscriptionStore();
const {
  isLoadingFees,
  estimatedFeeRibbits,
  isInsufficientFunds,
  loadFees,
  validateRecipient,
  send
} = useSendInscription();

const id = route.params.id as string;

const fetched = ref<Inscription | null>(null);
const inscription = computed<Inscription | null>(() => {
  const stored = inscriptionStore.inscriptions[id];
  if (stored) return stored as Inscription;
  return fetched.value;
});

const isLoadingInscription = ref(false);
const inscriptionError = ref('');

const form = useForm({
  recipient: '',
  password: '',
  step: 1,
  txid: ''
});

const displayFee = computed(() => price.formatPep(estimatedFeeRibbits.value));

const canReview = computed(() => {
  return (
    !isLoadingFees.value &&
    !!form.recipient &&
    !form.hasError() &&
    !isInsufficientFunds.value &&
    !!inscription.value
  );
});

const nextButtonLabel = computed(() => {
  if (isLoadingFees.value) return 'Loading...';
  if (isInsufficientFunds.value) return 'Insufficient funds';
  return 'Next';
});

watch(
  () => form.recipient,
  (val) => {
    const stripped = val.replace(/\s/g, '');
    if (stripped !== val) form.recipient = stripped;
  }
);

function handleAddressBlur() {
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
    await validateRecipient(form.recipient);
    const elapsed = Date.now() - startTime;
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));
    form.step = 2;
  } catch (e) {
    form.setError('general', e instanceof Error ? e.message : 'Validation failed');
  } finally {
    form.isProcessing = false;
  }
}

async function handleSend() {
  if (!inscription.value) return;
  form.isProcessing = true;
  form.clearError('general');
  const startTime = Date.now();

  try {
    const txid = await send(inscription.value, form.recipient, form.password);
    form.txid = txid;
    const elapsed = Date.now() - startTime;
    if (elapsed < 500) await new Promise((r) => setTimeout(r, 500 - elapsed));

    form.recipient = '';
    form.password = '';
    form.step = 3;
  } catch (e) {
    form.setError('general', e instanceof Error ? e.message : 'Failed to send');
  } finally {
    form.isProcessing = false;
  }
}

function handleCancel() {
  form.reset();
  router.push(`/inscription/${id}`);
}

function handleClose() {
  form.reset();
  router.push('/inscriptions');
}

function openExplorer() {
  pepeExplorer.openTx(settingsStore.settings.explorer, form.txid);
}

onMounted(async () => {
  if (!inscription.value) {
    isLoadingInscription.value = true;
    try {
      fetched.value = await fetchInscription(id);
    } catch (e) {
      inscriptionError.value = e instanceof Error ? e.message : 'Failed to load inscription';
    } finally {
      isLoadingInscription.value = false;
    }
  }

  try {
    await loadFees();
  } catch {
    // surfaced via isInsufficientFunds / loading state
  }
});
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader
        :title="form.step === 3 ? 'Success' : 'Send Inscription'"
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

    <div
      v-if="isLoadingInscription"
      class="flex flex-1 flex-col items-center justify-center space-y-4"
    >
      <PepSpinner size="32" class="text-pep-green" />
      <p class="text-sm font-bold tracking-widest text-slate-500 uppercase">Loading...</p>
    </div>

    <div
      v-else-if="inscriptionError"
      class="flex flex-1 flex-col items-center justify-center space-y-4 text-center"
    >
      <p class="font-bold text-red-400">{{ inscriptionError }}</p>
    </div>

    <SendInscriptionStepForm
      v-else-if="inscription && form.step === 1"
      :form="form"
      :inscription="inscription"
      :is-insufficient-funds="isInsufficientFunds"
      :display-fee="displayFee"
      @address-blur="handleAddressBlur"
      @next="handleReview"
    />

    <SendInscriptionStepReview
      v-else-if="inscription && form.step === 2"
      :form="form"
      :inscription="inscription"
      :display-fee="displayFee"
      @send="handleSend"
    />

    <SendInscriptionStepSuccess v-if="form.step === 3" :txid="form.txid" />

    <template #actions>
      <PepLoadingButton
        v-if="inscription && form.step === 1"
        :loading="form.isProcessing"
        :min-loading-ms="UX_DELAY_FAST"
        :disabled="!canReview"
        :variant="isInsufficientFunds ? 'danger' : 'primary'"
        class="w-full"
        @click="handleReview"
      >
        {{ nextButtonLabel }}
      </PepLoadingButton>

      <div v-if="inscription && form.step === 2" class="space-y-3">
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

      <div v-if="form.step === 3" class="w-full space-y-3">
        <PepButton class="w-full" @click="openExplorer">View on Explorer</PepButton>
        <PepButton variant="secondary" class="w-full" @click="handleClose">Close</PepButton>
      </div>
    </template>
  </PepMainLayout>
</template>
