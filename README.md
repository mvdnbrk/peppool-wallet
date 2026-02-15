# Peppool Wallet

The Pepecoin wallet for everyone.

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **Styling:** Tailwind CSS 4
- **Build Tool:** Vite + CRXJS (Native Manifest V3 support)
- **State Management:** Pinia
- **Testing:** Vitest + Vue Test Utils
- **Blockchain:** bitcoinjs-lib (Custom PEP parameters)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd peppool-wallet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Modify `VITE_MAINNET_API` if you wish to point to a custom Electrs/Pepecoin API.

### Development

Run the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Building for Production

To build the extension for production:
```bash
npm run build
```
The production-ready extension will be located in the `dist/` directory.

## Manual Installation

If you want to use the pre-built extension:

1. Download the latest ZIP file from the [Releases](https://github.com/mvdnbrk/peppool-wallet/releases/latest) page.
2. **Extract the ZIP** file to a folder on your computer.
2. Open **Chrome** and navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** using the toggle in the top right corner.
4. Click the **"Load unpacked"** button.
5. Select the **extracted folder** (the one containing `manifest.json`).

## Development (Loading from Source)

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **"Developer mode"** in the top right corner.
3. Click **"Load unpacked"**.
4. Select the `dist/` directory in this project folder.

### Running Tests

Execute the unit and integration test suite:
```bash
npm test
```

### Formatting and Linting

```bash
# Type checking
npx tsc --noEmit
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`).
2. Commit your changes (`git commit -m 'feat: add some amazing feature'`).
3. Push to the branch (`git push origin feature/amazing-feature`).
4. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

[Security Policy](SECURITY.md) | [Privacy Policy](PRIVACY.md)

