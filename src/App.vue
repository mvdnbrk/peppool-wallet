<script setup lang="ts">
</script>

<template>
  <div class="flex h-full flex-col bg-slate-900">
    <PepGlobalHeader />

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
