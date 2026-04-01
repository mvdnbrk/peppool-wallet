(function() {
  function i() {
    try {
      const e = document.createElement("script");
      e.src = chrome.runtime.getURL("src/content/inpage.ts"), e.onload = () => e.remove(), (document.head || document.documentElement).appendChild(e);
    } catch (e) {
      console.error("Peppool Wallet: Failed to inject inpage script", e);
    }
  }
  window.addEventListener("message", (e) => {
    var _a;
    if (e.source !== window || ((_a = e.data) == null ? void 0 : _a.target) !== "peppool-content") return;
    const { method: r, params: n, requestId: t } = e.data;
    chrome.runtime.sendMessage({ target: "peppool-background", requestId: t, method: r, params: n, origin: window.location.origin }, (o) => {
      window.postMessage({ target: "peppool-inpage", requestId: t, result: o == null ? void 0 : o.result, error: o == null ? void 0 : o.error }, window.location.origin);
    });
  });
  i();
})();
