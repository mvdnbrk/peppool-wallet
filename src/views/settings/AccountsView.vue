<script setup lang="ts">
import { useApp } from '@/composables/useApp';
import { Address } from '@/models/Address';

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
          :id="`edit-account-button-${index}`"
          @click="handleEdit(index, $event)"
          class="hover:text-pep-green-light rounded-lg p-2 text-slate-500 transition-colors"
        >
          <PepIcon name="edit" size="18" />
        </button>
      </div>
    </PepList>

    <template #actions>
      <PepButton id="add-account-button" @click="handleAdd" variant="secondary" block>
        Add New Account
      </PepButton>
    </template>
  </PepMainLayout>
</template>
