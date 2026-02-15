# Privacy Policy

**Effective Date:** February 15, 2026

Peppool Wallet is committed to protecting your privacy. The Pepecoin wallet for everyone. This policy explains how we handle information within our browser extension.

## Non-Custodial Nature

Peppool Wallet is a non-custodial application. We do not have access to your funds, your secret phrase (mnemonic), or your private keys. This information is stored exclusively on your local device.

## Information Collection

### 1. Data we do NOT collect
- **Private Keys / Secret Phrases:** We never see, transmit, or store your keys or phrases on our servers.
- **Personal Identity:** We do not require an account, email address, or any personal identification.
- **Tracking:** We do not use cookies, trackers, or any third-party analytics scripts.

### 2. Network Communication
To provide wallet functionality, the extension communicates with:
- **Peppool Space API (`https://peppool.space/api`):** To fetch your PEP balance, transaction history, and broadcast transactions.
- **Price APIs:** To fetch current market prices for PEP.

When making these requests, your IP address may be visible to the server infrastructure. We do not link this IP address to your identity.

## Data Security

All sensitive data (encrypted mnemonic and vault) is stored locally using your browser's `localStorage` and `chrome.storage` APIs. This data is protected by the password you set, using industry-standard AES-GCM encryption with PBKDF2 key derivation.

## Your Responsibilities

You are solely responsible for the safety of your secret phrase and your password. If you lose your secret phrase, we cannot recover your funds.

## Support & Contact

If you have any questions about this Privacy Policy, please contact us:

- Email: [mvdnbrk@protonmail.com](mailto:mvdnbrk@protonmail.com)
- Website: [peppool.space](https://peppool.space)
- GitHub: [mvdnbrk/peppool-wallet](https://github.com/mvdnbrk/peppool-wallet)

---

[Security Policy](SECURITY.md)

