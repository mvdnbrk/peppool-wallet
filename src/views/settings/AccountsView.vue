<script setup lang="ts">
import { ref } from 'vue';
import { useApp } from '@/composables/useApp';
import { Address } from '@/models/Address';

const { router, wallet: walletStore } = useApp();
const isAdding = ref(false);
const error = ref('');

async function handleSwitch(index: number) {
  await walletStore.switchAccount(index);
  router.back();
}

async function handleAdd() {
  if (isAdding.value) return;
  isAdding.value = true;
  error.value = '';
  try {
    await walletStore.addAccount();
  } catch (e: any) {
    error.value = e.message || 'Failed to add account';
  } finally {
    isAdding.value = false;
  }
}

function handleRename(index: number, event: Event) {
  event.stopPropagation();
  router.push(`/settings/accounts/rename/${index}`);
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Accounts" />
    </template>

    <div class="flex flex-1 flex-col space-y-6">
      <div class="flex-1 space-y-3">
        <p class="px-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Your Accounts
        </p>

        <PepList id="accounts-list">
          <div
            v-for="(account, index) in walletStore.accounts"
            :key="account.address"
            :id="`account-item-${index}`"
            @click="handleSwitch(index)"
            class="group relative flex cursor-pointer items-center justify-between border-b border-slate-800/50 p-4 transition-colors last:border-0 hover:bg-slate-800"
          >
            <div class="flex min-w-0 items-center space-x-4">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                :class="
                  walletStore.activeAccountIndex === index
                    ? 'bg-pep-green/20 text-pep-green'
                    : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                "
              >
                <PepIcon
                  :name="walletStore.activeAccountIndex === index ? 'check' : 'checkmark-circle'"
                  size="20"
                  v-if="walletStore.activeAccountIndex === index"
                />
                <span v-else class="text-xs font-bold">P</span>
              </div>

              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-bold text-white">{{ account.label }}</span>
                <span class="truncate font-mono text-[10px] text-slate-500">{{
                  new Address(account.address).truncated
                }}</span>
              </div>
            </div>

            <button
              type="button"
              :id="`rename-account-button-${index}`"
              @click="handleRename(index, $event)"
              class="hover:text-pep-green-light rounded-lg p-2 text-slate-500 transition-colors"
            >
              <PepIcon name="edit" size="18" />
            </button>
          </div>
        </PepList>
      </div>

      <div class="space-y-4 pt-4">
        <div v-if="error" class="px-1 text-sm text-red-400">
          {{ error }}
        </div>
        <PepButton
          id="add-account-button"
          @click="handleAdd"
          variant="secondary"
          class="w-full"
          :loading="isAdding"
        >
          Add New Account
        </PepButton>
      </div>
    </div>
  </PepMainLayout>
</template>
