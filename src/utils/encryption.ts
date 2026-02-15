/**
 * AES-GCM encryption with PBKDF2 key derivation for secure local storage.
 *
 * Format (v2 — current):  "pbkdf2:" + base64(salt[16] + iv[12] + ciphertext)
 * Format (v1 — legacy):   base64(iv[12] + ciphertext)  — SHA-256 only, auto-upgraded on unlock
 */

const PBKDF2_ITERATIONS = 600_000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const FORMAT_PREFIX = 'pbkdf2:';

async function deriveKey(
    password: string,
    salt: ArrayBuffer,
    usage: KeyUsage[]
): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        usage
    );
}

export async function encrypt(text: string, password: string): Promise<string> {
    const data = new TextEncoder().encode(text);
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const key = await deriveKey(password, salt.buffer, ['encrypt']);

    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    // salt[16] + iv[12] + ciphertext
    const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    result.set(salt);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encrypted), salt.length + iv.length);

    return FORMAT_PREFIX + btoa(String.fromCharCode(...result));
}

export async function decrypt(encryptedString: string, password: string): Promise<string> {
    // v1 (legacy) format: raw base64 without prefix
    if (!encryptedString.startsWith(FORMAT_PREFIX)) {
        return decryptLegacy(encryptedString, password);
    }

    const base64 = encryptedString.slice(FORMAT_PREFIX.length);
    const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    const salt = raw.slice(0, SALT_LENGTH);
    const iv = raw.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const data = raw.slice(SALT_LENGTH + IV_LENGTH);

    const key = await deriveKey(password, salt.buffer, ['decrypt']);

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    return new TextDecoder().decode(decrypted);
}

/**
 * Returns true if the vault string uses the legacy (SHA-256 only) format.
 * Used by the wallet store to auto-upgrade on successful unlock.
 */
export function isLegacyVault(vault: string): boolean {
    return !vault.startsWith(FORMAT_PREFIX);
}

// ---------------------------------------------------------------------------
// Legacy decryption — kept for backward compatibility with pre-PBKDF2 vaults.
// These vaults are auto-upgraded to PBKDF2 on the next successful unlock.
// ---------------------------------------------------------------------------
async function decryptLegacy(encryptedBase64: string, password: string): Promise<string> {
    const encryptedData = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv = encryptedData.slice(0, 12);
    const data = encryptedData.slice(12);

    const hash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(password)
    );

    const key = await crypto.subtle.importKey(
        'raw',
        hash,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    );

    return new TextDecoder().decode(decrypted);
}
