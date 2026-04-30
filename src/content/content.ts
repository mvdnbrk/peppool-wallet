/**
 * Peppool Wallet - Content Script
 *
 * Acts as a bridge between the Inpage script and the Background worker.
 * The inpage script is loaded directly into the page's main world via the
 * manifest's `world: "MAIN"` declaration, so no script injection is needed here.
 */

// Listen for messages from the Inpage script
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
