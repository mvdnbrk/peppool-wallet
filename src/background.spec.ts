import { describe, it, expect, vi, beforeEach } from 'vitest';

// Capture the onMessage listener when background.ts loads
let messageListener: (...args: any[]) => any;

// Extend chrome mock for background.ts needs
const windowsCreateMock = vi.fn().mockResolvedValue({ id: 1 });
const getLastFocusedMock = vi.fn().mockResolvedValue({ left: 0, top: 0, width: 1280, height: 800 });

(global.chrome as any).runtime.getURL = (path: string) => `chrome-extension://test-id/${path}`;
(global.chrome as any).runtime.onMessage = {
  addListener: vi.fn((fn: any) => {
    messageListener = fn;
  })
};
(global.chrome as any).windows = {
  create: windowsCreateMock,
  getLastFocused: getLastFocusedMock,
  onRemoved: { addListener: vi.fn() }
};

// Import after mocks are in place — triggers listener registration
await import('./background');

function sendDappMessage(method: string, origin: string, params: any = {}) {
  const sendResponse = vi.fn();
  const message = {
    target: 'peppool-background',
    requestId: `req-${Date.now()}`,
    method,
    params,
    origin
  };
  const sender = { id: 'other' };
  messageListener(message, sender, sendResponse);
  return sendResponse;
}

describe('background dApp permission enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (chrome.storage.local.get as any).mockImplementation(async () => ({}));
  });

  it('should reject signMessage from disconnected site', async () => {
    const sendResponse = sendDappMessage('signMessage', 'https://evil.com');
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'App not connected. Please call wallet_connect first.'
    });
    expect(windowsCreateMock).not.toHaveBeenCalled();
  });

  it('should reject getAccounts from disconnected site', async () => {
    const sendResponse = sendDappMessage('getAccounts', 'https://evil.com');
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'App not connected. Please call wallet_connect first.'
    });
  });

  it('should reject wallet_disconnect from disconnected site', async () => {
    const sendResponse = sendDappMessage('wallet_disconnect', 'https://evil.com');
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'App not connected. Please call wallet_connect first.'
    });
  });

  it('should reject sendTransfer from disconnected site', async () => {
    const sendResponse = sendDappMessage('sendTransfer', 'https://evil.com');
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'App not connected. Please call wallet_connect first.'
    });
    expect(windowsCreateMock).not.toHaveBeenCalled();
  });

  it('should reject signPsbt from disconnected site', async () => {
    const sendResponse = sendDappMessage('signPsbt', 'https://evil.com');
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'App not connected. Please call wallet_connect first.'
    });
    expect(windowsCreateMock).not.toHaveBeenCalled();
  });

  it('should open approval popup for connected site with authorized account', async () => {
    const storageData: Record<string, any> = {
      peppool_permissions: {
        'https://trusted.com': { accounts: ['Ptest123'], permissions: ['connect'] }
      },
      peppool_accounts: JSON.stringify([
        { address: 'Ptest123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }
      ]),
      peppool_active_account: '0'
    };
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};
      for (const k of keyList) {
        if (k in storageData) result[k] = storageData[k];
      }
      return result;
    });

    const validParams = { recipient: 'PJGSjPmY3PzGyE54M3VGiRaEQFBhxuokV1', amount: 100000000 };
    sendDappMessage('sendTransfer', 'https://trusted.com', validParams);
    await vi.waitFor(() => expect(windowsCreateMock).toHaveBeenCalled());
  });

  it('should reject signing when active account is not authorized for origin', async () => {
    const storageData: Record<string, any> = {
      peppool_permissions: {
        'https://trusted.com': { accounts: ['Ptest123'], permissions: ['connect'] }
      },
      peppool_accounts: JSON.stringify([
        { address: 'Ptest123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' },
        { address: 'Pother456', path: "m/44'/3434'/1'/0/0", label: 'Account 2' }
      ]),
      peppool_active_account: '1'
    };
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};
      for (const k of keyList) {
        if (k in storageData) result[k] = storageData[k];
      }
      return result;
    });

    const validParams = { recipient: 'PJGSjPmY3PzGyE54M3VGiRaEQFBhxuokV1', amount: 100000000 };
    const sendResponse = sendDappMessage('sendTransfer', 'https://trusted.com', validParams);
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Active account is not connected to this site.'
    });
    expect(windowsCreateMock).not.toHaveBeenCalled();
  });

  it('should re-prompt wallet_connect when active account is not authorized', async () => {
    const storageData: Record<string, any> = {
      peppool_permissions: {
        'https://trusted.com': { accounts: ['Ptest123'], permissions: ['connect'] }
      },
      peppool_accounts: JSON.stringify([
        { address: 'Ptest123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' },
        { address: 'Pother456', path: "m/44'/3434'/1'/0/0", label: 'Account 2' }
      ]),
      peppool_active_account: '1'
    };
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};
      for (const k of keyList) {
        if (k in storageData) result[k] = storageData[k];
      }
      return result;
    });

    sendDappMessage('wallet_connect', 'https://trusted.com');
    await vi.waitFor(() => expect(windowsCreateMock).toHaveBeenCalled());
  });

  it('should open approval popup for wallet_connect from new site', async () => {
    sendDappMessage('wallet_connect', 'https://new-site.com');
    await vi.waitFor(() => expect(windowsCreateMock).toHaveBeenCalled());
  });

  it('should return accounts directly for wallet_connect from already-connected site', async () => {
    const storageData: Record<string, any> = {
      peppool_permissions: {
        'https://trusted.com': { accounts: ['Ptest123'], permissions: ['connect'] }
      },
      peppool_accounts: JSON.stringify([
        { address: 'Ptest123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }
      ]),
      peppool_active_account: '0'
    };
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};
      for (const k of keyList) {
        if (k in storageData) result[k] = storageData[k];
      }
      return result;
    });

    const sendResponse = sendDappMessage('wallet_connect', 'https://trusted.com');
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({ result: ['Ptest123'] });
    expect(windowsCreateMock).not.toHaveBeenCalled();
  });

  it('should return all approved accounts for getAccounts', async () => {
    const storageData: Record<string, any> = {
      peppool_permissions: {
        'https://trusted.com': { accounts: ['Ptest123', 'Pother456'], permissions: ['connect'] }
      },
      peppool_accounts: JSON.stringify([
        { address: 'Ptest123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' },
        { address: 'Pother456', path: "m/44'/3434'/1'/0/0", label: 'Account 2' }
      ]),
      peppool_active_account: '0'
    };
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};
      for (const k of keyList) {
        if (k in storageData) result[k] = storageData[k];
      }
      return result;
    });

    const sendResponse = sendDappMessage('getAccounts', 'https://trusted.com');
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({ result: ['Ptest123', 'Pother456'] });
  });

  it('should open approval popup even when wallet is locked', async () => {
    const storageData: Record<string, any> = {
      peppool_permissions: {
        'https://trusted.com': { accounts: ['Ptest123'], permissions: ['connect'] }
      },
      peppool_accounts: JSON.stringify([
        { address: 'Ptest123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }
      ]),
      peppool_active_account: '0'
    };
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};
      for (const k of keyList) {
        if (k in storageData) result[k] = storageData[k];
      }
      return result;
    });

    const validParams = { recipient: 'PJGSjPmY3PzGyE54M3VGiRaEQFBhxuokV1', amount: 100000000 };
    sendDappMessage('sendTransfer', 'https://trusted.com', validParams);
    await vi.waitFor(() => expect(windowsCreateMock).toHaveBeenCalled());
  });
});

describe('background sendTransfer param validation', () => {
  const storageData: Record<string, any> = {
    peppool_permissions: {
      'https://dapp.com': { accounts: ['Ptest123'], permissions: ['connect'] }
    },
    peppool_accounts: JSON.stringify([
      { address: 'Ptest123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }
    ]),
    peppool_active_account: '0'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};
      for (const k of keyList) {
        if (k in storageData) result[k] = storageData[k];
      }
      return result;
    });
  });

  it('should reject sendTransfer with invalid address', async () => {
    const sendResponse = sendDappMessage('sendTransfer', 'https://dapp.com', {
      recipient: 'foo',
      amount: 100000000
    });
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Invalid recipient address.'
    });
    expect(windowsCreateMock).not.toHaveBeenCalled();
  });

  it('should reject sendTransfer with non-Pepecoin address', async () => {
    const sendResponse = sendDappMessage('sendTransfer', 'https://dapp.com', {
      recipient: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      amount: 100000000
    });
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Invalid recipient address.'
    });
  });

  it('should reject sendTransfer with zero amount', async () => {
    const sendResponse = sendDappMessage('sendTransfer', 'https://dapp.com', {
      recipient: 'PJGSjPmY3PzGyE54M3VGiRaEQFBhxuokV1',
      amount: 0
    });
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Invalid amount.'
    });
  });

  it('should reject sendTransfer with missing params', async () => {
    const sendResponse = sendDappMessage('sendTransfer', 'https://dapp.com');
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'No recipients specified.'
    });
  });

  it('should allow sendTransfer with valid Pepecoin address', async () => {
    sendDappMessage('sendTransfer', 'https://dapp.com', {
      recipient: 'PJGSjPmY3PzGyE54M3VGiRaEQFBhxuokV1',
      amount: 100000000
    });
    await vi.waitFor(() => expect(windowsCreateMock).toHaveBeenCalled());
  });
});

describe('background signPsbt param validation', () => {
  const storageData: Record<string, any> = {
    peppool_permissions: {
      'https://dapp.com': { accounts: ['Ptest123'], permissions: ['connect'] }
    },
    peppool_accounts: JSON.stringify([
      { address: 'Ptest123', path: "m/44'/3434'/0'/0/0", label: 'Account 1' }
    ]),
    peppool_active_account: '0'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};
      for (const k of keyList) {
        if (k in storageData) result[k] = storageData[k];
      }
      return result;
    });
  });

  it('rejects signPsbt without signInputs', async () => {
    const sendResponse = sendDappMessage('signPsbt', 'https://dapp.com', { psbt: 'base64' });
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({ error: 'signInputs is required.' });
    expect(windowsCreateMock).not.toHaveBeenCalled();
  });

  it('rejects signPsbt with invalid address key', async () => {
    const sendResponse = sendDappMessage('signPsbt', 'https://dapp.com', {
      psbt: 'base64',
      signInputs: { bc1qxyz: [0] }
    });
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'Invalid address in signInputs: bc1qxyz'
    });
  });

  it('rejects signPsbt with negative input index', async () => {
    const sendResponse = sendDappMessage('signPsbt', 'https://dapp.com', {
      psbt: 'base64',
      signInputs: { PJGSjPmY3PzGyE54M3VGiRaEQFBhxuokV1: [-1] }
    });
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: expect.stringContaining('invalid index')
    });
  });

  it('opens approval popup for valid signPsbt request', async () => {
    sendDappMessage('signPsbt', 'https://dapp.com', {
      psbt: 'base64',
      signInputs: { PJGSjPmY3PzGyE54M3VGiRaEQFBhxuokV1: [0] }
    });
    await vi.waitFor(() => expect(windowsCreateMock).toHaveBeenCalled());
  });
});
