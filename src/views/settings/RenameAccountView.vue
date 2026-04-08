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

    <PepForm id="rename-account-form" @submit="handleSave">
      <PepInputGroup label="Account Label">
        <PepInput
          id="account-label-input"
          v-model="label"
          placeholder="Enter new account label"
          :error="error"
          autofocus
        />
      </PepInputGroup>
    </PepForm>

    <template #actions>
      <PepButton id="save-account-name-button" block @click="handleSave"> Save Changes </PepButton>
    </template>
  </PepMainLayout>
</template>
