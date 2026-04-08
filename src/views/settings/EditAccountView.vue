<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApp } from '@/composables/useApp';

const { router, wallet: walletStore } = useApp();
const route = useRoute();
const index = parseInt(route.params.index as string);
const isNew = computed(() => index < 0);

const label = ref('');
const error = ref('');
const isSaving = ref(false);

onMounted(() => {
  if (isNew.value) {
    label.value = `Account ${walletStore.accounts.length + 1}`;
  } else {
    const account = walletStore.accounts[index];
    if (account) {
      label.value = account.label;
    } else {
      router.replace('/settings/accounts');
    }
  }
});

async function handleSave() {
  if (!label.value.trim()) {
    error.value = 'Label cannot be empty';
    return;
  }

  isSaving.value = true;
  try {
    if (isNew.value) {
      await walletStore.addAccount(label.value.trim());
    } else {
      await walletStore.renameAccount(index, label.value.trim());
    }
    router.back();
  } catch (e: any) {
    error.value = e.message || 'Failed to save account';
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <PepMainLayout>
    <template #header>
      <PepPageHeader :title="isNew ? 'New Account' : 'Edit Account'" backTo="/settings/accounts" />
    </template>

    <PepForm id="edit-account-form" @submit="handleSave">
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
      <PepButton id="save-account-name-button" block @click="handleSave" :loading="isSaving">
        {{ isNew ? 'Add Account' : 'Save Changes' }}
      </PepButton>
    </template>
  </PepMainLayout>
</template>
