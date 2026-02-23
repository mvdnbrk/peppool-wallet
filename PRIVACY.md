# Privacy policy

**Effective Date:** February 20, 2026

Peppool Wallet is committed to protecting your privacy. The Pepecoin wallet for everyone. This policy explains how we handle information within our browser extension.

## Non-custodial nature

Peppool Wallet is a non-custodial application. We do not have access to your funds, your secret phrase (mnemonic), or your private keys. This information is stored exclusively on your local device.

## Information collection

### 1. Financial data
Peppool Wallet retrieves your Pepecoin (PEP) balances and transaction history from the public blockchain. This information is processed and cached exclusively on your local device to provide the wallet's core features. We do not store this data on our servers, nor do we track your financial activity.

### 2. Data we do NOT collect
- **Private keys / secret phrases:** We never see, transmit, or store your keys or phrases on our servers.
- **Personal identity:** We do not require an account, email address, or any personal identification.
- **Tracking:** We do not use cookies, trackers, or any third-party analytics scripts.

### 3. Network communication
To provide wallet functionality, the extension communicates with:
- **Peppool Space API (`https://peppool.space/api`):** To fetch your PEP balance, transaction history, and broadcast transactions.
- **Price APIs:** To fetch current market prices for PEP.

When making these requests, your IP address may be visible to the server infrastructure. We do not link this IP address to your identity.

## Data security

All sensitive data (encrypted mnemonic and vault) is stored locally using your browser's `localStorage` and `chrome.storage` APIs. This data is protected by the password you set, using industry-standard AES-GCM encryption with PBKDF2 key derivation.

## Your responsibilities

You are solely responsible for the safety of your secret phrase and your password. If you lose your secret phrase, we cannot recover your funds.

## Support & contact

If you have any questions about this privacy policy, please contact us:

- Email: [mvdnbrk@protonmail.com](mailto:mvdnbrk@protonmail.com)
- Website: [peppool.space](https://peppool.space)
- GitHub: [mvdnbrk/peppool-wallet](https://github.com/mvdnbrk/peppool-wallet)

---

[Security policy](SECURITY.md)
