import { ref, computed } from 'vue';
import { useApp } from '@/composables/useApp';
import {
  fetchUtxos,
  fetchTxHex,
  validateAddress,
  fetchRecommendedFees,
  broadcastTx,
  filterSpendableUtxos
} from '@/utils/api';
import { useInscriptionStore } from '@/stores/inscriptions';
import {
  createSignedInscriptionTx,
  isValidAddress,
  deriveSigner,
  parseDerivationPath,
  estimateTxSize,
  type UTXO
} from '@/utils/crypto';
import { decrypt as decryptMnemonic } from '@/utils/encryption';
import type { RecommendedFees } from '@/models/Fees';
import type { Inscription } from '@/models/Inscription';
import { RECOMMENDED_FEE_RATE, SOFT_DUST_FEE_RIBBITS } from '@/utils/constants';

interface FeeSelection {
  feeUtxos: UTXO[];
  feeRibbits: number;
}

/**
 * Parses an ord satpoint ("txid:vout:offset") into the txid:vout that holds it.
 */
export function parseSatpoint(satpoint: string): { txid: string; vout: number } {
  const parts = satpoint.split(':');
  if (parts.length < 2 || !parts[0] || parts[1] === undefined) {
    throw new Error(`Invalid satpoint: ${satpoint}`);
  }
  return { txid: parts[0], vout: parseInt(parts[1], 10) };
}

/**
 * Greedy fee selection: walk spendable UTXOs in order, accumulating until the
 * fee for (1 inscription input + N fee inputs + 2 outputs) is covered. The
 * inscription postage output is always sub-dust, so the soft-dust surcharge
 * is added on top of the size-based fee — without it, miners ignore the tx
 * (observed empirically: confirmed inscription transfers all paid this).
 */
export function selectFeeUtxos(spendable: UTXO[], feeRate: number): FeeSelection {
  const feeUtxos: UTXO[] = [];
  let total = 0;

  for (const utxo of spendable) {
    feeUtxos.push(utxo);
    total += utxo.value;
    const size = estimateTxSize(1 + feeUtxos.length, 2);
    const fee = Math.ceil(size * feeRate) + SOFT_DUST_FEE_RIBBITS;
    if (total >= fee) {
      return { feeUtxos, feeRibbits: fee };
    }
  }

  throw new Error('Insufficient balance to cover network fee');
}

export function useSendInscription() {
  const { wallet: walletStore, account } = useApp();
  const inscriptionStore = useInscriptionStore();

  const fees = ref<RecommendedFees | null>(null);
  const isLoadingFees = ref(true);

  const feeRate = computed(() => {
    if (!fees.value) return RECOMMENDED_FEE_RATE;
    return Math.max(RECOMMENDED_FEE_RATE, fees.value.fastestFee);
  });

  /**
   * Estimated fee for display on the review screen. Assumes 2 inputs (1
   * inscription + 1 funding) and 2 outputs (recipient + change), plus the
   * soft-dust surcharge for the sub-dust postage output. The actual fee at
   * send time may differ by one input's worth if more funding UTXOs are
   * needed, but this matches typical transfers.
   */
  const estimatedFeeRibbits = computed(() => {
    const size = estimateTxSize(2, 2);
    return Math.ceil(size * feeRate.value) + SOFT_DUST_FEE_RIBBITS;
  });

  const isInsufficientFunds = computed(() => {
    if (isLoadingFees.value) return false;
    return account.spendableBalanceRibbits < estimatedFeeRibbits.value;
  });

  async function loadFees() {
    isLoadingFees.value = true;
    try {
      fees.value = await fetchRecommendedFees();
    } catch (e) {
      console.error('Failed to load fees', e);
      throw e;
    } finally {
      isLoadingFees.value = false;
    }
  }

  async function validateRecipient(recipient: string) {
    if (!recipient) {
      throw new Error('Please enter a recipient address');
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
    return true;
  }

  let isSending = false;

  async function send(
    inscription: Inscription,
    recipient: string,
    password: string
  ): Promise<string> {
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

      const address = walletStore.address!;
      const [allUtxos, inscriptionSet] = await Promise.all([
        fetchUtxos(address),
        inscriptionStore.getOutputsSet(address)
      ]);

      const { txid: satTxid, vout: satVout } = parseSatpoint(inscription.satpoint);
      const inscriptionUtxo = allUtxos.find((u) => u.txid === satTxid && u.vout === satVout);
      if (!inscriptionUtxo) {
        throw new Error('Inscription UTXO not found — it may have already been moved');
      }

      const spendable = filterSpendableUtxos(allUtxos, inscriptionSet);
      const { feeUtxos, feeRibbits } = selectFeeUtxos(spendable, feeRate.value);

      const inputs: UTXO[] = [inscriptionUtxo, ...feeUtxos];
      const inputsWithHex: UTXO[] = [];
      for (const utxo of inputs) {
        const rawHex = await fetchTxHex(utxo.txid);
        inputsWithHex.push({ ...utxo, rawHex });
      }

      const activePath = walletStore.activeAccount?.path;
      const { accountIndex, addressIndex } = activePath
        ? parseDerivationPath(activePath)
        : { accountIndex: 0, addressIndex: 0 };
      const signer = deriveSigner(mnemonic, accountIndex, addressIndex);

      const signedInscriptionUtxo = inputsWithHex[0]!;
      const signedFeeUtxos = inputsWithHex.slice(1);
      const signedHex = await createSignedInscriptionTx(
        signer,
        recipient,
        signedInscriptionUtxo,
        signedFeeUtxos,
        feeRibbits
      );

      const txid = await broadcastTx(signedHex);
      await walletStore.refreshBalance(true);
      return txid;
    } finally {
      isSending = false;
    }
  }

  return {
    fees,
    isLoadingFees,
    estimatedFeeRibbits,
    isInsufficientFunds,
    loadFees,
    validateRecipient,
    send
  };
}
