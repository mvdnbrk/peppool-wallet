# Privacy Policy

**Effective Date:** February 15, 2026

Peppool Wallet ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our browser extension.

## 1. Non-Custodial Nature
Peppool Wallet is a non-custodial application. We do not have access to your funds, your secret phrase (mnemonic), or your private keys. This information is stored exclusively on your local device.

## 2. Information We Do Not Collect
- **Private Keys / Secret Phrases:** We never see, transmit, or store your keys or phrases on our servers.
- **Personal Identity:** We do not require an account, email address, or any personal identification to use the wallet.
- **Tracking / Analytics:** We do not use cookies, trackers, or any third-party analytics scripts.

## 3. Data Storage and Encryption
All sensitive data (encrypted mnemonic and vault) is stored locally using your browser's `localStorage` and `chrome.storage` APIs. This data is protected by the password you set, using industry-standard AES-GCM encryption with PBKDF2 key derivation.

## 4. Network Communication
To provide wallet functionality, the extension communicates with the following APIs:
- **Peppool Space API (`https://peppool.space/api`):** Used to fetch your PEP balance, transaction history, and broadcast transactions to the Pepecoin network.
- **Price APIs:** Used to fetch current market prices for PEP in USD and EUR.

When making these requests, your IP address may be visible to the server infrastructure. We do not link this IP address to your identity.

## 5. Your Responsibilities
You are solely responsible for the safety of your secret phrase and your password. If you lose your secret phrase, we cannot recover your funds.

## 6. Changes to This Policy
We may update this Privacy Policy from time to time. Any changes will be reflected by the "Effective Date" at the top of this page.

## 7. Contact Us
If you have any questions about this Privacy Policy, please contact us at:
- **Email:** [mvdnbrk@protonmail.com](mailto:mvdnbrk@protonmail.com)
- **Website:** [peppool.space](https://peppool.space)
