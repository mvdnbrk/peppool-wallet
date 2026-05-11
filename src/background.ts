/**
 * Peppool Wallet — MV3 Background Service Worker
 *
 * Handles alarm-based auto-lock so the wallet is actively secured
 * even after the popup is destroyed (user clicks away).
 *
 * Messages from the popup:
 *   { type: 'set-auto-lock',   delayMinutes: number }
 *   { type: 'clear-auto-lock' }
 */

import { loadPermissions, savePermissions, hasPermission, revokeOrigin } from '@/utils/permissions';
import { validateSignPsbtParams } from '@/utils/psbt';
import { CHROME_STORAGE_KEYS } from '@/constants/storage';

const ALARM_NAME_AUTOLOCK = 'peppool-inactivity-lock';

// ── Alarm handler ──────────────────────────────────────────────────────────
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME_AUTOLOCK) return;

  try {
    await chrome.storage.session.remove(['sessionStartTime', 'dataKey']);
  } catch {
    // session storage may not be available in all contexts
  }

  console.log('[Peppool] Auto-lock alarm fired — session cleared.');
});

// ── dApp Request Types ──────────────────────────────────────────────────────
interface DappRequest {
  requestId: string;
  method: string;
  params: any;
  origin: string;
  tabId?: number;
}

// In-memory queue (cleared if service worker unloads, but used for active sessions)
const requestQueue: Map<string, (response: any) => void> = new Map();
const windowToRequest: Map<number, string> = new Map();

// ── Message handler ────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 1. Internal Extension Messages
  if (sender.id === chrome.runtime.id) {
    if (message.type === 'set-auto-lock') {
      chrome.alarms.create(ALARM_NAME_AUTOLOCK, {
        delayInMinutes: message.delayMinutes
      });
      sendResponse({ ok: true });
      return true;
    }

    if (message.type === 'clear-auto-lock') {
      chrome.alarms.clear(ALARM_NAME_AUTOLOCK);
      sendResponse({ ok: true });
      return true;
    }

    // Handle responses from the approval popup
    if (message.target === 'peppool-background-response') {
      handleApprovalResponse(message, sendResponse);
      return true;
    }
  }

  // 2. dApp Requests (via Content Script)
  if (message.target === 'peppool-background') {
    handleDappRequest(message, sender, sendResponse);
    return true; // Keep channel open for async response
  }

  return true;
});

/**
 * Handle responses from the approval popup
 */
function handleApprovalResponse(message: any, sendResponse: (res: any) => void) {
  const { requestId, result, error } = message;
  const resolver = requestQueue.get(requestId);

  if (!resolver) {
    sendResponse({ ok: true });
    return;
  }

  resolver({ result, error });
  requestQueue.delete(requestId);

  // Find and remove window mapping
  for (const [winId, reqId] of windowToRequest.entries()) {
    if (reqId === requestId) {
      windowToRequest.delete(winId);
      break;
    }
  }

  sendResponse({ ok: true });
}

/**
 * Main dApp request entry point
 */
async function handleDappRequest(
  request: DappRequest,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (res: any) => void
) {
  const { method, requestId, origin: _origin } = request;

  // Store the resolver so we can respond later
  requestQueue.set(requestId, sendResponse);

  // Route methods
  // No unlock gate — popup methods rely on the router guard to show
  // login first. All methods except wallet_connect require a prior connection.
  switch (method) {
    case 'wallet_connect': {
      const perms = await loadPermissions();
      const alreadyConnected =
        hasPermission(perms, request.origin, 'connect') &&
        (await isActiveAccountAuthorized(perms, request.origin));
      if (alreadyConnected) {
        handleGetAccounts(request, sendResponse);
      } else {
        openApprovalPopup(request);
      }
      break;
    }

    case 'getAccounts':
    case 'wallet_disconnect':
    case 'signMessage':
    case 'sendTransfer':
    case 'signPsbt': {
      const permsMap = await loadPermissions();
      const isConnected = hasPermission(permsMap, request.origin, 'connect');
      if (!isConnected) {
        sendResponse({ error: 'App not connected. Please call wallet_connect first.' });
        requestQueue.delete(requestId);
        return;
      }

      if (method === 'getAccounts') {
        handleGetAccounts(request, sendResponse);
        break;
      }

      if (method === 'wallet_disconnect') {
        handleDisconnect(request, sendResponse);
        break;
      }

      // Signing operations require the active account to be authorized
      if (!(await isActiveAccountAuthorized(permsMap, request.origin))) {
        sendResponse({ error: 'Active account is not connected to this site.' });
        requestQueue.delete(requestId);
        return;
      }

      // Validate sendTransfer params before opening popup
      if (method === 'sendTransfer') {
        const validationError = validateTransferParams(request.params);
        if (validationError) {
          sendResponse({ error: validationError });
          requestQueue.delete(requestId);
          return;
        }
      }

      if (method === 'signPsbt') {
        const validationError = validateSignPsbtParams(request.params);
        if (validationError) {
          sendResponse({ error: validationError });
          requestQueue.delete(requestId);
          return;
        }
      }

      openApprovalPopup(request);
      break;
    }

    default:
      sendResponse({ error: `Method ${method} not supported.` });
      requestQueue.delete(requestId);
  }
}

/**
 * Returns the active account's address from chrome.storage, or null.
 */
async function getActiveAddress(): Promise<string | null> {
  const activeData = (await chrome.storage.local.get(CHROME_STORAGE_KEYS.ACTIVE_ACCOUNT)) as any;
  const activeAccountIndex = parseInt(activeData[CHROME_STORAGE_KEYS.ACTIVE_ACCOUNT] || '0');

  const accountsData = (await chrome.storage.local.get(CHROME_STORAGE_KEYS.ACCOUNTS)) as any;
  const accountsRaw = accountsData[CHROME_STORAGE_KEYS.ACCOUNTS] as string | undefined;
  const accounts = accountsRaw ? JSON.parse(accountsRaw) : [];
  return accounts[activeAccountIndex]?.address || null;
}

/**
 * Checks if the active account is authorized for the given origin.
 */
async function isActiveAccountAuthorized(
  perms: Awaited<ReturnType<typeof loadPermissions>>,
  origin: string
): Promise<boolean> {
  const address = await getActiveAddress();
  if (!address) return false;
  const sitePermission = perms[origin];
  return !!sitePermission?.accounts.includes(address);
}

/**
 * Handle getAccounts (No popup needed if already connected)
 */
async function handleGetAccounts(request: DappRequest, sendResponse: (res: any) => void) {
  const perms = await loadPermissions();
  const accounts = perms[request.origin]?.accounts ?? [];

  if (accounts.length === 0) {
    sendResponse({ error: 'No accounts connected for this site.' });
    requestQueue.delete(request.requestId);
    return;
  }

  sendResponse({ result: accounts });
  requestQueue.delete(request.requestId);
}

/**
 * Handle disconnect
 */
async function handleDisconnect(request: DappRequest, sendResponse: (res: any) => void) {
  const perms = await loadPermissions();
  await savePermissions(revokeOrigin(perms, request.origin));
  sendResponse({ result: true });
  requestQueue.delete(request.requestId);
}

/**
 * Validate sendTransfer params before opening the approval popup.
 * Returns an error string if invalid, null if valid.
 */
function validateTransferParams(params: any): string | null {
  if (!params) return 'Missing transfer parameters.';

  const recipients = Array.isArray(params.recipients)
    ? params.recipients
    : params.recipient && params.amount != null
      ? [{ address: params.recipient, amount: params.amount }]
      : null;

  if (!recipients || recipients.length === 0) return 'No recipients specified.';

  const PEP_ADDRESS_RE = /^P[1-9A-HJ-NP-Za-km-z]{25,33}$/;

  for (const r of recipients) {
    if (typeof r.address !== 'string' || !PEP_ADDRESS_RE.test(r.address)) {
      return 'Invalid recipient address.';
    }
    if (typeof r.amount !== 'number' || r.amount <= 0 || !Number.isFinite(r.amount)) {
      return 'Invalid amount.';
    }
  }

  return null;
}

/**
 * Open the 375x600 approval popup
 */
async function openApprovalPopup(request: DappRequest) {
  // Store the request so the popup can fetch it
  await chrome.storage.local.set({ [`request_${request.requestId}`]: request });

  // Construct URL with request details
  const url = chrome.runtime.getURL(
    `approval.html?id=${request.requestId}&origin=${encodeURIComponent(request.origin)}&method=${request.method}`
  );

  // Position near top-right, where extensions typically live
  const POPUP_WIDTH = 375;
  const POPUP_HEIGHT = 600;
  const currentWindow = await chrome.windows.getLastFocused();
  const left = (currentWindow.left ?? 0) + (currentWindow.width ?? 1280) - POPUP_WIDTH - 16;
  const top = (currentWindow.top ?? 0) + 16;

  const win = await chrome.windows.create({
    url,
    type: 'popup',
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    left,
    top
  });

  if (win && win.id) {
    windowToRequest.set(win.id, request.requestId);
  }
}

// ── Window closed handler ──────────────────────────────────────────────────
chrome.windows.onRemoved.addListener((windowId) => {
  const requestId = windowToRequest.get(windowId);
  if (requestId) {
    const resolver = requestQueue.get(requestId);
    if (resolver) {
      resolver({ error: 'User closed the approval window' });
      requestQueue.delete(requestId);
    }
    windowToRequest.delete(windowId);

    // Also cleanup storage
    chrome.storage.local.remove(`request_${requestId}`);
  }
});

// ── Startup ────────────────────────────────────────────────────────────────
console.log('[Peppool] Background service worker active.');
export {};
