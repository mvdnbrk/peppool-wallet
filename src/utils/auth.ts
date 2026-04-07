import * as message from 'bitcoinjs-message';
import { PEPECOIN } from './networks';
import { API_TIMEOUT_MS, APP_NAME, APP_VERSION } from './constants';

const API_BASE = import.meta.env.VITE_MAINNET_API || 'https://peppool.space/api';

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'X-App-Name': APP_NAME,
  'X-App-Version': APP_VERSION
};

const STORAGE_KEY_TOKEN = 'peppool_auth_token';
const STORAGE_KEY_EXPIRES = 'peppool_auth_expires';
const STORAGE_KEY_ADDRESS = 'peppool_auth_address';

interface ChallengeResponse {
  nonce: string;
  expires_in: number;
}

interface TokenResponse {
  token: string;
  expires_at: string;
}

async function authRequest<T>(path: string, body: Record<string, string>): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: AUTH_HEADERS,
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(id);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Auth request failed (${response.status}): ${text}`);
    }

    return await response.json();
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function requestChallenge(address: string): Promise<string> {
  const data = await authRequest<ChallengeResponse>('/v1/auth/challenge', { address });
  return data.nonce;
}

function signNonce(nonce: string, privateKey: Uint8Array, compressed: boolean): string {
  const signature = message.sign(
    nonce,
    Buffer.from(privateKey),
    compressed,
    PEPECOIN.messagePrefix
  );
  return signature.toString('base64');
}

async function requestToken(address: string, signature: string): Promise<TokenResponse> {
  return await authRequest<TokenResponse>('/v1/auth/token', { address, signature });
}

function storeToken(token: string, expiresAt: string, address: string) {
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  localStorage.setItem(STORAGE_KEY_EXPIRES, expiresAt);
  localStorage.setItem(STORAGE_KEY_ADDRESS, address);
}

function clearStoredToken() {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_EXPIRES);
  localStorage.removeItem(STORAGE_KEY_ADDRESS);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(STORAGE_KEY_TOKEN);
}

function getStoredExpiry(): number {
  const expiresAt = localStorage.getItem(STORAGE_KEY_EXPIRES);
  if (!expiresAt) return 0;
  return new Date(expiresAt).getTime();
}

function getStoredAddress(): string | null {
  return localStorage.getItem(STORAGE_KEY_ADDRESS);
}

function isTokenExpired(): boolean {
  return Date.now() >= getStoredExpiry();
}

/**
 * Authenticate with the API using the auth keypair.
 * Returns the bearer token on success, null on failure.
 */
export async function authenticate(
  address: string,
  privateKey: Uint8Array,
  compressed: boolean
): Promise<string | null> {
  try {
    const nonce = await requestChallenge(address);
    const signature = signNonce(nonce, privateKey, compressed);
    const { token, expires_at } = await requestToken(address, signature);
    storeToken(token, expires_at, address);
    return token;
  } catch (e) {
    console.error('Auth failed, falling back to anonymous rate:', e);
    return null;
  }
}

let authInFlight: Promise<string | null> | null = null;

/**
 * Ensure a valid token exists. Refreshes if expired or if the
 * auth address changed (wallet re-created with different seed).
 * Guards against concurrent calls to prevent duplicate tokens.
 */
export async function ensureAuth(
  address: string,
  privateKey: Uint8Array,
  compressed: boolean
): Promise<void> {
  const storedAddress = getStoredAddress();
  const token = getStoredToken();

  if (!token || storedAddress !== address || isTokenExpired()) {
    if (!authInFlight) {
      authInFlight = authenticate(address, privateKey, compressed).finally(() => {
        authInFlight = null;
      });
    }
    await authInFlight;
  }
}

/**
 * Clear auth state. Called on wallet reset.
 */
export function clearAuth() {
  clearStoredToken();
}
