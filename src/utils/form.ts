import { reactive, watch } from 'vue';
import { MIN_PASSWORD_LENGTH } from './constants';

interface FormOptions {
    persistKey?: string;
    /** Field names that must NEVER be persisted to localStorage (e.g. 'password') */
    sensitiveFields?: string[];
}

export function useForm<T extends object>(initialData: T, options: FormOptions = {}) {
    const savedData = options.persistKey ? localStorage.getItem(`peppool_form_${options.persistKey}`) : null;
    const restoredData = savedData ? JSON.parse(savedData) : null;

    const form = reactive({
        ...initialData,
        ...(restoredData || {}),
        errors: {} as Record<string, string>,
        isProcessing: false,

        // Improved hasError
        hasError(field?: string) {
            if (field) return !!this.errors[field];
            // If no field, return true if ANY key has a non-empty string value
            return Object.values(this.errors).some(msg => !!msg);
        },

        clearError(field?: string) {
            if (field) {
                this.errors[field] = '';
            } else {
                this.errors = {};
            }
        },

        setError(field: string, message: string) {
            this.errors[field] = message;
        },

        reset() {
            Object.assign(this, { ...initialData, isProcessing: false });
            this.clearError();
            if (options.persistKey) {
                localStorage.removeItem(`peppool_form_${options.persistKey}`);
            }
        }
    });

    if (options.persistKey) {
        const sensitive = new Set([
            'errors', 'isProcessing',
            ...(options.sensitiveFields || [])
        ]);
        watch(form, (val) => {
            const dataToSave: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(val as any)) {
                if (!sensitive.has(k)) dataToSave[k] = v;
            }
            localStorage.setItem(`peppool_form_${options.persistKey}`, JSON.stringify(dataToSave));
        }, { deep: true });
    }

    for (const key in initialData) {
        watch(() => (form as any)[key], () => {
            form.clearError(key);
            form.clearError('general');
        });
    }

    return form;
}

/**
 * Validates that a password meets the minimum length and matches the confirmation.
 * Returns an object with error messages if validation fails.
 */
export function validatePasswordMatch(password: string, confirmPassword: string) {
    const errors: { password?: string; confirmPassword?: string } = {};

    if (password.length < MIN_PASSWORD_LENGTH) {
        errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
}

/**
 * Provides standardized onBlur handlers for password fields.
 * Can be used with any form object that implements setError.
 */
export function usePasswordBlur(form: { password: string; confirmPassword: string; setError: (f: string, m: string) => void }) {
    return {
        onBlurPassword() {
            if (form.password && form.password.length < MIN_PASSWORD_LENGTH) {
                form.setError('password', `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            }
        },
        onBlurConfirmPassword() {
            if (form.confirmPassword && form.password !== form.confirmPassword) {
                form.setError('confirmPassword', 'Passwords do not match');
            }
        }
    };
}
