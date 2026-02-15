<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../stores/wallet';
import QrcodeVue from 'qrcode.vue';

const walletStore = useWalletStore();
const router = useRouter();
</script>

<template>
  <div class="flex flex-col h-full p-6">
    <PepHeader title="Receive PEP" :onBack="() => router.push('/dashboard')" :absolute="false" />

    <div class="flex-1 flex flex-col items-center justify-center space-y-8">
      <div class="bg-white p-4 rounded-2xl shadow-xl">
        <qrcode-vue 
          :value="walletStore.address || ''" 
          :size="200"
          level="H"
          render-as="svg"
        />
      </div>

      <div class="w-full space-y-2 text-center">
        <p class="text-xs text-slate-500 uppercase tracking-widest font-bold">Your Pepecoin Address</p>
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center space-y-4">
          <el-copyable id="receive-address" class="break-all text-[11px] font-mono text-slate-300 leading-relaxed text-center">
            {{ walletStore.address }}
          </el-copyable>
          
          <PepButton 
            command="--copy" 
            commandfor="receive-address"
            class="w-full"
          >
            <span class="in-data-copied:hidden">Copy address</span>
            <span class="not-in-data-copied:hidden">Address copied!</span>
          </PepButton>
        </div>
      </div>
    </div>

    <p class="text-center text-xs text-slate-500 mt-4">
      Only send Pepecoin (PEP) to this address.
    </p>
  </div>
</template>
