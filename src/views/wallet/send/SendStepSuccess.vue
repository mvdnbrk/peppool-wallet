<script setup lang="ts">
defineProps<{
  txid: string;
}>();

defineEmits(['close', 'open-explorer']);
</script>

<template>
  <div class="flex flex-1 flex-col">
    <PepSuccessState title="Transaction sent!" description="Your PEP is on its way.">
      <PepCopyableId :id="txid" label="Transaction ID" />
    </PepSuccessState>
  </div>
</template>
