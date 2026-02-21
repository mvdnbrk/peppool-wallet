<script setup lang="ts">
defineProps<{
  txid: string;
}>();

defineEmits(['close', 'open-explorer']);
</script>

<template>
  <div class="flex flex-1 flex-col">
    <PepSuccessState title="Transaction sent!" description="Your PEP is on its way.">
      <PepCopyableId label="Transaction ID" :id="txid" />
    </PepSuccessState>
  </div>
</template>
