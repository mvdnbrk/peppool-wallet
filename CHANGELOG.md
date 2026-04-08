# Changelog

All notable changes to `peppool-wallet` are documented in this file.

## [Unreleased]

### Added
- Make wallet inscription aware by excluding inscription UTXOs from coin selection ([#10](https://github.com/mvdnbrk/peppool-wallet/pull/10))
- Multi-account UI and per-account dApp permissions ([#2](https://github.com/mvdnbrk/peppool-wallet/pull/2))
- dApp connector with provider injection, approval popups, and permission management ([#1](https://github.com/mvdnbrk/peppool-wallet/pull/1))
- Nonce-signed API authentication for higher rate limits ([#9](https://github.com/mvdnbrk/peppool-wallet/pull/9))

### Changed
- Unified layout into `PepMainLayout` with semantic HTML ([#6](https://github.com/mvdnbrk/peppool-wallet/pull/6))

### Fixed
- Outgoing transaction amount now shows total debited from wallet instead of recipient amount ([#7](https://github.com/mvdnbrk/peppool-wallet/pull/7))
