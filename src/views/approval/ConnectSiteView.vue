<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepCard from '@/components/ui/PepCard.vue';

const walletStore = useWalletStore();

interface Permissions {
  [origin: string]: string[];
}

const requestId = ref('');
const origin = ref('');

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  requestId.value = params.get('id') || '';
  origin.value = params.get('origin') || '';

  // Ensure session is restored in this window context
  await walletStore.checkSession();
});

async function handleApprove() {
  if (!requestId.value) return;

  // 1. Persist the permission
  const data = await chrome.storage.local.get('peppool_permissions');
  const permissions = (data.peppool_permissions || {}) as Permissions;

  if (!permissions[origin.value]) {
    permissions[origin.value] = [];
  }

  const originPermissions = permissions[origin.value];
  if (originPermissions && !originPermissions.includes('connect')) {
    originPermissions.push('connect');
  }

  await chrome.storage.local.set({ peppool_permissions: permissions });

  // 2. Respond to background
  const address = walletStore.address;
  chrome.runtime.sendMessage({
    target: 'peppool-background-response',
    requestId: requestId.value,
    result: [address]
  });

  // 3. Cleanup storage
  await chrome.storage.local.remove(`request_${requestId.value}`);

  // 4. Close the window
  window.close();
}

async function handleReject() {
  if (!requestId.value) return;

  chrome.runtime.sendMessage({
    target: 'peppool-background-response',
    requestId: requestId.value,
    error: 'User rejected the connection request'
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
        <h2 class="max-w-full truncate px-4 text-lg font-medium text-white">{{ origin }}</h2>
        <p class="text-sm text-slate-400">wants to connect to your wallet</p>
      </div>

      <PepCard class="p-4">
        <p class="truncate text-sm font-medium text-white">
          {{ walletStore.activeAccount?.label || 'Account' }}
        </p>
        <p class="truncate text-xs text-slate-400">{{ walletStore.address }}</p>
      </PepCard>

      <div class="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <p class="text-xs font-medium text-slate-400">THIS SITE WILL BE ABLE TO:</p>
        <ul class="space-y-2">
          <li class="text-pep-green flex items-start space-x-2 text-sm">
            <PepIcon name="checkmark-circle" class="mt-0.5 h-4 w-4" />
            <span class="text-slate-300">View your wallet address</span>
          </li>
          <li class="text-pep-green flex items-start space-x-2 text-sm">
            <PepIcon name="checkmark-circle" class="mt-0.5 h-4 w-4" />
            <span class="text-slate-300">Request transaction signing</span>
          </li>
        </ul>
      </div>
    </div>

    <template #actions>
      <div class="grid grid-cols-2 gap-4">
        <PepButton id="reject-connect-button" variant="secondary" @click="handleReject"
          >Deny</PepButton
        >
        <PepButton id="approve-connect-button" @click="handleApprove">Accept</PepButton>
      </div>
    </template>
  </PepMainLayout>
</template>
