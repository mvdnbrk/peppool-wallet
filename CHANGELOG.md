# Changelog

All notable changes to `peppool-wallet` are documented in this file.

## [Unreleased](https://github.com/mvdnbrk/peppool-wallet/compare/v0.2.1...main)

### Added
- Inscription data sync with background refresh and cached UTXO exclusion ([#12](https://github.com/mvdnbrk/peppool-wallet/pull/12))

### Changed
- Drop redundant `typeof chrome` guards now that the codebase treats `chrome` as the always-defined extension global ([#32](https://github.com/mvdnbrk/peppool-wallet/pull/32))
- Extract `useSession` composable from wallet store; lock now clears the entire `chrome.storage.session` instead of a hardcoded key allowlist ([#31](https://github.com/mvdnbrk/peppool-wallet/pull/31))
- Move last route hint from localStorage to chrome.storage.session ([#30](https://github.com/mvdnbrk/peppool-wallet/pull/30))
- Extract `useSessionDraft` composable shared by Send and Import drafts ([#29](https://github.com/mvdnbrk/peppool-wallet/pull/29))
- Move send form draft from localStorage to chrome.storage.session ([#27](https://github.com/mvdnbrk/peppool-wallet/pull/27))
- Use ribbits as canonical unit in stores and composables; format at display time ([#25](https://github.com/mvdnbrk/peppool-wallet/issues/25))
- Split wallet store into separate wallet and account stores ([#20](https://github.com/mvdnbrk/peppool-wallet/pull/20))
- Consolidate price logic into single price module with unified cache key ([#24](https://github.com/mvdnbrk/peppool-wallet/pull/24))
- Move settings and wallet state to chrome.storage.local with dedicated settings store ([#23](https://github.com/mvdnbrk/peppool-wallet/pull/23))
- Wipe derived cache on app version change ([#22](https://github.com/mvdnbrk/peppool-wallet/pull/22))
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
