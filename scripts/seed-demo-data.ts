/**
 * Seeds the wallet store with demo data for screenshots.
 *
 * Usage from browser devtools (after wallet is unlocked):
 *   - Copy the `seedDemoData()` function body
 *   - Paste into the popup's devtools console
 *
 * Usage from a script:
 *   import { seedDemoData } from './seed-demo-data';
 *   seedDemoData(store);
 */

import type { RawTransaction } from '../src/models/Transaction';
import { Transaction } from '../src/models/Transaction';

const RIBBITS_PER_PEP = 100_000_000;
const DEMO_ADDRESS = 'PmuXQDfN5KZQqPYombmSVscCQXbh7rFZSU';

const demoTxs: RawTransaction[] = [
    {
        txid: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
        version: 1,
        locktime: 0,
        vin: [
            {
                txid: '0000000000000000000000000000000000000000000000000000000000000000',
                vout: 0,
                prevout: {
                    scriptpubkey_address: 'PSenderAddress1111111111111111111111',
                    value: 50 * RIBBITS_PER_PEP
                }
            }
        ],
        vout: [
            {
                scriptpubkey_address: DEMO_ADDRESS,
                value: 42 * RIBBITS_PER_PEP
            }
        ],
        size: 226,
        weight: 904,
        fee: 10000,
        status: {
            confirmed: true,
            block_height: 500100,
            block_time: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
        }
    },
    {
        txid: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
        version: 1,
        locktime: 0,
        vin: [
            {
                txid: '1111111111111111111111111111111111111111111111111111111111111111',
                vout: 0,
                prevout: {
                    scriptpubkey_address: 'PSenderAddress2222222222222222222222',
                    value: 100 * RIBBITS_PER_PEP
                }
            }
        ],
        vout: [
            {
                scriptpubkey_address: DEMO_ADDRESS,
                value: 27 * RIBBITS_PER_PEP
            }
        ],
        size: 226,
        weight: 904,
        fee: 10000,
        status: {
            confirmed: true,
            block_height: 500050,
            block_time: Math.floor(Date.now() / 1000) - 86400 // 1 day ago
        }
    },
    {
        txid: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
        version: 1,
        locktime: 0,
        vin: [
            {
                txid: '2222222222222222222222222222222222222222222222222222222222222222',
                vout: 0,
                prevout: {
                    scriptpubkey_address: DEMO_ADDRESS,
                    value: 10 * RIBBITS_PER_PEP
                }
            }
        ],
        vout: [
            {
                scriptpubkey_address: 'PRecipientAddr33333333333333333333',
                value: 5 * RIBBITS_PER_PEP
            },
            {
                scriptpubkey_address: DEMO_ADDRESS,
                value: Math.floor(4.9999 * RIBBITS_PER_PEP)
            }
        ],
        size: 374,
        weight: 1496,
        fee: 10000,
        status: {
            confirmed: true,
            block_height: 499900,
            block_time: Math.floor(Date.now() / 1000) - 172800 // 2 days ago
        }
    },
    {
        txid: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
        version: 1,
        locktime: 0,
        vin: [
            {
                txid: '3333333333333333333333333333333333333333333333333333333333333333',
                vout: 0,
                prevout: {
                    scriptpubkey_address: 'PSenderAddress4444444444444444444444',
                    value: 20 * RIBBITS_PER_PEP
                }
            }
        ],
        vout: [
            {
                scriptpubkey_address: DEMO_ADDRESS,
                value: 5 * RIBBITS_PER_PEP
            }
        ],
        size: 226,
        weight: 904,
        fee: 10000,
        status: {
            confirmed: false
        }
    }
];

export function seedDemoData(store: any) {
    // Set balance to 69 PEP
    store.balance = 69;
    localStorage.setItem('peppool_balance', '69');

    // Set prices
    store.prices = { USD: 0.0042, EUR: 0.0039 };
    localStorage.setItem('peppool_price_usd', '0.0042');
    localStorage.setItem('peppool_price_eur', '0.0039');

    // Set transactions (2 incoming + 1 outgoing + 1 unconfirmed)
    const address = store.address || DEMO_ADDRESS;
    store.transactions = demoTxs.map((raw) => new Transaction(raw, address));
}
