<script setup lang="ts">
import { useApp } from '@/composables/useApp';

const { router, wallet: walletStore } = useApp();

async function handleSwitch(index: number) {
  await walletStore.switchAccount(index);
  router.back();
}

function handleEdit(index: number, event: Event) {
  event.stopPropagation();
  router.push(`/settings/accounts/edit/${index}`);
}

function handleAdd() {
  router.push('/settings/accounts/edit/-1');
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Accounts" />
    </template>

    <PepList id="accounts-list">
      <div
        v-for="(account, index) in walletStore.accounts"
        :id="`account-item-${index}`"
        :key="account.address"
        class="group relative flex cursor-pointer items-center justify-between border-b border-slate-800/50 p-4 transition-colors last:border-0 hover:bg-slate-800"
        @click="handleSwitch(index)"
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
              v-if="walletStore.activeAccountIndex === index"
              :name="walletStore.activeAccountIndex === index ? 'check' : 'checkmark-circle'"
              size="20"
            />
            <span v-else class="text-xs font-bold">P</span>
          </div>

          <span class="truncate text-sm font-bold text-white">{{ account.label }}</span>
        </div>

        <button
          :id="`edit-account-button-${index}`"
          type="button"
          class="hover:text-pep-green-light rounded-lg p-2 text-slate-500 transition-colors"
          @click="handleEdit(index, $event)"
        >
          <PepIcon name="edit" size="18" />
        </button>
      </div>
    </PepList>

    <template #actions>
      <PepButton id="add-account-button" variant="secondary" class="w-full" @click="handleAdd">
        Add New Account
      </PepButton>
    </template>
  </PepMainLayout>
</template>
