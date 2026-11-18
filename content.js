(() => {
  const extApi = typeof browser !== "undefined" ? browser : chrome;
  const BRIDGE_CHANNEL = "__GEMINI_LONG_TEXT_TO_FILE__";

  const settings = {
    enabled: true,
    charThreshold: 4000,
    showToast: true
  };

  extApi.storage.local.get(settings).then((stored) => {
    Object.assign(settings, stored);
  });

  extApi.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.enabled) settings.enabled = Boolean(changes.enabled.newValue);
    if (changes.charThreshold) settings.charThreshold = Number(changes.charThreshold.newValue) || 4000;
    if (changes.showToast) settings.showToast = Boolean(changes.showToast.newValue);
  });

  function showToast(message) {
    if (!settings.showToast) return;
    document.getElementById("gemini-text-file-toast")?.remove();
    const toast = document.createElement("div");
    toast.id = "gemini-text-file-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      background: "#1f2937",
      color: "#f9fafb",
      padding: "10px 16px",
      borderRadius: "8px",
      fontSize: "13px",
      fontFamily: "system-ui, sans-serif",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      zIndex: "999999"
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  function hasClipboardFiles(clipboardData) {
    if (clipboardData.files && clipboardData.files.length > 0) return true;
    const items = clipboardData.items;
    if (!items) return false;
    for (const item of items) {
      if (item.kind === "file") return true;
    }
    return false;
  }

  function isPromptEditor(target) {
    const el = target instanceof Element ? target : target?.parentElement;
    if (!el) return false;
    return Boolean(el.closest('rich-textarea, [contenteditable="true"], textarea'));
  }

  function buildTextFile(text) {
    const rand = Math.random().toString(36).slice(2, 6);
    const fileName = `pasted_${Date.now()}_${rand}.txt`;
    return new File([text], fileName, {
      type: "text/plain;charset=utf-8",
      lastModified: Date.now()
    });
  }

  document.addEventListener(
    "paste",
    (event) => {
      if (!settings.enabled) return;

      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      if (hasClipboardFiles(clipboardData)) return;
      if (!isPromptEditor(event.target)) return;

      const text = clipboardData.getData("text/plain");
      if (!text || text.length < settings.charThreshold) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const textFile = buildTextFile(text);
      window.postMessage({ type: BRIDGE_CHANNEL, file: textFile }, window.location.origin);

      showToast(
        `Uzun metin (${text.length.toLocaleString("tr-TR")} karakter) .txt dosyası olarak eklendi.`
      );
    },
    true
  );
})();