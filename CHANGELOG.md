# Changelog

All notable changes to `peppool-wallet` are documented in this file.

## [Unreleased](https://github.com/mvdnbrk/peppool-wallet/compare/v0.3.0...main)

### Added
- `signPsbt` accepts an optional `broadcast` flag; when `true` the wallet finalizes and broadcasts the signed PSBT and returns `{ psbt, txid }`. Approval popup decodes the PSBT to show inputs, outputs, and net effect ([#44](https://github.com/mvdnbrk/peppool-wallet/pull/44))

### Changed
- Provider discovery now follows an EIP-6963-style `pep_providers:request` / `pep_providers:announce` pattern so dApps that load after the wallet is injected can still discover the provider; replaces the single-shot `pep_providers#peppool` event
- Split the dual-purpose `SignTxView` approval popup into focused `SendTransferApproval` and `SignPsbtApproval` views, with shared chrome extracted to a `useApprovalRequest` composable ([#50](https://github.com/mvdnbrk/peppool-wallet/pull/50))
- Remove the unreachable password prompt from approval views; the router guard already enforces unlock before any `/approve/*` route mounts ([#51](https://github.com/mvdnbrk/peppool-wallet/pull/51))

### Fixed
- Restore `npm run dev` by scoping `manualChunks` to the production build so CRXJS's service-worker Rollup pass no longer fails with `UNRESOLVED_ENTRY` ([#46](https://github.com/mvdnbrk/peppool-wallet/pull/46))
- Allow the Vite dev server in the extension CSP during `npm run dev` so the popup loads without `ERR_FAILED`; production CSP is unchanged ([#49](https://github.com/mvdnbrk/peppool-wallet/pull/49))

## [0.3.0](https://github.com/mvdnbrk/peppool-wallet/releases/tag/v0.3.0) - 2026-05-08

### Added
- Display inscriptions: grid, detail view and dashboard entry ([#40](https://github.com/mvdnbrk/peppool-wallet/pull/40))
- Inscription send flow ([#43](https://github.com/mvdnbrk/peppool-wallet/pull/43))

## [0.2.3](https://github.com/mvdnbrk/peppool-wallet/releases/tag/v0.2.3) - 2026-05-01

### Fixed
- Exclude unconfirmed balance from spendable amount on send page so MAX no longer promises funds coin selection won't spend ([#38](https://github.com/mvdnbrk/peppool-wallet/pull/38))
- Subtract pending outgoing spend from spendable balance so funds tied up in an unconfirmed broadcast are no longer shown as available ([#39](https://github.com/mvdnbrk/peppool-wallet/pull/39))

## [0.2.2](https://github.com/mvdnbrk/peppool-wallet/releases/tag/v0.2.2) - 2026-05-01

### Added
- Inscription data sync with background refresh and cached UTXO exclusion ([#12](https://github.com/mvdnbrk/peppool-wallet/pull/12))

### Changed
- Move encrypted vault from localStorage to `chrome.storage.local` with one-time migration on first launch ([#34](https://github.com/mvdnbrk/peppool-wallet/pull/34))
- Centralize all persistent storage keys in `src/constants/storage.ts` so consumers reference a single source of truth ([#33](https://github.com/mvdnbrk/peppool-wallet/pull/33))
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

### Fixed
- Inject inpage provider via the manifest's main world so the wallet stops breaking pages that enforce Trusted Types CSP ([b6cd1fe](https://github.com/mvdnbrk/peppool-wallet/commit/b6cd1fe))

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
