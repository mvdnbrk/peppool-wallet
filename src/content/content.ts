/**
 * Peppool Wallet - Content Script
 *
 * Acts as a bridge between the Inpage script and the Background worker.
 */

// 1. Inject the Inpage script
function injectInpageScript() {
  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('src/content/inpage.ts');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  } catch (err) {
    console.error('Peppool Wallet: Failed to inject inpage script', err);
  }
}

// 2. Listen for messages from the Inpage script
window.addEventListener('message', (event) => {
  // Only accept messages from the same window and targeted at us
  if (event.source !== window || event.data?.target !== 'peppool-content') return;

  const { method, params, requestId } = event.data;

  // Forward to background script
  chrome.runtime.sendMessage(
    {
      target: 'peppool-background',
      requestId,
      method,
      params,
      origin: window.location.origin
    },
    (response) => {
      // Send the response back to the inpage script
      window.postMessage(
        {
          target: 'peppool-inpage',
          requestId,
          result: response?.result,
          error: response?.error
        },
        window.location.origin
      );
    }
  );
});

injectInpageScript();
