<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { signMessage } from '@/utils/crypto';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';

const walletStore = useWalletStore();

const requestId = ref('');
const origin = ref('');
const messageToSign = ref('');
const password = ref('');
const error = ref('');
const isProcessing = ref(false);

const isMnemonicLoaded = computed(() => walletStore.isMnemonicLoaded);

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  requestId.value = params.get('id') || '';
  origin.value = params.get('origin') || '';

  // Read the full request from storage (message can be multiline/long)
  const key = `request_${requestId.value}`;
  const stored = await chrome.storage.local.get(key);
  const request = stored[key] as { params?: { message?: string } } | undefined;
  if (request?.params?.message) {
    messageToSign.value = request.params.message;
  }

  await walletStore.checkSession();
});

async function handleApprove() {
  if (!requestId.value) return;
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
      const signature = signMessage(
        mnemonic,
        messageToSign.value,
        walletStore.activeAccountIndex,
        0
      );

      chrome.runtime.sendMessage({
        target: 'peppool-background-response',
        requestId: requestId.value,
        result: {
          signature,
          address: walletStore.address,
          message: messageToSign.value
        }
      });
    });

    // Cleanup storage
    await chrome.storage.local.remove(`request_${requestId.value}`);

    window.close();
  } catch (err: any) {
    console.error('Sign message failed', err);
    error.value = err.message || 'Failed to sign message';
    isProcessing.value = false;
  }
}

async function handleReject() {
  if (!requestId.value) return;

  chrome.runtime.sendMessage({
    target: 'peppool-background-response',
    requestId: requestId.value,
    error: 'User rejected the signature request'
  });

  // Cleanup storage
  await chrome.storage.local.remove(`request_${requestId.value}`);

  window.close();
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
