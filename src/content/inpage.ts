/**
 * Peppool Wallet - Inpage Script
 *
 * This script is injected into every webpage.
 * It defines window.wbip_providers and handles the relay to the content script.
 */

interface BTCProvider {
  id: string;
  name: string;
  icon: string;
  methods: string[];
  request: (method: string, params?: any) => Promise<any>;
}

// Peppool Icon (48x48)
const PEPPOOL_ICON =
  'data:image/png;base64,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达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';

/**
 * The Peppool Provider object
 */
const PeppoolProvider: BTCProvider = {
  id: 'peppool',
  name: 'Peppool',
  icon: PEPPOOL_ICON,
  methods: [
    'wallet_connect',
    'wallet_disconnect',
    'getAccounts',
    'signMessage',
    'sendTransfer',
    'signPsbt'
  ],

  request: async (method: string, params?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Create a unique ID for this request
      const requestId = Math.random().toString(36).substring(2, 9);

      // Listen for the response from the content script
      const handler = (event: MessageEvent) => {
        if (event.source !== window || event.data?.target !== 'peppool-inpage') return;
        if (event.data?.requestId === requestId) {
          window.removeEventListener('message', handler);
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      window.addEventListener('message', handler);

      // Forward the request to the content script
      window.postMessage(
        {
          target: 'peppool-content',
          requestId,
          method,
          params
        },
        window.location.origin
      );
    });
  }
};

/**
 * Inject the provider into the window
 */
function injectProvider() {
  try {
    const wbip_providers = (window as any).wbip_providers || [];

    // Avoid duplicate injection
    if (wbip_providers.some((p: any) => p.id === 'peppool')) return;

    wbip_providers.push(PeppoolProvider);
    (window as any).wbip_providers = wbip_providers;

    // Trigger discovery event for dApps listening
    window.dispatchEvent(new CustomEvent('wbip_providers_ready'));

    // Compatibility: Also expose as window.PepecoinProvider
    (window as any).PepecoinProvider = PeppoolProvider;

    console.log('Peppool Wallet: Provider injected successfully (WBIP004)');
  } catch (err) {
    console.error('Peppool Wallet: Injection failed', err);
  }
}

injectProvider();
