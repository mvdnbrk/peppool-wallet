<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Inscription } from '@/models/Inscription';

const props = defineProps<{
  form: any;
  inscription: Inscription;
  isInsufficientFunds: boolean;
  displayFee: string;
}>();

defineEmits(['address-blur', 'next']);

const recipientInput = ref<any>(null);

onMounted(() => {
  if (!props.form.recipient) {
    setTimeout(() => recipientInput.value?.focus(), 50);
  }
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <PepForm id="send-inscription-form" class="flex flex-1 flex-col" @submit="$emit('next')">
      <div class="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-3">
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-700">
          <PepInscription :id="inscription.id" :content-type="inscription.contentType" />
        </div>
        <div class="flex min-w-0 flex-col">
          <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase"
            >Sending Inscription</span
          >
          <span class="text-offwhite truncate text-sm font-bold">{{ inscription.number }}</span>
        </div>
      </div>

      <PepInput
        id="recipient"
        ref="recipientInput"
        v-model="form.recipient"
        label="Recipient Address"
        placeholder="Enter address"
        :error="form.errors.recipient"
        :disabled="form.isProcessing"
        clearable
        autofocus
        @blur="$emit('address-blur')"
      />

      <PepNetworkFee :fee="displayFee" />

      <div class="mt-2 flex h-6 items-center justify-center">
        <p
          class="text-center text-sm font-medium text-red-400 transition-opacity duration-200"
          :class="form.errors.general ? 'opacity-100' : 'pointer-events-none opacity-0 select-none'"
        >
          {{ form.errors.general }}
        </p>
      </div>
    </PepForm>
  </div>
</template>
