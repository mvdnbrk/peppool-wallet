<script setup lang="ts">
import { computed } from 'vue';
import { MIN_PASSWORD_LENGTH } from '../../utils/constants';
import { getPasswordStrength, getStrengthLabel, getStrengthColor, getStrengthBgColor, getStrengthWidth } from '../../utils/password';
import PepInput from './PepInput.vue';

const props = defineProps<{
  password?: string;
  confirmPassword?: string;
  errors?: Record<string, string>;
  disabled?: boolean;
  passwordLabel?: string;
  confirmLabel?: string;
}>();

const emit = defineEmits<{
  'update:password': [value: string];
  'update:confirmPassword': [value: string];
  'blur-password': [];
  'blur-confirm': [];
}>();

const passwordValue = computed({
  get: () => props.password || '',
  set: (val) => emit('update:password', val)
});

const confirmPasswordValue = computed({
  get: () => props.confirmPassword || '',
  set: (val) => emit('update:confirmPassword', val)
});

const strength = computed(() => {
  if (!passwordValue.value) return null;
  return getPasswordStrength(passwordValue.value);
});
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-4">
      <PepInput
        v-model="passwordValue"
        id="new-password"
        type="password"
        :label="passwordLabel || 'New password'"
        :placeholder="`Min. ${MIN_PASSWORD_LENGTH} characters`"
        :error="errors?.password"
        :disabled="disabled"
        @blur="emit('blur-password')"
      />

      <PepInput
        v-model="confirmPasswordValue"
        id="confirm-password"
        type="password"
        :label="confirmLabel || 'Confirm password'"
        placeholder="Repeat password"
        :error="errors?.confirmPassword"
        :disabled="disabled"
        @blur="emit('blur-confirm')"
      />
    </div>

    <!-- Strength Meter -->
    <div class="mt-2 space-y-2 px-1">
      <div v-if="passwordValue.length >= MIN_PASSWORD_LENGTH" class="flex justify-between items-end">
        <span class="text-sm font-medium text-slate-400">Your password strength</span>
        <span class="text-xs font-semibold transition-colors duration-300" :class="getStrengthColor(strength?.score)">
          {{ getStrengthLabel(strength?.score) }}
        </span>
      </div>
      <div v-else class="text-sm font-medium">&nbsp;</div>
      <div class="overflow-hidden rounded-full bg-white/10">
        <div class="h-2 rounded-full transition-all duration-500 ease-out" 
          :class="passwordValue.length >= MIN_PASSWORD_LENGTH ? getStrengthBgColor(strength?.score) : 'bg-white/20'"
          :style="{ width: getStrengthWidth(strength?.score) }"
        ></div>
      </div>
    </div>
  </div>
</template>
