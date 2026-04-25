import { ref, computed } from 'vue';
import { useApp } from '@/composables/useApp';
import * as price from '@/utils/price';
import {
  fetchUtxos,
  broadcastTx,
  fetchTxHex,
  validateAddress,
  fetchRecommendedFees,
  filterSpendableUtxos
} from '@/utils/api';
import { useInscriptionStore } from '@/stores/inscriptions';
import {
  createSignedTx,
  isValidAddress,
  deriveSigner,
  parseDerivationPath,
  estimateTxSize,
  type UTXO
} from '@/utils/crypto';
import { decrypt as decryptMnemonic } from '@/utils/encryption';
import { SendTransaction } from '@/models/SendTransaction';
import { RIBBITS_PER_PEP, MIN_SEND_PEP, RECOMMENDED_FEE_RATE } from '@/utils/constants';

export function useSendTransaction() {
  const { wallet: walletStore } = useApp();
  const inscriptionStore = useInscriptionStore();
  const tx = ref(new SendTransaction(walletStore.address!));
  const txid = ref('');
  const isLoadingFees = ref(true);

  const spendableBalanceRibbits = computed(() =>
    Math.round(walletStore.spendableBalance * RIBBITS_PER_PEP)
  );

  const currentPrice = computed(() => price.convert(1));

  const isInsufficientFunds = computed(() => {
    if (isLoadingFees.value || tx.value.amountRibbits <= 0) return false;
    const needed = tx.value.amountRibbits + tx.value.estimatedFeeRibbits;
    return spendableBalanceRibbits.value < needed;
  });

  const displayFee = computed(() => {
    const feePep = tx.value.estimatedFeeRibbits / RIBBITS_PER_PEP;
    return `${parseFloat(feePep.toFixed(8))} PEP`;
  });

  const maxRibbits = computed(() => {
    const txSize = estimateTxSize(1, 2);
    const feeRate = tx.value.fees
      ? Math.max(RECOMMENDED_FEE_RATE, tx.value.fees.fastestFee)
      : RECOMMENDED_FEE_RATE;
    const feeRibbits = Math.ceil(txSize * feeRate);
    return Math.max(0, spendableBalanceRibbits.value - feeRibbits);
  });

  async function loadFees() {
    isLoadingFees.value = true;
    try {
      tx.value.fees = await fetchRecommendedFees();
    } catch (e) {
      console.error('Failed to load fees', e);
      throw e;
    } finally {
      isLoadingFees.value = false;
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

    const needed = amountRibbits + tx.value.estimatedFeeRibbits;
    if (spendableBalanceRibbits.value < needed) {
      throw new Error('Insufficient balance');
    }

    return true;
  }

  let isSending = false;

  async function send(password: string, isMax: boolean) {
    if (isSending) throw new Error('Transaction already in progress');
    isSending = true;

    try {
      let mnemonic: string;
      if (walletStore.isMnemonicLoaded) {
        mnemonic = await walletStore.withMnemonic((m) => m);
      } else {
        if (!password) throw new Error('Password required');
        mnemonic = await decryptMnemonic(walletStore.encryptedMnemonic!, password);
      }

      // Fetch fresh UTXOs at send time to ensure accurate coin selection
      const [utxos, inscriptionSet] = await Promise.all([
        fetchUtxos(walletStore.address!),
        inscriptionStore.getOutputsSet(walletStore.address!)
      ]);
      tx.value.utxos = filterSpendableUtxos(utxos, inscriptionSet);

      if (isMax) {
        tx.value.amountRibbits = tx.value.maxRibbits;
      }

      const { selectedUtxos } = tx.value.selectUtxos(isMax);
      const usedUtxosWithHex: UTXO[] = [];

      for (const utxo of selectedUtxos) {
        const rawHex = await fetchTxHex(utxo.txid);
        usedUtxosWithHex.push({ ...utxo, rawHex });
      }

      const activePath = walletStore.activeAccount?.path;
      const { accountIndex, addressIndex } = activePath
        ? parseDerivationPath(activePath)
        : { accountIndex: 0, addressIndex: 0 };
      const signer = deriveSigner(mnemonic, accountIndex, addressIndex);
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
    isLoadingFees,
    currentPrice,
    isInsufficientFunds,
    displayFee,
    maxRibbits,
    loadFees,
    validateStep1,
    send
  };
}
