<script setup lang="ts">
defineProps<{
  txid: string;
}>();
</script>

<template>
  <div class="flex flex-1 flex-col">
    <PepSuccessState title="Inscription sent!" description="Your inscription is on its way.">
      <PepCopyableId :id="txid" label="Transaction ID" />
    </PepSuccessState>
  </div>
</template>
