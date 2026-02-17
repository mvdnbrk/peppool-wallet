import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { PEPECOIN } from './networks';

const bip32 = BIP32Factory(ecc);

export function generateMnemonic(): string {
    return bip39.generateMnemonic();
}

export function validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
}

/**
 * Returns an array of words from the mnemonic that are not in the BIP39 wordlist.
 * Only checks "completed" words (followed by a space), not the word currently being typed.
 */
export function getInvalidMnemonicWords(mnemonic: string): string[] {
    const wordlist = bip39.wordlists.english;
    if (!wordlist) return [];

    const trimmed = mnemonic.trim().toLowerCase();
    if (!trimmed) return [];

    const words = trimmed.split(/\s+/);
    // Exclude the last word unless the input ends with whitespace (word is "complete")
    const completedWords = mnemonic.endsWith(' ') ? words : words.slice(0, -1);
    return completedWords.filter(word => !wordlist.includes(word));
}

export function deriveAddress(mnemonic: string, index = 0): string {
    const seedBuffer = bip39.mnemonicToSeedSync(mnemonic);
    // BIP32 v5+ expects Uint8Array, not Buffer
    const seed = new Uint8Array(seedBuffer);
    const root = bip32.fromSeed(seed, PEPECOIN);
    const path = `m/44'/0'/0'/0/${index}`;
    const child = root.derivePath(path);

    const { address } = bitcoin.payments.p2pkh({
        pubkey: child.publicKey,
        network: PEPECOIN,
    });

    return address!;
}

export function isValidAddress(address: string): boolean {
    try {
        bitcoin.address.toOutputScript(address, PEPECOIN);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Estimates the virtual size of a P2PKH transaction
 */
export function estimateTxSize(inputCount: number, outputCount: number): number {
    return inputCount * 148 + outputCount * 34 + 10;
}

export interface UTXO {
    txid: string;
    vout: number;
    value: number;
    rawHex?: string;
}

export interface Signer {
    publicKey: Uint8Array;
    sign(hash: Uint8Array): Uint8Array;
}

/**
 * Derive a signing key pair from a mnemonic.
 * The returned signer can sign transactions without exposing the mnemonic.
 */
export function deriveSigner(mnemonic: string, index = 0): Signer {
    const seedBuffer = bip39.mnemonicToSeedSync(mnemonic);
    const seed = new Uint8Array(seedBuffer);
    const root = bip32.fromSeed(seed, PEPECOIN);
    return root.derivePath(`m/44'/0'/0'/0/${index}`);
}

export async function createSignedTx(
    signer: Signer,
    toAddress: string,
    amountRibbits: number,
    utxos: UTXO[],
    feeRibbits: number
): Promise<string> {
    const psbt = new bitcoin.Psbt({ network: PEPECOIN });
    psbt.version = 1; // Force Version 1 for Pepecoin compatibility

    const inputSum = utxos.reduce((sum, u) => sum + u.value, 0);
    const change = inputSum - amountRibbits - feeRibbits;

    if (change < 0) {
        throw new Error('Insufficient funds to cover amount and fee');
    }

    for (const utxo of utxos) {
        if (!utxo.rawHex) throw new Error(`Missing raw hex for UTXO ${utxo.txid}`);

        psbt.addInput({
            hash: utxo.txid,
            index: utxo.vout,
            nonWitnessUtxo: new Uint8Array(Buffer.from(utxo.rawHex, 'hex')),
        });
    }

    // Recipient output
    psbt.addOutput({
        address: toAddress,
        value: BigInt(amountRibbits),
    });

    // Change output
    if (change > 0) {
        const { address: myAddress } = bitcoin.payments.p2pkh({
            pubkey: signer.publicKey,
            network: PEPECOIN,
        });
        psbt.addOutput({
            address: myAddress!,
            value: BigInt(change),
        });
    }

    psbt.signAllInputs(signer);
    psbt.finalizeAllInputs();

    return psbt.extractTransaction().toHex();
}
