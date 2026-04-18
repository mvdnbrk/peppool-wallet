/**
 * AES-GCM encryption with PBKDF2 key derivation for secure local storage.
 *
 * Format: "pbkdf2:" + base64(salt[16] + iv[12] + ciphertext)
 */

const PBKDF2_ITERATIONS = 600_000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const FORMAT_PREFIX = 'pbkdf2:';

async function deriveKey(
  password: string,
  salt: ArrayBuffer,
  usage: KeyUsage[],
  extractable = false
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
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    extractable,
    usage
  );
}

export function importKey(rawBytes: ArrayBuffer, usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', rawBytes, { name: 'AES-GCM' }, false, usage);
}

/**
 * Extracts the PBKDF2 salt from a vault string.
 */
export function extractSalt(vault: string): Uint8Array {
  if (!vault.startsWith(FORMAT_PREFIX)) {
    throw new Error('Invalid vault format');
  }
  const base64 = vault.slice(FORMAT_PREFIX.length);
  const raw = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return raw.slice(0, SALT_LENGTH);
}

/**
 * Derives the raw AES-256 key bytes from a password and vault.
 * Store these bytes in session storage — never the password or mnemonic.
 */
export async function deriveKeyBytes(password: string, vault: string): Promise<Uint8Array> {
  const salt = extractSalt(vault);
  const key = await deriveKey(password, salt.buffer as ArrayBuffer, ['encrypt', 'decrypt'], true);
  const exported = await crypto.subtle.exportKey('raw', key);
  return new Uint8Array(exported);
}

/**
 * Decrypts a vault string using a non-extractable CryptoKey.
 */
export async function decryptWithKey(vault: string, key: CryptoKey): Promise<string> {
  if (!vault.startsWith(FORMAT_PREFIX)) {
    throw new Error('Invalid vault format');
  }

  const base64 = vault.slice(FORMAT_PREFIX.length);
  const raw = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const iv = raw.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const data = raw.slice(SALT_LENGTH + IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

  return new TextDecoder().decode(decrypted);
}

export async function encrypt(text: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const key = await deriveKey(password, salt.buffer, ['encrypt']);

  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

  // salt[16] + iv[12] + ciphertext
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  result.set(salt);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encrypted), salt.length + iv.length);

  return FORMAT_PREFIX + btoa(String.fromCharCode(...result));
}

export async function decrypt(encryptedString: string, password: string): Promise<string> {
  if (!encryptedString.startsWith(FORMAT_PREFIX)) {
    throw new Error('Invalid vault format');
  }

  const base64 = encryptedString.slice(FORMAT_PREFIX.length);
  const raw = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const salt = raw.slice(0, SALT_LENGTH);
  const iv = raw.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const data = raw.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(password, salt.buffer, ['decrypt']);

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

  return new TextDecoder().decode(decrypted);
}
