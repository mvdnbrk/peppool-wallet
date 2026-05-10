# Peppool Wallet - dApp Integration Guide

Peppool Wallet uses a Pepecoin-native provider discovery standard. Wallets register on `window.pep_providers`, allowing any Pepecoin dApp to discover and interact with them using a standardized JSON-RPC interface.

---

## 1. Provider Discovery

The wallet injects a provider object into `window.pep_providers`. You can find the Peppool provider by searching for the ID `peppool`.

```javascript
// Option A: Check if already injected
const getProvider = () => {
  if (typeof window === 'undefined') return null;

  const providers = window.pep_providers || [];
  return providers.find(p => p.id === 'peppool') || null;
};

const provider = getProvider();

if (!provider) {
  console.log('Peppool Wallet not installed');
}
```

```javascript
// Option B: Announce/request pattern (recommended for SPAs and late-loading dApps)
window.addEventListener('pep_providers:announce', (event) => {
  const provider = event.detail.provider;
  console.log('Wallet detected:', provider.name);
});

// Ask any wallets that loaded before this listener to re-announce themselves.
window.dispatchEvent(new Event('pep_providers:request'));
```

The wallet emits `pep_providers:announce` once on injection (so dApps already listening at `document_start` are notified) and again whenever it observes a `pep_providers:request` event. Modeled after EIP-6963.

### Provider Shape

Every provider in the `pep_providers` array conforms to:

```typescript
interface PepProvider {
  id: string;       // Unique identifier (e.g. 'peppool')
  name: string;     // Display name
  icon: string;     // Data URI for wallet icon
  methods: string[];// Supported RPC methods
  request: (method: string, params?: any) => Promise<any>;
}
```

---

## 2. Connecting the Wallet

Before accessing addresses or signing, you must request a connection. This will trigger a popup asking the user for permission.

```javascript
try {
  const accounts = await provider.request('wallet_connect');
  const address = accounts[0];
  console.log('Connected to:', address);
} catch (err) {
  console.error('User rejected the connection', err);
}
```

---

## 3. Account Management

### `getAccounts`
Returns an array of addresses currently connected to your dApp. This does not trigger a popup if the site is already connected.

```javascript
const accounts = await provider.request('getAccounts');
```

### `wallet_disconnect`
Revokes the connection between your dApp and the wallet.

```javascript
await provider.request('wallet_disconnect');
```

---

## 4. Signing Messages

Request the user to sign a text message using their P2PKH private key. This uses the standard Pepecoin message prefix (`\x19Pepecoin Signed Message:\n`).

```javascript
const result = await provider.request('signMessage', {
  message: 'Hello Pepecoin!'
});

console.log('Signature:', result.signature);
console.log('Signed by:', result.address);
```

---

## 5. Transactions

### `sendTransfer` (Recommended for simple sends)
Request the wallet to build, sign, and broadcast a direct PEP transfer.

```javascript
const { txid } = await provider.request('sendTransfer', {
  recipient: 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU',
  amount: 100000000 // In ribbits (1 PEP = 100,000,000 ribbits)
});

console.log('Transaction Broadcasted:', txid);
```

### `signPsbt` (Advanced)
Sign a Partially Signed Bitcoin Transaction (PSBT — BIP-174; the same format applies to Pepecoin). The dApp provides a base64-encoded PSBT and an explicit `signInputs` map listing which input indices to sign with which address. The wallet only signs the indices listed under the active account address.

```javascript
const { psbt } = await provider.request('signPsbt', {
  psbt: 'base64_encoded_psbt_string...',
  signInputs: {
    'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU': [0, 1]
  }
});

// psbt: base64-encoded PSBT with signatures added
```

**Parameters**

| Property | Type | Description |
|---|---|---|
| `psbt` | `string` | The base64-encoded PSBT to sign. |
| `signInputs` | `Record<string, number[]>` | Map of address → input indices to sign with that address. The wallet signs only the indices listed under the active account. |
| `broadcast` | `boolean` (optional) | If `true`, the wallet finalizes the PSBT after signing and broadcasts the resulting transaction. Defaults to `false`. |

**Sighash types**

By default each input is signed with `SIGHASH_ALL`. To request `SIGHASH_SINGLE | ANYONECANPAY` (used for inscription listings and other half-signed offers), set the `sighashType` field on the relevant PSBT input *before* base64-encoding — the wallet honors what the PSBT itself declares. Supported flags: `SIGHASH_ALL` (`0x01`) and `SIGHASH_SINGLE | ANYONECANPAY` (`0x83`). Other flags are rejected. PSBTs containing any non-default sighash cannot be broadcast by the wallet (`broadcast: true` is rejected); the dApp must finalize and broadcast the completed transaction itself.

**Result (`SignPsbtResult`)**

| Property | Description |
|---|---|
| `psbt` | The base64-encoded signed PSBT. |
| `txid` | The transaction id as a hex-encoded string. Only returned when the transaction was broadcast (`broadcast: true`). |

**Broadcasting after signing**

Set `broadcast: true` to have the wallet finalize and broadcast the PSBT once the user approves. Otherwise the signed PSBT is returned without broadcasting, so the dApp (or another party) can finalize and broadcast it later.

```javascript
const { psbt, txid } = await provider.request('signPsbt', {
  psbt: 'base64_encoded_psbt_string...',
  signInputs: {
    'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU': [0]
  },
  broadcast: true
});

console.log('Transaction Broadcasted:', txid);
```

---

## 6. Network Parameters

If your dApp needs to build transactions manually (e.g., for PSBTs), use these parameters:

| Parameter | Value |
|---|---|
| **Address Prefix** | `P` (0x38) |
| **Script Hash** | 0x16 |
| **WIF Prefix** | 0x9e |
| **Coin Type** | 3434 |
| **Transaction Version** | 1 (Required) |
| **Min Fee Rate** | 1,000 ribbits/byte |

---

## Support & Issues

For any issues, bugs, or feature requests, please open a [GitHub Issue](../../issues).

## Security

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md).
