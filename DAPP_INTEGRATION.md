# Peppool Wallet - dApp Integration Guide

Peppool Wallet follows the **[WBIP004][wbip004]** standard for injected provider discovery. This allows any dApp to interact with the wallet using a standardized JSON-RPC interface.

---

## 1. Provider Discovery

The wallet injects a provider object into `window.wbip_providers`. You can find the Peppool provider by searching for the ID `peppool`.

```javascript
const getProvider = () => {
  if (typeof window === 'undefined') return null;
  
  const providers = window.wbip_providers || [];
  return providers.find(p => p.id === 'peppool') || null;
};

const provider = getProvider();

if (!provider) {
  console.log('Peppool Wallet not installed');
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
Sign a Partially Signed Pepecoin Transaction (PSBT). The dApp provides a base64-encoded PSBT, and the wallet signs any inputs matching the user's public key.

```javascript
const { psbt } = await provider.request('signPsbt', {
  psbt: 'base64_encoded_psbt_string...'
});

// The returned PSBT contains the signatures
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

[wbip004]: https://wbips.netlify.app/wbips/WBIP004
