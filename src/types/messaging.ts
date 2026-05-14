// Shared types for the chrome.runtime message bus. Receivers narrow on the
// `type` or `target` discriminator and validate per-method `params` at the
// relevant boundary (see utils/psbt.ts, validateTransferParams in background.ts).

export const DAPP_METHODS = [
  'wallet_connect',
  'wallet_disconnect',
  'getAccounts',
  'signMessage',
  'sendTransfer',
  'signPsbt'
] as const;

export type DappMethod = (typeof DAPP_METHODS)[number];

export interface DappRequest {
  target: 'peppool-background';
  requestId: string;
  method: DappMethod | string;
  params: unknown;
  origin: string;
  tabId?: number;
}

export interface DappResponse {
  result?: unknown;
  error?: string;
}

export type InternalMessage =
  | { type: 'set-auto-lock'; delayMinutes: number }
  | { type: 'clear-auto-lock' };

export interface ApprovalResponseMessage {
  target: 'peppool-background-response';
  requestId: string;
  result?: unknown;
  error?: string;
}

export type BackgroundMessage = InternalMessage | DappRequest | ApprovalResponseMessage;
