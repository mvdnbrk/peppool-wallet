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

const ALARM_NAME = 'peppool-auto-lock';

// ── Alarm handler ──────────────────────────────────────────────────────────
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  // Actively purge sensitive data from storage
  await chrome.storage.local.remove('unlocked_until');

  try {
    await chrome.storage.session.remove('mnemonic');
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

interface Permissions {
  [origin: string]: string[];
}

// In-memory queue (cleared if service worker unloads, but used for active sessions)
const requestQueue: Map<string, (response: any) => void> = new Map();
const windowToRequest: Map<number, string> = new Map();

// ── Message handler ────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 1. Internal Extension Messages
  if (sender.id === chrome.runtime.id) {
    if (message.type === 'set-auto-lock') {
      chrome.alarms.create(ALARM_NAME, {
        delayInMinutes: message.delayMinutes
      });
      sendResponse({ ok: true });
      return true;
    }

    if (message.type === 'clear-auto-lock') {
      chrome.alarms.clear(ALARM_NAME);
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

  // Check if wallet is unlocked (required for most methods)
  const isUnlocked = await checkUnlocked();

  if (!isUnlocked && method !== 'wallet_connect') {
    sendResponse({ error: 'Wallet is locked. Please unlock Peppool Wallet first.' });
    requestQueue.delete(requestId);
    return;
  }

  // Route methods
  switch (method) {
    case 'wallet_connect':
    case 'signMessage':
    case 'sendTransfer':
    case 'signPsbt':
      openApprovalPopup(request);
      break;

    case 'getAccounts':
      handleGetAccounts(request, sendResponse);
      break;

    case 'wallet_disconnect':
      handleDisconnect(request, sendResponse);
      break;

    default:
      sendResponse({ error: `Method ${method} not supported.` });
      requestQueue.delete(requestId);
  }
}

/**
 * Check if the wallet is currently unlocked
 */
async function checkUnlocked(): Promise<boolean> {
  const data = await chrome.storage.local.get(['unlocked_until']);
  const unlockedUntil = data.unlocked_until as number | undefined;
  return !!(unlockedUntil && unlockedUntil > Date.now());
}

/**
 * Handle getAccounts (No popup needed if already connected)
 */
async function handleGetAccounts(request: DappRequest, sendResponse: (res: any) => void) {
  const isConnected = await checkPermission(request.origin, 'connect');
  if (!isConnected) {
    sendResponse({ error: 'App not connected. Please call wallet_connect first.' });
    requestQueue.delete(request.requestId);
    return;
  }

  // Fetch active account from storage
  const activeData = (await chrome.storage.local.get('peppool_active_account')) as any;
  const activeAccountIndex = parseInt(activeData.peppool_active_account || '0');

  const accountsData = (await chrome.storage.local.get('peppool_accounts')) as any;
  const accountsRaw = accountsData.peppool_accounts as string | undefined;
  const accounts = accountsRaw ? JSON.parse(accountsRaw) : [];
  const activeAccount = accounts[activeAccountIndex];

  if (activeAccount) {
    sendResponse({ result: [activeAccount.address] });
  } else {
    sendResponse({ error: 'No accounts found.' });
  }
  requestQueue.delete(request.requestId);
}

/**
 * Handle disconnect
 */
async function handleDisconnect(request: DappRequest, sendResponse: (res: any) => void) {
  await revokePermission(request.origin);
  sendResponse({ result: true });
  requestQueue.delete(request.requestId);
}

/**
 * Check if a dApp has a specific permission
 */
async function checkPermission(origin: string, permission: string): Promise<boolean> {
  const data = await chrome.storage.local.get('peppool_permissions');
  const permissions = (data.peppool_permissions || {}) as Permissions;
  return !!permissions[origin]?.includes(permission);
}

/**
 * Revoke all permissions for an origin
 */
async function revokePermission(origin: string) {
  const data = await chrome.storage.local.get('peppool_permissions');
  const permissions = (data.peppool_permissions || {}) as Permissions;
  delete permissions[origin];
  await chrome.storage.local.set({ peppool_permissions: permissions });
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

  const win = await chrome.windows.create({
    url,
    type: 'popup',
    width: 375,
    height: 600
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
