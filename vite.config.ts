import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import manifest from './manifest.json'

export default defineConfig({
    base: './',
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/vitest-setup.ts'],
    },
    plugins: [
        crx({ manifest }),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith('el-')
                }
            }
        }),
        tailwindcss(),
        nodePolyfills(),
        wasm(),
        topLevelAwait(),
    ],
    server: {
        port: 5173,
        strictPort: true,
        cors: true,
        hmr: {
            port: 5173,
        },
    },
    build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-vue': ['vue', 'vue-router', 'pinia'],
                    'vendor-crypto': ['bitcoinjs-lib', 'bip39', 'bip32', 'tiny-secp256k1'],
                    'vendor-zxcvbn': ['@zxcvbn-ts/core', '@zxcvbn-ts/language-common', '@zxcvbn-ts/language-en'],
                },
            },
        },
    },
})
