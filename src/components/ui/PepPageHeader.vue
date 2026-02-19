<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  title: string;
  backTo?: string;
  onBack?: () => void;
  absolute?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  absolute: true
});

const router = useRouter();

function handleBack() {
  if (props.onBack) return props.onBack();
  if (props.backTo) return router.push(props.backTo);
  router.back();
}
</script>

<template>
  <div class="z-20 flex items-center" :class="absolute ? 'absolute top-6 left-6' : 'mb-8'">
    <button
      @click="handleBack"
      class="mr-4 cursor-pointer text-slate-400 hover:text-white"
      tabindex="-1"
    >
      <PepIcon name="back" />
    </button>
    <h2 class="text-offwhite text-xl font-bold">{{ title }}</h2>
  </div>
</template>
