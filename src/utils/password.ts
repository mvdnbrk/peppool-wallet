import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { adjacencyGraphs } from '@zxcvbn-ts/language-common';
import * as zxcvbnEn from '@zxcvbn-ts/language-en';

const options = {
    translations: zxcvbnEn.translations,
    graphs: adjacencyGraphs,
    dictionary: {
        ...zxcvbnEn.dictionary,
    },
};

zxcvbnOptions.setOptions(options);

export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export interface StrengthResult {
    score: PasswordScore;
    feedback: {
        warning?: string;
        suggestions: string[];
    };
}

export function getPasswordStrength(password: string): StrengthResult {
    const result = zxcvbn(password);
    let warning = result.feedback.warning || undefined;

    // Sanitize confusing generic examples from zxcvbn
    if (warning === 'Common character sequences like "abc" are easy to guess.') {
        warning = 'Common character sequences are easy to guess.';
    }

    return {
        score: result.score as PasswordScore,
        feedback: {
            warning,
            suggestions: result.feedback.suggestions,
        }
    };
}

export function getStrengthLabel(score?: PasswordScore): string {
    switch (score) {
        case 0: return 'VERY WEAK';
        case 1: return 'WEAK';
        case 2: return 'FAIR';
        case 3: return 'STRONG';
        case 4: return 'EXCELLENT';
        default: return '';
    }
}

export function getStrengthColor(score?: PasswordScore): string {
    switch (score) {
        case 1: return 'text-red-400';
        case 2: return 'text-yellow-500';
        case 3: return 'text-pep-green-light';
        case 4: return 'text-pep-green-light';
        default: return 'text-red-400';
    }
}

export function getStrengthBgColor(score?: PasswordScore): string {
    if (score === undefined) return 'bg-white/10';
    switch (score) {
        case 0: return 'bg-red-400';
        case 1: return 'bg-red-400';
        case 2: return 'bg-yellow-500';
        case 3: return 'bg-pep-green-light';
        case 4: return 'bg-pep-green-light';
        default: return 'bg-red-400';
    }
}

export function getStrengthWidth(score?: PasswordScore): string {
    if (score === undefined) return '0%';
    if (score === 0) return '10%';
    if (score === 1) return '25%';
    if (score === 2) return '50%';
    if (score === 3) return '75%';
    return '100%';
}
