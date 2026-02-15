<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue: string | number | null;
  label?: string;
  id: string;
  placeholder?: string;
  error?: string;
  autofocus?: boolean;
  inputClass?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autofocus: false,
  inputClass: '',
  disabled: false,
  placeholder: 'Enter your password'
});
defineEmits(['update:modelValue']);

const showPassword = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

// Expose focus method to parent
defineExpose({
  focus: () => inputRef.value?.focus()
});
</script>

<template>
  <PepInputGroup :label="label" :id="id">
    <div class="grid grid-cols-1">
      <input
        :id="id"
        ref="inputRef"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :autofocus="autofocus"
        :disabled="disabled"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="disabled ? '' : placeholder"
        class="col-start-1 row-start-1 block w-full rounded-md bg-white/5 py-1.5 pl-3 pr-10 text-base text-white outline-1 -outline-offset-1 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm outline-white/10 focus:outline-pep-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        :class="[
          { 'text-red-400 outline-red-500/50 placeholder:text-red-400/70 focus:outline-red-400': error && !disabled },
          inputClass
        ]"
        :aria-invalid="!!error"
        :aria-describedby="`${id}-error`"
      />
      
      <div class="col-start-1 row-start-1 flex items-center justify-end pr-3 pointer-events-none">
        <PepIcon v-if="error && !disabled" name="error" class="text-red-400" size="16" />

        <button 
          v-else
          type="button"
          @click="showPassword = !showPassword"
          :disabled="disabled"
          class="text-gray-500 hover:text-white cursor-pointer transition-colors pointer-events-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PepIcon :name="showPassword ? 'eye-slash' : 'eye'" size="16" />
        </button>
      </div>
    </div>
    <p 
      :id="`${id}-error`" 
      class="mt-2 text-sm font-medium text-red-400 transition-opacity duration-200"
      :class="error ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'"
    >
      {{ error || '&nbsp;' }}
    </p>
  </PepInputGroup>
</template>
