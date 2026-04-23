# Changelog

All notable changes to `peppool-wallet` are documented in this file.

## [Unreleased](https://github.com/mvdnbrk/peppool-wallet/compare/v0.2.1...main)

### Added
- Inscription data sync with background refresh and cached UTXO exclusion ([#12](https://github.com/mvdnbrk/peppool-wallet/pull/12))

### Changed
- Move lock timer to session storage with inactivity-based locking ([#18](https://github.com/mvdnbrk/peppool-wallet/pull/18))
- Defer UTXO fetch to send step and show spendable balance on send view ([#19](https://github.com/mvdnbrk/peppool-wallet/pull/19))

## [0.2.1](https://github.com/mvdnbrk/peppool-wallet/releases/tag/v0.2.1) - 2026-04-18

### Changed
- Harden session key storage with non-extractable CryptoKey, scoped mnemonic access, and buffer zeroing ([#13](https://github.com/mvdnbrk/peppool-wallet/pull/13))

### Fixed
- Show net amount for outgoing transactions ([#15](https://github.com/mvdnbrk/peppool-wallet/pull/15))

## [0.2.0](https://github.com/mvdnbrk/peppool-wallet/releases/tag/v0.2.0) - 2026-04-08

### Added
- Make wallet inscription aware by excluding inscription UTXOs from coin selection ([#10](https://github.com/mvdnbrk/peppool-wallet/pull/10))
- Multi-account UI and per-account dApp permissions ([#2](https://github.com/mvdnbrk/peppool-wallet/pull/2))
- dApp connector with provider injection, approval popups, and permission management ([#1](https://github.com/mvdnbrk/peppool-wallet/pull/1))
- Nonce-signed API authentication for higher rate limits ([#9](https://github.com/mvdnbrk/peppool-wallet/pull/9))

### Changed
- Unified layout into `PepMainLayout` with semantic HTML ([#6](https://github.com/mvdnbrk/peppool-wallet/pull/6))

### Fixed
- Outgoing transaction amount now shows total debited from wallet instead of recipient amount ([#7](https://github.com/mvdnbrk/peppool-wallet/pull/7))
