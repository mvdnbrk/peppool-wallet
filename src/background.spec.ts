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

function sendDappMessage(method: string, origin: string) {
  const sendResponse = vi.fn();
  const message = {
    target: 'peppool-background',
    requestId: `req-${Date.now()}`,
    method,
    params: {},
    origin
  };
  const sender = { id: 'other' };
  messageListener(message, sender, sendResponse);
  return sendResponse;
}

describe('background dApp permission enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: wallet unlocked
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      if (keys === 'unlocked_until' || (Array.isArray(keys) && keys.includes('unlocked_until'))) {
        return { unlocked_until: Date.now() + 60_000 };
      }
      return {};
    });
  });

  it('should reject signMessage from disconnected site', async () => {
    const sendResponse = sendDappMessage('signMessage', 'https://evil.com');
    await vi.waitFor(() => expect(sendResponse).toHaveBeenCalled());
    expect(sendResponse).toHaveBeenCalledWith({
      error: 'App not connected. Please call wallet_connect first.'
    });
    expect(windowsCreateMock).not.toHaveBeenCalled();
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

  it('should open approval popup for connected site', async () => {
    (chrome.storage.local.get as any).mockImplementation(async (keys: string | string[]) => {
      if (keys === 'unlocked_until' || (Array.isArray(keys) && keys.includes('unlocked_until'))) {
        return { unlocked_until: Date.now() + 60_000 };
      }
      if (keys === 'peppool_permissions') {
        return { peppool_permissions: { 'https://trusted.com': ['connect'] } };
      }
      return {};
    });

    sendDappMessage('sendTransfer', 'https://trusted.com');
    await vi.waitFor(() => expect(windowsCreateMock).toHaveBeenCalled());
  });

  it('should always allow wallet_connect without prior permission', async () => {
    sendDappMessage('wallet_connect', 'https://new-site.com');
    await vi.waitFor(() => expect(windowsCreateMock).toHaveBeenCalled());
  });
});
