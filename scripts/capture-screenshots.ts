import { chromium } from '@playwright/test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function capture() {
    console.log('🚀 Starting Vite dev server for screenshots...');

    // Use dev server so import.meta.env.DEV is true → debug hooks are available
    // Skip vite.config.ts (CRX plugin rewrites entry modules for extension packaging)
    // Provide only the plugins needed for a standalone SPA dev server
    const server = await createServer({
        configFile: false,
        root: join(__dirname, '..'),
        base: './',
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        isCustomElement: (tag: string) => tag.startsWith('el-')
                    }
                }
            }),
            tailwindcss(),
            nodePolyfills(),
            wasm(),
            topLevelAwait()
        ],
        server: { port: 9999, strictPort: true }
    });
    await server.listen();

    const browser = await chromium.launch();
    const baseUrl = 'http://localhost:9999';

    const context = await browser.newContext({
        viewport: { width: 360, height: 600 },
        deviceScaleFactor: 2
    });

    // Mock chrome.* APIs (not available outside the extension)
    await context.addInitScript(() => {
        (window as any).chrome = {
            storage: {
                local: {
                    get: () => Promise.resolve({ unlocked_until: Date.now() + 3600000 }),
                    set: () => Promise.resolve(),
                    remove: () => Promise.resolve()
                },
                session: {
                    get: () => Promise.resolve({ mnemonic: 'mock mnemonic' }),
                    set: () => Promise.resolve(),
                    remove: () => Promise.resolve()
                }
            },
            runtime: { sendMessage: () => { }, id: 'test-id' },
            alarms: { create: () => { }, clear: () => { } }
        };
    });

    const page = await context.newPage();
    await page.goto(baseUrl);

    // Wait for Vite HMR + app initialization
    await page.waitForTimeout(2000);

    const views = [
        { name: '0-welcome', path: '/', unlocked: false },
        { name: '1-dashboard', path: '/dashboard', unlocked: true },
        { name: '2-send', path: '/send', unlocked: true },
        { name: '3-receive', path: '/receive', unlocked: true },
        { name: '4-settings', path: '/settings', unlocked: true },
        { name: '5-preferences', path: '/settings/preferences', unlocked: true }
    ];

    for (const view of views) {
        console.log(`📸 Capturing ${view.name}...`);

        // Step 1: Set unlock state and navigate
        await page.evaluate((v) => {
            const dev = (window as any).__peppool_dev__;
            if (!dev) return;

            const state = dev.pinia.state.value.wallet;
            state.isUnlocked = v.unlocked;
            state.address = 'PmiGh•••••••••••••••••••••••Khdh';

            dev.router.push(v.path);
        }, view);

        // Step 2: Wait for onMounted + API calls to settle
        await page.waitForTimeout(1500);

        // Step 3: Re-inject mock data AFTER refreshBalance() has completed
        await page.evaluate((v) => {
            const dev = (window as any).__peppool_dev__;
            if (!dev) return;

            const state = dev.pinia.state.value.wallet;
            state.balance = 69.0;
            state.prices = { USD: 0.0123, EUR: 0.0115 };

            if (v.name === '1-dashboard') {
                state.transactions = [
                    { txid: 'tx3', isOutgoing: false, formattedAmount: '+13.37', isConfirmed: false, txidShort: '092c84...dd845' },
                    { txid: 'tx1', isOutgoing: false, formattedAmount: '+420.00', isConfirmed: true, txidShort: 'f1e24c...5f9ef3' },
                    { txid: 'tx2', isOutgoing: true, formattedAmount: '-351.00', isConfirmed: true, txidShort: 'a1b2c3...d0e1f2' }
                ];
            }
        }, view);

        // Step 4: Let Vue re-render with the new data
        await page.waitForTimeout(500);

        await page.screenshot({
            path: join(__dirname, `../screenshots/${view.name}.png`)
        });
    }

    await browser.close();
    await server.close();
    console.log('✅ Screenshots saved to /screenshots directory');
}

capture().catch(console.error);
