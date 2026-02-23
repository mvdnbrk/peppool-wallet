<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { signMessage } from '@/utils/crypto';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepPasswordInput from '@/components/ui/form/PepPasswordInput.vue';

const walletStore = useWalletStore();

const requestId = ref('');
const origin = ref('');
const messageToSign = ref('');
const password = ref('');
const error = ref('');
const isProcessing = ref(false);

const isUnlocked = computed(() => walletStore.isUnlocked);
const isMnemonicLoaded = computed(() => walletStore.isMnemonicLoaded);

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  requestId.value = params.get('id') || '';
  origin.value = params.get('origin') || '';
  messageToSign.value = params.get('message') || '';

  await walletStore.checkSession();
});

async function handleApprove() {
  if (!requestId.value) return;
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

    const signature = signMessage(mnemonic, messageToSign.value, walletStore.activeAccountIndex, 0);

    chrome.runtime.sendMessage({
      target: 'peppool-background-response',
      requestId: requestId.value,
      result: {
        signature,
        address: walletStore.address,
        message: messageToSign.value
      }
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
    <template #header>
      <PepPageHeader title="Sign Message" />
    </template>

    <div v-if="!isUnlocked" class="flex flex-col items-center justify-center space-y-6 py-12">
      <div class="space-y-2 text-center">
        <h2 class="text-xl font-bold">Wallet Locked</h2>
        <p class="text-slate-400">Please unlock your wallet to continue.</p>
      </div>
      <PepButton id="unlock-wallet-button" @click="$router.push('/')">Go to Login</PepButton>
    </div>

    <div v-else class="space-y-6">
      <div class="space-y-2 text-center">
        <h2 class="truncate text-sm font-medium text-slate-400">{{ origin }}</h2>
        <p class="text-lg font-bold text-white">Requests Signature</p>
      </div>

      <div class="space-y-4">
        <h3 class="px-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">Message</h3>
        <div
          class="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-sm leading-relaxed break-all"
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

    <template #actions v-if="isUnlocked">
      <div class="grid grid-cols-2 gap-4">
        <PepButton id="reject-signature-button" variant="secondary" @click="handleReject" :disabled="isProcessing"
          >Cancel</PepButton
        >
        <PepButton id="approve-signature-button" @click="handleApprove" :loading="isProcessing">Sign</PepButton>
      </div>
    </template>
  </PepMainLayout>
</template>
