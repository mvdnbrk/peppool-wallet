# Privacy policy

**Effective Date:** February 20, 2026

Peppool Wallet is committed to protecting your privacy. The Pepecoin wallet for everyone. This policy explains how we handle information within our browser extension.

## Non-custodial nature

Peppool Wallet is a non-custodial application. We do not have access to your funds, your secret phrase (mnemonic), or your private keys. This information is stored exclusively on your local device. We do not collect, store, or transmit any user data to our own servers.

## Data handling

### 1. Financial data
Peppool Wallet accesses your Pepecoin (PEP) balances and transaction history directly from the public blockchain to provide core wallet functionality. This information is processed and cached exclusively on your local device. We do not collect this data, nor do we track or store your financial activity on any remote servers.

### 2. Information we do NOT collect
- **Private keys / secret phrases:** We never see, transmit, or store your keys or phrases. They remain on your device at all times.
- **Personal identity:** We do not require an account, email address, or any personal identification.
- **Usage tracking:** We do not use cookies, trackers, or any third-party analytics scripts. We have no visibility into how you use the wallet.

### 3. Network communication
To provide wallet functionality, the extension communicates directly with:
- **Peppool Space API (`https://peppool.space/api`):** To query public blockchain data (balances, UTXOs) and broadcast your signed transactions.
- **Price APIs:** To fetch current market prices for PEP.

When making these requests, your IP address is visible to the network infrastructure as a standard part of HTTP communication. We do not log or link this IP address to any user identity.

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
