import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authenticate, ensureAuth, clearAuth, getStoredToken } from './auth';

describe('Auth Utils', () => {
  const mockAddress = 'PauthAddress123';
  const mockPrivateKey = new Uint8Array(32).fill(1);
  const mockCompressed = true;
  const mockNonce = 'peppool_wallet_auth_abc123';
  const mockToken = 'sanctum-bearer-token-xyz';
  const mockExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  let errorSpy: any;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  vi.mock('bitcoinjs-message', () => ({
    sign: vi.fn(() => Buffer.from('mock-signature'))
  }));

  function mockFetchSequence(...responses: Array<{ ok: boolean; status?: number; data?: any }>) {
    const fetchMock = vi.mocked(fetch);
    for (const resp of responses) {
      fetchMock.mockResolvedValueOnce({
        ok: resp.ok,
        status: resp.status ?? (resp.ok ? 200 : 500),
        json: () => Promise.resolve(resp.data),
        text: () => Promise.resolve(JSON.stringify(resp.data ?? ''))
      } as any);
    }
  }

  describe('authenticate', () => {
    it('should complete the challenge-sign-token flow and store the token', async () => {
      mockFetchSequence(
        { ok: true, data: { nonce: mockNonce, expires_in: 90 } },
        { ok: true, data: { token: mockToken, expires_at: mockExpiresAt } }
      );

      const token = await authenticate(mockAddress, mockPrivateKey, mockCompressed);

      expect(token).toBe(mockToken);
      expect(getStoredToken()).toBe(mockToken);
      expect(localStorage.getItem('peppool_auth_address')).toBe(mockAddress);
    });

    it('should return null and log error when challenge request fails', async () => {
      mockFetchSequence({ ok: false, status: 429, data: 'rate limited' });

      const token = await authenticate(mockAddress, mockPrivateKey, mockCompressed);

      expect(token).toBeNull();
      expect(getStoredToken()).toBeNull();
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should return null when token request fails', async () => {
      mockFetchSequence(
        { ok: true, data: { nonce: mockNonce, expires_in: 90 } },
        { ok: false, status: 401, data: 'invalid signature' }
      );

      const token = await authenticate(mockAddress, mockPrivateKey, mockCompressed);

      expect(token).toBeNull();
    });

    it('should send correct headers on auth requests', async () => {
      mockFetchSequence(
        { ok: true, data: { nonce: mockNonce, expires_in: 90 } },
        { ok: true, data: { token: mockToken, expires_at: mockExpiresAt } }
      );

      await authenticate(mockAddress, mockPrivateKey, mockCompressed);

      const challengeCall = vi.mocked(fetch).mock.calls[0]!;
      const headers = (challengeCall[1] as any).headers;
      expect(headers['X-App-Name']).toBe('peppool-wallet');
      expect(headers['X-App-Version']).toBeDefined();
      expect(headers['Content-Type']).toBe('application/json');
    });
  });

  describe('ensureAuth', () => {
    it('should authenticate when no token exists', async () => {
      mockFetchSequence(
        { ok: true, data: { nonce: mockNonce, expires_in: 90 } },
        { ok: true, data: { token: mockToken, expires_at: mockExpiresAt } }
      );

      await ensureAuth(mockAddress, mockPrivateKey, mockCompressed);

      expect(getStoredToken()).toBe(mockToken);
    });

    it('should skip auth when a valid non-expiring token exists for the same address', async () => {
      localStorage.setItem('peppool_auth_token', mockToken);
      localStorage.setItem('peppool_auth_expires', mockExpiresAt);
      localStorage.setItem('peppool_auth_address', mockAddress);

      await ensureAuth(mockAddress, mockPrivateKey, mockCompressed);

      expect(fetch).not.toHaveBeenCalled();
    });

    it('should re-authenticate when token belongs to a different address', async () => {
      localStorage.setItem('peppool_auth_token', 'old-token');
      localStorage.setItem('peppool_auth_expires', mockExpiresAt);
      localStorage.setItem('peppool_auth_address', 'PdifferentAddress');

      mockFetchSequence(
        { ok: true, data: { nonce: mockNonce, expires_in: 90 } },
        { ok: true, data: { token: mockToken, expires_at: mockExpiresAt } }
      );

      await ensureAuth(mockAddress, mockPrivateKey, mockCompressed);

      expect(getStoredToken()).toBe(mockToken);
    });

    it('should re-authenticate when token is expired', async () => {
      localStorage.setItem('peppool_auth_token', 'expired-token');
      localStorage.setItem('peppool_auth_expires', new Date(Date.now() - 1000).toISOString());
      localStorage.setItem('peppool_auth_address', mockAddress);

      mockFetchSequence(
        { ok: true, data: { nonce: mockNonce, expires_in: 90 } },
        { ok: true, data: { token: mockToken, expires_at: mockExpiresAt } }
      );

      await ensureAuth(mockAddress, mockPrivateKey, mockCompressed);

      expect(getStoredToken()).toBe(mockToken);
    });
  });

  describe('clearAuth', () => {
    it('should remove all auth storage keys', () => {
      localStorage.setItem('peppool_auth_token', mockToken);
      localStorage.setItem('peppool_auth_expires', mockExpiresAt);
      localStorage.setItem('peppool_auth_address', mockAddress);

      clearAuth();

      expect(getStoredToken()).toBeNull();
      expect(localStorage.getItem('peppool_auth_expires')).toBeNull();
      expect(localStorage.getItem('peppool_auth_address')).toBeNull();
    });
  });

  describe('getStoredToken', () => {
    it('should return null when no token is stored', () => {
      expect(getStoredToken()).toBeNull();
    });

    it('should return the stored token', () => {
      localStorage.setItem('peppool_auth_token', mockToken);
      expect(getStoredToken()).toBe(mockToken);
    });
  });
});
