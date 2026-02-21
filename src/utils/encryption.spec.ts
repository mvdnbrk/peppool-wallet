import { describe, it, expect } from 'vitest';
import { encrypt, decrypt, isLegacyVault } from './encryption';

describe('Encryption Utils', () => {
  it('should encrypt and decrypt a message correctly', async () => {
    const message = 'secret mnemonic phrase';
    const password = 'strong-password';

    const encrypted = await encrypt(message, password);
    expect(encrypted).not.toBe(message);

    const decrypted = await decrypt(encrypted, password);
    expect(decrypted).toBe(message);
  });

  it('should fail to decrypt with wrong password', async () => {
    const message = 'secret mnemonic phrase';
    const encrypted = await encrypt(message, 'correct-password');

    await expect(decrypt(encrypted, 'wrong-password')).rejects.toThrow();
  });

  it('should identify legacy vaults', () => {
    expect(isLegacyVault('no-prefix-base64')).toBe(true);
    expect(isLegacyVault('pbkdf2:prefixed-base64')).toBe(false);
  });

  it('should decrypt legacy (v1) format correctly', async () => {
    const text = 'legacy text';
    const password = 'password';

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    const key = await crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt']);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(text)
    );

    const legacyResult = new Uint8Array(iv.length + encrypted.byteLength);
    legacyResult.set(iv);
    legacyResult.set(new Uint8Array(encrypted), iv.length);
    const legacyBase64 = btoa(String.fromCharCode(...legacyResult));

    const decrypted = await decrypt(legacyBase64, password);
    expect(decrypted).toBe(text);
  });
});
