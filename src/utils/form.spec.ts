import { describe, it, expect } from 'vitest';
import { useForm } from './form';
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
    
    // Change value
    form.email = 'new@test.com';
    
    // Wait for Vue watcher
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
