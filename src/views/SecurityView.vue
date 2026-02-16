<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="flex flex-col h-full p-6 relative">
    <PepHeader title="Security" />

    <div class="mt-16 flex-1 space-y-2">
      <PepList>
        <PepListItem 
          label="Change password" 
          icon="chevron-right" 
          @click="router.push('/change-password')" 
        />
        <PepListItem 
          label="Show secret phrase" 
          icon="chevron-right" 
          @click="router.push('/show-mnemonic')" 
        />
      </PepList>

      <div class="pt-6">
        <PepButton 
          @click="router.push('/reset-wallet')"
          variant="secondary"
          class="w-full !text-red-400"
        >
          Reset wallet
        </PepButton>
      </div>
    </div>
  </div>
</template>
