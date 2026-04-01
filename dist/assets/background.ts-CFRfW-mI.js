const l = "peppool-auto-lock";
chrome.alarms.onAlarm.addListener(async (e) => {
  if (e.name === l) {
    await chrome.storage.local.remove("unlocked_until");
    try {
      await chrome.storage.session.remove("mnemonic");
    } catch {
    }
    console.log("[Peppool] Auto-lock alarm fired \u2014 session cleared.");
  }
});
const c = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
chrome.runtime.onMessage.addListener((e, t, o) => {
  if (t.id === chrome.runtime.id) {
    if (e.type === "set-auto-lock") return chrome.alarms.create(l, { delayInMinutes: e.delayMinutes }), o({ ok: true }), true;
    if (e.type === "clear-auto-lock") return chrome.alarms.clear(l), o({ ok: true }), true;
    if (e.target === "peppool-background-response") return d(e, o), true;
  }
  return e.target === "peppool-background" && m(e, t, o), true;
});
function d(e, t) {
  const { requestId: o, result: r, error: a } = e, s = c.get(o);
  if (!s) {
    t({ ok: true });
    return;
  }
  s({ result: r, error: a }), c.delete(o);
  for (const [n, u] of i.entries()) if (u === o) {
    i.delete(n);
    break;
  }
  t({ ok: true });
}
async function m(e, t, o) {
  const { method: r, requestId: a, origin: s } = e;
  if (c.set(a, o), !await h() && r !== "wallet_connect") {
    o({ error: "Wallet is locked. Please unlock Peppool Wallet first." }), c.delete(a);
    return;
  }
  switch (r) {
    case "wallet_connect":
    case "signMessage":
    case "sendTransfer":
    case "signPsbt":
      _(e);
      break;
    case "getAccounts":
      g(e, o);
      break;
    case "wallet_disconnect":
      w(e, o);
      break;
    default:
      o({ error: `Method ${r} not supported.` }), c.delete(a);
  }
}
async function h() {
  const t = (await chrome.storage.local.get(["unlocked_until"])).unlocked_until;
  return !!(t && t > Date.now());
}
async function g(e, t) {
  if (!await f(e.origin, "connect")) {
    t({ error: "App not connected. Please call wallet_connect first." }), c.delete(e.requestId);
    return;
  }
  const r = await chrome.storage.local.get("peppool_active_account"), a = parseInt(r.peppool_active_account || "0"), n = (await chrome.storage.local.get("peppool_accounts")).peppool_accounts, p = (n ? JSON.parse(n) : [])[a];
  t(p ? { result: [p.address] } : { error: "No accounts found." }), c.delete(e.requestId);
}
async function w(e, t) {
  await k(e.origin), t({ result: true }), c.delete(e.requestId);
}
async function f(e, t) {
  var _a;
  return !!((_a = ((await chrome.storage.local.get("peppool_permissions")).peppool_permissions || {})[e]) == null ? void 0 : _a.includes(t));
}
async function k(e) {
  const o = (await chrome.storage.local.get("peppool_permissions")).peppool_permissions || {};
  delete o[e], await chrome.storage.local.set({ peppool_permissions: o });
}
async function _(e) {
  await chrome.storage.local.set({ [`request_${e.requestId}`]: e });
  const t = chrome.runtime.getURL(`approval.html?id=${e.requestId}&origin=${encodeURIComponent(e.origin)}&method=${e.method}`), o = await chrome.windows.create({ url: t, type: "popup", width: 375, height: 600 });
  o && o.id && i.set(o.id, e.requestId);
}
chrome.windows.onRemoved.addListener((e) => {
  const t = i.get(e);
  if (t) {
    const o = c.get(t);
    o && (o({ error: "User closed the approval window" }), c.delete(t)), i.delete(e), chrome.storage.local.remove(`request_${t}`);
  }
});
console.log("[Peppool] Background service worker active.");
