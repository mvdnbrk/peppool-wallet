/**
 * Peppool Wallet — MV3 Background Service Worker
 *
 * Handles alarm-based auto-lock so the wallet is actively secured
 * even after the popup is destroyed (user clicks away).
 *
 * Messages from the popup:
 *   { type: 'set-auto-lock',   delayMinutes: number }
 *   { type: 'clear-auto-lock' }
 */

const ALARM_NAME = 'peppool-auto-lock';

// ── Alarm handler ──────────────────────────────────────────────────────────
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== ALARM_NAME) return;

    // Actively purge sensitive data from storage
    await chrome.storage.local.remove('unlocked_until');

    try {
        await chrome.storage.session.remove('mnemonic');
    } catch {
        // session storage may not be available in all contexts
    }

    console.log('[Peppool] Auto-lock alarm fired — session cleared.');
});

// ── Message handler (popup → background) ───────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Only accept messages from this extension
    if (sender.id !== chrome.runtime.id) return;

    if (message.type === 'set-auto-lock') {
        // Minimum alarm granularity in Chrome is ~1 minute.
        // Values below 1 are clamped to 1 by Chrome automatically.
        chrome.alarms.create(ALARM_NAME, {
            delayInMinutes: message.delayMinutes,
        });
        sendResponse({ ok: true });
    } else if (message.type === 'clear-auto-lock') {
        chrome.alarms.clear(ALARM_NAME);
        sendResponse({ ok: true });
    }

    // Return true to keep the message channel open for async responses
    return true;
});

// ── Startup ────────────────────────────────────────────────────────────────
console.log('[Peppool] Background service worker active.');
export { };
