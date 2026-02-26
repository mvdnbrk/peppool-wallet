<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApp } from '@/composables/useApp';

const { router, wallet: walletStore } = useApp();
const route = useRoute();
const index = parseInt(route.params.index as string);

const label = ref('');
const error = ref('');

onMounted(() => {
  const account = walletStore.accounts[index];
  if (account) {
    label.value = account.label;
  } else {
    router.replace('/settings/accounts');
  }
});

async function handleSave() {
  if (!label.value.trim()) {
    error.value = 'Label cannot be empty';
    return;
  }

  try {
    await walletStore.renameAccount(index, label.value.trim());
    router.back();
  } catch (e: any) {
    error.value = e.message || 'Failed to rename account';
  }
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader title="Rename Account" backTo="/settings/accounts" />
    </template>

    <div class="flex flex-1 flex-col">
      <PepForm id="rename-account-form" @submit="handleSave" class="flex flex-1 flex-col">
        <div class="flex-1">
          <PepInputGroup label="Account Label">
            <PepInput
              id="account-label-input"
              v-model="label"
              placeholder="Enter new account label"
              :error="error"
              autofocus
            />
          </PepInputGroup>
        </div>

        <div class="pt-6">
          <PepButton id="save-account-name-button" type="submit" class="w-full">
            Save Changes
          </PepButton>
        </div>
      </PepForm>
    </div>
  </PepMainLayout>
</template>
