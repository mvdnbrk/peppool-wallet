<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import PepMainLayout from '@/components/ui/PepMainLayout.vue';
import PepButton from '@/components/ui/PepButton.vue';
import PepPageHeader from '@/components/ui/PepPageHeader.vue';
import PepCard from '@/components/ui/PepCard.vue';

const walletStore = useWalletStore();

interface Permissions {
  [origin: string]: string[];
}

const requestId = ref('');
const origin = ref('');
const isUnlocked = computed(() => walletStore.isUnlocked);

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
    <template #header>
      <PepPageHeader title="Connect dApp" />
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
        <div class="flex justify-center">
          <div
            class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-xl"
          >
            <!-- dApp Icon would go here if available -->
            <span class="text-pepe-green text-2xl font-bold">{{
              origin.charAt(0).toUpperCase()
            }}</span>
          </div>
        </div>
        <h2 class="max-w-full truncate px-4 text-lg font-medium text-white">{{ origin }}</h2>
        <p class="text-sm text-slate-400">wants to connect to your wallet</p>
      </div>

      <div class="space-y-4">
        <h3 class="px-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Selected Account
        </h3>
        <PepCard class="flex items-center space-x-4 p-4">
          <div class="bg-pepe-green/20 flex h-10 w-10 items-center justify-center rounded-full">
            <span class="text-pepe-green font-bold">P</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-white">
              {{ walletStore.activeAccount?.label || 'Account' }}
            </p>
            <p class="truncate text-xs text-slate-400">{{ walletStore.address }}</p>
          </div>
        </PepCard>
      </div>

      <div class="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <p class="text-xs font-medium text-slate-400">THIS SITE WILL BE ABLE TO:</p>
        <ul class="space-y-2">
          <li class="flex items-start space-x-2 text-sm text-slate-300">
            <span class="text-pepe-green mt-0.5">✓</span>
            <span>View your wallet address</span>
          </li>
          <li class="flex items-start space-x-2 text-sm text-slate-300">
            <span class="text-pepe-green mt-0.5">✓</span>
            <span>Request signatures for transactions</span>
          </li>
        </ul>
      </div>
    </div>

    <template #actions v-if="isUnlocked">
      <div class="grid grid-cols-2 gap-4">
        <PepButton id="reject-connect-button" variant="secondary" @click="handleReject">Cancel</PepButton>
        <PepButton id="approve-connect-button" @click="handleApprove">Connect</PepButton>
      </div>
    </template>
  </PepMainLayout>
</template>
