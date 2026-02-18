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

const useFrame = process.argv.includes('--frame');

async function capture() {
    console.log(`🚀 Starting Vite dev server for screenshots (Frame: ${useFrame})...`);

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
        viewport: useFrame ? { width: 1280, height: 800 } : { width: 360, height: 600 },
        deviceScaleFactor: 2
    });

    // Mock chrome.* APIs
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

    const views = [
        { name: '0-welcome', path: '/', unlocked: false },
        { name: '1-dashboard', path: '/dashboard', unlocked: true },
        { name: '2-send', path: '/send', unlocked: true },
        { name: '3-receive', path: '/receive', unlocked: true },
        { name: '4-settings', path: '/settings', unlocked: true },
        { name: '5-preferences', path: '/settings/preferences', unlocked: true }
    ];

    for (const view of views) {
        console.log(`📸 Capturing ${view.name}${useFrame ? '-frame' : ''}...`);
        await page.goto(baseUrl);

        // Inject Style & Frame ONLY if --frame argument is present
        await page.evaluate(({ useFrame }) => {
            if (useFrame) {
                const style = document.createElement('style');
                style.textContent = `
                    body { 
                        display: flex !important; align-items: center !important; justify-content: center !important;
                        background: #f9fafb !important; margin: 0 !important; width: 100vw !important; height: 100vh !important;
                    }
                    #app-frame {
                        background: #1e293b; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        border: 1px solid rgba(0, 0, 0, 0.1); overflow: hidden; position: relative;
                    }
                    #app-header { height: 28px; background: #1e293b; display: flex; align-items: center; padding: 0 12px; gap: 8px; }
                    .dot { width: 12px; height: 12px; border-radius: 50%; }
                    .red { background: #ff5f56; } .yellow { background: #ffbd2e; } .green { background: #27c93f; }
                    #app { width: 360px !important; height: 600px !important; position: relative !important; }
                `;
                document.head.appendChild(style);
                const app = document.getElementById('app');
                if (app) {
                    const frame = document.createElement('div');
                    frame.id = 'app-frame';
                    const header = document.createElement('div');
                    header.id = 'app-header';
                    header.innerHTML = '<div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>';
                    app.parentNode?.insertBefore(frame, app);
                    frame.appendChild(header);
                    frame.appendChild(app);
                }
            } else {
                // Ensure pure look without frame-specific styles
                document.body.style.margin = '0';
                const app = document.getElementById('app');
                if (app) {
                    app.style.width = '360px';
                    app.style.height = '600px';
                }
            }
        }, { useFrame });

        // Update state and navigate
        await page.evaluate((v) => {
            const dev = (window as any).__peppool_dev__;
            if (!dev) return;
            dev.pinia.state.value.wallet.isUnlocked = v.unlocked;
            dev.pinia.state.value.wallet.address = 'PmiGh•••••••••••••••••••••••Khdh';
            dev.router.push(v.path);
        }, view);

        await page.waitForTimeout(1000);

        // Mock data injection
        await page.evaluate((v) => {
            const dev = (window as any).__peppool_dev__;
            if (!dev || !v.unlocked) return;
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

        await page.waitForTimeout(500);

        const suffix = useFrame ? '-frame' : '';
        const fileName = `${view.name}${suffix}.png`;
        const filePath = join(__dirname, `../screenshots/${fileName}`);

        if (useFrame) {
            await page.screenshot({ path: filePath, fullPage: true });
        } else {
            // Capture only the 360x600 area
            await page.screenshot({ path: filePath, clip: { x: 0, y: 0, width: 360, height: 600 } });
        }
    }

    await browser.close();
    await server.close();
    console.log('✅ Screenshots saved to /screenshots directory');
}

capture().catch(console.error);
