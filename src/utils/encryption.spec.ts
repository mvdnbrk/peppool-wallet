import { describe, it, expect } from 'vitest';
import { encrypt, decrypt, deriveKeyBytes, decryptWithKey, importKey } from './encryption';

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

  it('should reject invalid vault format', async () => {
    await expect(decrypt('no-prefix-base64', 'password')).rejects.toThrow('Invalid vault format');
  });

  it('should decrypt with a non-extractable CryptoKey via decryptWithKey', async () => {
    const message = 'mnemonic phrase for key test';
    const password = 'test-password';

    const encrypted = await encrypt(message, password);
    const keyBytes = await deriveKeyBytes(password, encrypted);
    const cryptoKey = await importKey(keyBytes.buffer as ArrayBuffer, ['decrypt']);

    const decrypted = await decryptWithKey(encrypted, cryptoKey);
    expect(decrypted).toBe(message);
  });

  it('decryptWithKey rejects invalid vault format', async () => {
    const fakeKey = await importKey(new Uint8Array(32).buffer, ['decrypt']);
    await expect(decryptWithKey('no-prefix-base64', fakeKey)).rejects.toThrow(
      'Invalid vault format'
    );
  });
});
