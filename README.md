# Peppool Wallet

<p align="center"><a href="https://peppool.space" target="_blank"><img src="https://cdn.peppool.space/opengraph/default-card-large.png" width="800" height="418" alt="peppool.space"></p>

The Pepecoin wallet for everyone. This is the source of the Peppool Wallet browser extension.

## Project status: Alpha (in development)

This project is currently in an early alpha phase and under active development. Features may change frequently, and breaking changes can occur without notice. Expect rapid iterations, incomplete features, and occasional instability while we build out the best Pepecoin wallet experience.

## Development Stack

- [Vue.js][link-vue] (Composition API)
- [Tailwind CSS][link-tailwind]
- [Vite][link-vite] + [CRXJS][link-crxjs]
- [Pinia][link-pinia]
- [bitcoinjs-lib][link-bitcoinjs]

## Manual Installation

If you want to use the pre-built extension:

1. Download the latest ZIP file from the [Releases][link-releases] page.
2. **Extract the ZIP** file to a folder on your computer.
3. Open **Chrome** and navigate to `chrome://extensions/`.
4. Enable **"Developer mode"** using the toggle in the top right corner.
5. Click the **"Load unpacked"** button.
6. Select the **extracted folder** (the one containing `manifest.json`).

## Development Setup

### Prerequisites

- Node.js 22+
- npm

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mvdnbrk/peppool-wallet.git
   cd peppool-wallet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Update `VITE_MAINNET_API` if you wish to point to a custom Electrs/Pepecoin API.

4. **Run for development:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Run tests:**
   ```bash
   npm test
   ```

## Support the project

If you find this project useful and want to support its development:

- GitHub Sponsors: [link][link-sponsors]
- thanks.dev: [link][link-thanks]
- Pepecoin: [sponsor][link-sponsor-page]

## Security & Privacy

Please review our [Security Policy](SECURITY.md) and [Privacy Policy](PRIVACY.md).

## Credits

- [Mark van den Broek](https://github.com/mvdnbrk)
- [All Contributors](https://github.com/mvdnbrk/peppool-wallet/contributors)

[link-vue]: https://vuejs.org
[link-tailwind]: https://tailwindcss.com
[link-vite]: https://vitejs.dev
[link-crxjs]: https://crxjs.dev/
[link-pinia]: https://pinia.vuejs.org
[link-bitcoinjs]: https://github.com/bitcoinjs/bitcoinjs-lib
[link-releases]: https://github.com/mvdnbrk/peppool-wallet/releases/latest
[link-sponsors]: https://github.com/sponsors/mvdnbrk
[link-thanks]: https://thanks.dev/u/gh/mvdnbrk
[link-sponsor-page]: https://peppool.space/sponsor
