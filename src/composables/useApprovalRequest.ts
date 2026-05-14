import { ref, onMounted } from 'vue';
import { useWalletStore } from '@/stores/wallet';

interface ApprovalRequest<TParams = unknown> {
  requestId: string;
  method: string;
  params: TParams;
  origin: string;
}

interface UseApprovalRequestOptions<TParams> {
  // Return a non-empty string to render the invalid-request screen instead
  // of the approval form.
  validate?: (request: ApprovalRequest<TParams>) => string | null;
}

export function useApprovalRequest<TParams = unknown>(
  opts: UseApprovalRequestOptions<TParams> = {}
) {
  const walletStore = useWalletStore();

  const requestId = ref('');
  const origin = ref('');
  const method = ref('');
  const requestData = ref<ApprovalRequest<TParams> | null>(null);
  const error = ref('');
  const invalidRequest = ref('');
  const isProcessing = ref(false);

  onMounted(async () => {
    const params = new URLSearchParams(window.location.search);
    requestId.value = params.get('id') || '';
    origin.value = params.get('origin') || '';
    method.value = params.get('method') || '';

    const key = `request_${requestId.value}`;
    const stored = await chrome.storage.local.get(key);
    requestData.value = (stored[key] as ApprovalRequest<TParams>) ?? null;

    if (requestData.value && opts.validate) {
      const message = opts.validate(requestData.value as ApprovalRequest<TParams>);
      if (message) {
        invalidRequest.value = message;
        return;
      }
    }

    await walletStore.checkSession();
  });

  // The router guard already unlocks the wallet before any /approve/* route mounts.
  async function runWithMnemonic(action: (mnemonic: string) => Promise<void>) {
    if (!requestId.value || !requestData.value) return;
    error.value = '';
    isProcessing.value = true;

    try {
      await walletStore.withMnemonic(action);
    } catch (err) {
      console.error('Approval action failed', err);
      error.value = err instanceof Error ? err.message : 'Action failed';
      isProcessing.value = false;
    }
  }

  async function approve(result: unknown) {
    chrome.runtime.sendMessage({
      target: 'peppool-background-response',
      requestId: requestId.value,
      result
    });
    await chrome.storage.local.remove(`request_${requestId.value}`);
    window.close();
  }

  async function reject(errorMessage: string) {
    if (!requestId.value) return;

    chrome.runtime.sendMessage({
      target: 'peppool-background-response',
      requestId: requestId.value,
      error: errorMessage
    });
    await chrome.storage.local.remove(`request_${requestId.value}`);
    window.close();
  }

  return {
    requestId,
    origin,
    method,
    requestData,
    error,
    invalidRequest,
    isProcessing,
    runWithMnemonic,
    approve,
    reject
  };
}
