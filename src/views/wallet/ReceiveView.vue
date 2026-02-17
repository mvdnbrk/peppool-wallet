<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useWalletStore } from '../../stores/wallet';
import QrcodeVue from 'qrcode.vue';
import logoUrl from '../../assets/p-icon.svg';

const walletStore = useWalletStore();
const router = useRouter();
</script>

<template>
  <div class="flex h-full flex-col p-6">
    <PepHeader title="Receive PEP" :onBack="() => router.push('/dashboard')" :absolute="false" />

    <div class="flex flex-1 flex-col items-center justify-center space-y-8">
      <div class="rounded-2xl bg-white p-4 shadow-xl">
        <qrcode-vue
          :value="walletStore.address || ''"
          :size="200"
          level="H"
          render-as="svg"
          :image-settings="{
            src: logoUrl,
            width: 40,
            height: 40,
            excavate: true
          }"
        />
      </div>

      <div class="w-full space-y-2 text-center">
        <p class="text-xs font-bold tracking-widest text-slate-500 uppercase">
          Your Pepecoin Address
        </p>
        <div
          class="flex flex-col items-center space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-4"
        >
          <el-copyable
            id="receive-address"
            class="text-center font-mono text-[11px] leading-relaxed break-all text-slate-300"
          >
            {{ walletStore.address }}
          </el-copyable>

          <PepButton command="--copy" commandfor="receive-address" class="w-full">
            <span class="in-data-copied:hidden">Copy address</span>
            <span class="not-in-data-copied:hidden">Address copied!</span>
          </PepButton>
        </div>
      </div>
    </div>

    <p class="mt-4 text-center text-xs text-slate-500">Only send Pepecoin (PEP) to this address.</p>
  </div>
</template>
