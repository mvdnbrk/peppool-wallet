<script setup lang="ts">
import { computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { signMessage } from '@/utils/crypto';
import { useApprovalRequest } from '@/composables/useApprovalRequest';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';

interface SignMessageParams {
  message: string;
}

const walletStore = useWalletStore();

const {
  origin,
  requestData,
  password,
  error,
  isProcessing,
  isMnemonicLoaded,
  runWithMnemonic,
  approve,
  reject
} = useApprovalRequest<SignMessageParams>();

const messageToSign = computed(() => requestData.value?.params.message ?? '');

async function handleApprove() {
  await runWithMnemonic(async (mnemonic) => {
    const signature = signMessage(mnemonic, messageToSign.value, walletStore.activeAccountIndex, 0);
    await approve({
      signature,
      address: walletStore.address,
      message: messageToSign.value
    });
  });
}

function handleReject() {
  reject('User rejected the signature request');
}
</script>

<template>
  <PepMainLayout>
    <div class="space-y-6">
      <div class="space-y-2 text-center">
        <h2 class="truncate text-sm font-medium text-slate-400">{{ origin }}</h2>
        <p class="text-lg font-bold text-white">Requests Signature</p>
      </div>

      <div class="space-y-4">
        <h3 class="px-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">Message</h3>
        <div
          class="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-sm leading-relaxed break-all whitespace-pre-wrap"
        >
          {{ messageToSign }}
        </div>
      </div>

      <div v-if="!isMnemonicLoaded" class="space-y-2">
        <PepPasswordInput
          id="sign-message-password"
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
      <div class="grid grid-cols-2 gap-4">
        <PepButton
          id="reject-signature-button"
          variant="secondary"
          @click="handleReject"
          :disabled="isProcessing"
          >Cancel</PepButton
        >
        <PepButton id="approve-signature-button" @click="handleApprove" :loading="isProcessing"
          >Sign</PepButton
        >
      </div>
    </template>
  </PepMainLayout>
</template>
