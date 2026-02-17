import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './encryption';

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
});
