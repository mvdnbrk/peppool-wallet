// MV3 background service worker. Owns the auto-lock alarm (so the wallet
// keeps locking even after the popup is destroyed) and the dApp request queue.

import { loadPermissions, savePermissions, hasPermission, revokeOrigin } from '@/utils/permissions';
import { validatePsbtParams, verifyPsbtOwnership } from '@/utils/psbt';
import { CHROME_STORAGE_KEYS } from '@/constants/storage';
import type {
  ApprovalResponseMessage,
  BackgroundMessage,
  DappRequest,
  DappResponse,
  InternalMessage
} from '@/types/messaging';

type SendResponse = (res: DappResponse | { ok: true }) => void;

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

// Cleared if the service worker unloads, but survives active sessions.
const requestQueue: Map<string, (response: DappResponse) => void> = new Map();
const windowToRequest: Map<number, string> = new Map();

chrome.runtime.onMessage.addListener(
  (message: BackgroundMessage, sender, sendResponse: SendResponse) => {
    if (sender.id === chrome.runtime.id) {
      if ('type' in message && message.type === 'set-auto-lock') {
        chrome.alarms.create(ALARM_NAME_AUTOLOCK, {
          delayInMinutes: (message as Extract<InternalMessage, { type: 'set-auto-lock' }>)
            .delayMinutes
        });
        sendResponse({ ok: true });
        return true;
      }

      if ('type' in message && message.type === 'clear-auto-lock') {
        chrome.alarms.clear(ALARM_NAME_AUTOLOCK);
        sendResponse({ ok: true });
        return true;
      }

      if ('target' in message && message.target === 'peppool-background-response') {
        handleApprovalResponse(message, sendResponse);
        return true;
      }
    }

    if ('target' in message && message.target === 'peppool-background') {
      handleDappRequest(message, sender, sendResponse);
      return true;
    }

    return true;
  }
);

function handleApprovalResponse(message: ApprovalResponseMessage, sendResponse: SendResponse) {
  const { requestId, result, error } = message;
  const resolver = requestQueue.get(requestId);

  if (!resolver) {
    sendResponse({ ok: true });
    return;
  }

  resolver({ result, error });
  requestQueue.delete(requestId);

  for (const [winId, reqId] of windowToRequest.entries()) {
    if (reqId === requestId) {
      windowToRequest.delete(winId);
      break;
    }
  }

  sendResponse({ ok: true });
}

// No unlock gate here — the router guard shows login before any /approve/* route
// mounts. All methods except wallet_connect require a prior connection.
async function handleDappRequest(
  request: DappRequest,
  _sender: chrome.runtime.MessageSender,
  sendResponse: SendResponse
) {
  const { method, requestId, origin: _origin } = request;
  requestQueue.set(requestId, sendResponse);

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

      if (!(await isActiveAccountAuthorized(permsMap, request.origin))) {
        sendResponse({ error: 'Active account is not connected to this site.' });
        requestQueue.delete(requestId);
        return;
      }

      if (method === 'sendTransfer') {
        const validationError = validateTransferParams(request.params);
        if (validationError) {
          sendResponse({ error: validationError });
          requestQueue.delete(requestId);
          return;
        }
      }

      if (method === 'signPsbt') {
        const validationError = validatePsbtParams(request.params);
        if (validationError) {
          sendResponse({ error: validationError });
          requestQueue.delete(requestId);
          return;
        }
        const activeAddress = await getActiveAddress();
        if (!activeAddress) {
          sendResponse({ error: 'No active account.' });
          requestQueue.delete(requestId);
          return;
        }
        const ownershipError = verifyPsbtOwnership(
          request.params as { psbt: string; signInputs: Record<string, number[]> },
          activeAddress
        );
        if (ownershipError) {
          sendResponse({ error: ownershipError });
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

async function getActiveAddress(): Promise<string | null> {
  const activeData = await chrome.storage.local.get(CHROME_STORAGE_KEYS.ACTIVE_ACCOUNT);
  const activeAccountIndex = parseInt(
    (activeData[CHROME_STORAGE_KEYS.ACTIVE_ACCOUNT] as string | undefined) || '0'
  );

  const accountsData = await chrome.storage.local.get(CHROME_STORAGE_KEYS.ACCOUNTS);
  const accountsRaw = accountsData[CHROME_STORAGE_KEYS.ACCOUNTS] as string | undefined;
  const accounts: { address: string }[] = accountsRaw ? JSON.parse(accountsRaw) : [];
  return accounts[activeAccountIndex]?.address || null;
}

async function isActiveAccountAuthorized(
  perms: Awaited<ReturnType<typeof loadPermissions>>,
  origin: string
): Promise<boolean> {
  const address = await getActiveAddress();
  if (!address) return false;
  const sitePermission = perms[origin];
  return !!sitePermission?.accounts.includes(address);
}

async function handleGetAccounts(request: DappRequest, sendResponse: SendResponse) {
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

async function handleDisconnect(request: DappRequest, sendResponse: SendResponse) {
  const perms = await loadPermissions();
  await savePermissions(revokeOrigin(perms, request.origin));
  sendResponse({ result: true });
  requestQueue.delete(request.requestId);
}

function validateTransferParams(params: unknown): string | null {
  if (!params || typeof params !== 'object') return 'Missing transfer parameters.';

  const p = params as Record<string, unknown>;

  const recipients: unknown[] = Array.isArray(p.recipients)
    ? p.recipients
    : typeof p.recipient === 'string' && p.amount != null
      ? [{ address: p.recipient, amount: p.amount }]
      : [];

  if (recipients.length === 0) return 'No recipients specified.';

  const PEP_ADDRESS_RE = /^P[1-9A-HJ-NP-Za-km-z]{25,33}$/;

  for (const entry of recipients) {
    if (!entry || typeof entry !== 'object') return 'Invalid recipient.';
    const r = entry as Record<string, unknown>;
    if (typeof r.address !== 'string' || !PEP_ADDRESS_RE.test(r.address)) {
      return 'Invalid recipient address.';
    }
    if (typeof r.amount !== 'number' || r.amount <= 0 || !Number.isFinite(r.amount)) {
      return 'Invalid amount.';
    }
  }

  return null;
}

async function openApprovalPopup(request: DappRequest) {
  await chrome.storage.local.set({ [`request_${request.requestId}`]: request });

  const url = chrome.runtime.getURL(
    `approval.html?id=${request.requestId}&origin=${encodeURIComponent(request.origin)}&method=${request.method}`
  );

  // Top-right of the focused window, where browser extensions live.
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

chrome.windows.onRemoved.addListener((windowId) => {
  const requestId = windowToRequest.get(windowId);
  if (requestId) {
    const resolver = requestQueue.get(requestId);
    if (resolver) {
      resolver({ error: 'User closed the approval window' });
      requestQueue.delete(requestId);
    }
    windowToRequest.delete(windowId);
    chrome.storage.local.remove(`request_${requestId}`);
  }
});

console.log('[Peppool] Background service worker active.');
export {};
