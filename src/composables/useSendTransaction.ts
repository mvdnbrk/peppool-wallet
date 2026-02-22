import { ref, computed } from 'vue';
import { useApp } from '@/composables/useApp';
import {
  fetchUtxos,
  broadcastTx,
  fetchTxHex,
  validateAddress,
  fetchRecommendedFees
} from '@/utils/api';
import { createSignedTx, isValidAddress, deriveSigner, type UTXO } from '@/utils/crypto';
import { decrypt as decryptMnemonic } from '@/utils/encryption';
import { SendTransaction } from '@/models/SendTransaction';
import { RIBBITS_PER_PEP, MIN_SEND_PEP, formatFiat } from '@/utils/constants';

export function useSendTransaction() {
  const { wallet: walletStore } = useApp();

  const tx = ref(new SendTransaction(walletStore.address!));
  const txid = ref('');
  const isLoadingRequirements = ref(true);

  const currentPrice = computed(() => walletStore.prices[walletStore.selectedCurrency]);

  const isInsufficientFunds = computed(() => {
    if (isLoadingRequirements.value || tx.value.amountRibbits <= 0) return false;
    const needed = tx.value.amountRibbits + tx.value.estimatedFeeRibbits;
    return tx.value.balanceRibbits < needed;
  });

  const displayBalance = (isFiatMode: boolean) => {
    const spendable = tx.value.balancePep;
    if (isFiatMode) {
      const fiatValue = spendable * currentPrice.value;
      return `${walletStore.currencySymbol}${formatFiat(fiatValue)} ${walletStore.selectedCurrency}`;
    }
    return `${parseFloat(spendable.toFixed(8))} PEP`;
  };

  const displayFee = computed(() => {
    const feePep = tx.value.estimatedFeeRibbits / RIBBITS_PER_PEP;
    return `${parseFloat(feePep.toFixed(8))} PEP`;
  });

  async function loadRequirements(isMax: boolean = false) {
    isLoadingRequirements.value = true;
    try {
      const [fees, utxos] = await Promise.all([
        fetchRecommendedFees(),
        fetchUtxos(walletStore.address!)
      ]);

      tx.value.fees = fees;
      tx.value.utxos = utxos.filter((u) => u.status.confirmed);

      if (isMax) {
        tx.value.amountRibbits = tx.value.maxRibbits;
      }
    } catch (e) {
      console.error('Failed to load transaction requirements', e);
      throw e;
    } finally {
      isLoadingRequirements.value = false;
    }
  }

  async function validateStep1(recipient: string, amountRibbits: number) {
    if (!recipient || amountRibbits <= 0) {
      throw new Error('Please enter a valid address and amount');
    }

    if (amountRibbits < Math.round(MIN_SEND_PEP * RIBBITS_PER_PEP)) {
      throw new Error(`Minimum amount to send is ${MIN_SEND_PEP} PEP`);
    }

    if (!isValidAddress(recipient)) {
      throw new Error('Invalid address format');
    }

    if (recipient === walletStore.address) {
      throw new Error('Cannot send to your own address');
    }

    const validation = await validateAddress(recipient);
    if (!validation.isvalid) {
      throw new Error('Invalid Pepecoin address');
    }

    if (!tx.value.isValid) {
      throw new Error('Insufficient balance');
    }

    return true;
  }

  let isSending = false;

  async function send(password: string, isMax: boolean) {
    if (isSending) throw new Error('Transaction already in progress');
    isSending = true;

    try {
      let mnemonic = walletStore.plaintextMnemonic;
      if (!mnemonic) {
        if (!password) throw new Error('Password required');
        mnemonic = await decryptMnemonic(walletStore.encryptedMnemonic!, password);
        walletStore.cacheMnemonic(mnemonic);
      }

      const { selectedUtxos } = tx.value.selectUtxos(isMax);
      const usedUtxosWithHex: UTXO[] = [];

      for (const utxo of selectedUtxos) {
        const rawHex = await fetchTxHex(utxo.txid);
        usedUtxosWithHex.push({ ...utxo, rawHex });
      }

      const signer = deriveSigner(mnemonic);
      const signedHex = await createSignedTx(
        signer,
        tx.value.recipient,
        tx.value.amountRibbits,
        usedUtxosWithHex,
        tx.value.estimatedFeeRibbits
      );

      const result = await broadcastTx(signedHex);
      txid.value = result;

      await walletStore.refreshBalance(true);
      return result;
    } finally {
      isSending = false;
    }
  }

  return {
    tx,
    txid,
    isLoadingRequirements,
    currentPrice,
    isInsufficientFunds,
    displayBalance,
    displayFee,
    loadRequirements,
    validateStep1,
    send
  };
}
