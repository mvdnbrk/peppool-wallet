<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const showHeader = computed(() => {
  return !['/', '/create', '/import', '/reset-wallet'].includes(route.path);
});
</script>

<template>
  <div class="flex flex-col h-full bg-slate-900">
    <header v-if="showHeader" class="relative">
      <div class="w-full h-4 overflow-hidden -mt-px text-pep-green">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" class="w-full h-full">
          <path fill="currentColor" d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,117.3C672,117,768,171,864,202.7C960,235,1056,245,1152,234.7C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      
      <div class="px-4 relative z-10 py-1 border-b border-slate-800">
        <div class="flex justify-between items-center">
          <div @click="router.push('/dashboard')" class="flex items-center cursor-pointer group">
            <img src="./assets/logo.svg" class="w-8 h-8 mr-2 group-hover:scale-105 transition-transform" alt="Logo" />
            <PepWordmark size="sm" />
          </div>

          <button 
            @click="router.push('/settings')"
            class="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <PepIcon name="settings" />
          </button>
        </div>
      </div>
    </header>
    
    <main class="flex-1 overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
