import { describe, it, expect } from 'vitest';
import { useForm, validatePasswordMatch, usePasswordBlur } from './form';
import { nextTick } from 'vue';

describe('useForm Utility', () => {
  it('should initialize with provided data', () => {
    const form = useForm({ email: 'test@example.com', count: 1 });
    expect(form.email).toBe('test@example.com');
    expect(form.count).toBe(1);
    expect(form.isProcessing).toBe(false);
    expect(form.errors).toEqual({});
  });

  it('should set and clear specific errors', () => {
    const form = useForm({ name: '' });
    form.setError('name', 'Name is required');
    expect(form.hasError('name')).toBe(true);
    expect(form.errors.name).toBe('Name is required');

    form.clearError('name');
    expect(form.hasError('name')).toBe(false);
    expect(form.errors.name).toBe('');
  });

  it('should return true for hasError() if any field has an error', () => {
    const form = useForm({ a: '', b: '' });
    expect(form.hasError()).toBe(false);

    form.setError('a', 'error');
    expect(form.hasError()).toBe(true);

    form.clearError('a');
    expect(form.hasError()).toBe(false);
  });

  it('should clear all errors when clearError is called without args', () => {
    const form = useForm({ a: '', b: '' });
    form.setError('a', 'err a');
    form.setError('b', 'err b');

    form.clearError();
    expect(form.hasError()).toBe(false);
    expect(form.errors).toEqual({});
  });

  it('should automatically clear error when field value changes', async () => {
    const form = useForm({ email: '' });
    form.setError('email', 'Invalid email');
    form.setError('general', 'Something went wrong');

    expect(form.hasError('email')).toBe(true);

    form.email = 'new@test.com';
    await nextTick();

    expect(form.errors.email).toBe('');
    expect(form.errors.general).toBe('');
    expect(form.hasError()).toBe(false);
  });

  it('should reset to initial data', () => {
    const form = useForm({ name: 'initial' });
    form.name = 'changed';
    form.isProcessing = true;
    form.setError('name', 'error');

    form.reset();

    expect(form.name).toBe('initial');
    expect(form.isProcessing).toBe(false);
    expect(form.hasError()).toBe(false);
  });
});

describe('Password Validation Logic', () => {
  describe('validatePasswordMatch', () => {
    it('returns error for short password', () => {
      const errors = validatePasswordMatch('123', '123');
      expect(errors.password).toContain('at least 8 characters');
    });

    it('returns error for weak password even if long enough', () => {
      const errors = validatePasswordMatch('12345678', '12345678');
      expect(errors.password).toBe('Common character sequences are easy to guess.');
    });

    it('returns error for mismatching confirmation', () => {
      const errors = validatePasswordMatch('StrongPassword123!', 'Mismatch');
      expect(errors.confirmPassword).toBe('Passwords do not match');
    });

    it('returns no errors for valid matching passwords', () => {
      const errors = validatePasswordMatch(
        'Correct-Horse-Battery-Staple-2026!',
        'Correct-Horse-Battery-Staple-2026!'
      );
      expect(errors).toEqual({});
    });
  });

  describe('usePasswordBlur', () => {
    it('clears "do not match" error immediately when fields are updated to align (User Scenario)', async () => {
      const form = useForm({ password: 'StrongPassword123!', confirmPassword: '' });
      const { onBlurConfirmPassword } = usePasswordBlur(form);

      // 1. User types in confirmation (mismatch)
      form.confirmPassword = 'WrongPassword';

      // 2. User blurs confirmation -> error appears
      onBlurConfirmPassword();
      expect(form.errors.confirmPassword).toBe('Passwords do not match');

      // 3. User adjusts password to match
      form.password = 'WrongPassword';
      await nextTick();

      // 4. Error should disappear immediately without needing another blur
      expect(form.errors.confirmPassword).toBe('');
    });

    it('sets strength error on blur', () => {
      const form = useForm({ password: '123', confirmPassword: '' });
      const { onBlurPassword } = usePasswordBlur(form);

      onBlurPassword();
      expect(form.errors.password).toContain('at least 8 characters');
    });
  });
});
