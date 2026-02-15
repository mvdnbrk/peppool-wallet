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
  if (props.onBack) {
    props.onBack();
  } else if (props.backTo) {
    router.push(props.backTo);
  } else {
    router.back();
  }
}
</script>

<template>
  <div 
    class="flex items-center z-20"
    :class="absolute ? 'absolute top-6 left-6' : 'mb-8'"
  >
    <button @click="handleBack" class="text-slate-400 hover:text-white mr-4 cursor-pointer">
      <PepIcon name="back" />
    </button>
    <h2 class="text-xl font-bold text-offwhite">{{ title }}</h2>
  </div>
</template>
