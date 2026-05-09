import { ref, computed, onMounted } from 'vue';
import { useWalletStore } from '@/stores/wallet';

interface ApprovalRequest<TParams = any> {
  requestId: string;
  method: string;
  params: TParams;
  origin: string;
}

interface UseApprovalRequestOptions<TParams> {
  /**
   * Optional validator. Return a non-empty string to mark the request as invalid
   * (renders the invalid-request screen instead of the approval form).
   */
  validate?: (request: ApprovalRequest<TParams>) => string | null;
}

export function useApprovalRequest<TParams = any>(opts: UseApprovalRequestOptions<TParams> = {}) {
  const walletStore = useWalletStore();

  const requestId = ref('');
  const origin = ref('');
  const method = ref('');
  const requestData = ref<ApprovalRequest<TParams> | null>(null);
  const password = ref('');
  const error = ref('');
  const invalidRequest = ref('');
  const isProcessing = ref(false);

  const isMnemonicLoaded = computed(() => walletStore.isMnemonicLoaded);

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

  /**
   * Ensures the wallet is unlocked, then runs the action with the decrypted mnemonic.
   * Handles password prompting, error display, and isProcessing state.
   */
  async function runWithMnemonic(action: (mnemonic: string) => Promise<void>) {
    if (!requestId.value || !requestData.value) return;
    error.value = '';

    try {
      if (!walletStore.isMnemonicLoaded) {
        if (!password.value) {
          error.value = 'Please enter your password';
          return;
        }
        isProcessing.value = true;
        const success = await walletStore.unlock(password.value);
        if (!success) {
          error.value = 'Invalid password';
          isProcessing.value = false;
          return;
        }
      }

      isProcessing.value = true;
      await walletStore.withMnemonic(action);
    } catch (err: any) {
      console.error('Approval action failed', err);
      error.value = err.message || 'Action failed';
      isProcessing.value = false;
    }
  }

  /**
   * Sends a successful response to the background, cleans up storage and closes the window.
   */
  async function approve(result: unknown) {
    chrome.runtime.sendMessage({
      target: 'peppool-background-response',
      requestId: requestId.value,
      result
    });
    await chrome.storage.local.remove(`request_${requestId.value}`);
    window.close();
  }

  /**
   * Sends a rejection to the background, cleans up storage and closes the window.
   */
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
    password,
    error,
    invalidRequest,
    isProcessing,
    isMnemonicLoaded,
    runWithMnemonic,
    approve,
    reject
  };
}
