const extApi = typeof browser !== "undefined" ? browser : chrome;

const DEFAULTS = {
  enabled: true,
  charThreshold: 4000,
  showToast: true
};

const enabledEl = document.getElementById("enabled");
const thresholdEl = document.getElementById("charThreshold");
const showToastEl = document.getElementById("showToast");
const statusEl = document.getElementById("status");

function showStatus(text) {
  statusEl.textContent = text;
  setTimeout(() => {
    if (statusEl.textContent === text) statusEl.textContent = "";
  }, 2200);
}

async function loadSettings() {
  const stored = await extApi.storage.local.get(DEFAULTS);
  enabledEl.checked = Boolean(stored.enabled);
  thresholdEl.value = Number(stored.charThreshold) || DEFAULTS.charThreshold;
  showToastEl.checked = Boolean(stored.showToast);
}

async function saveSettings() {
  const parsedThreshold = Math.max(100, Math.min(500000, Number(thresholdEl.value) || DEFAULTS.charThreshold));
  thresholdEl.value = parsedThreshold;

  await extApi.storage.local.set({
    enabled: enabledEl.checked,
    charThreshold: parsedThreshold,
    showToast: showToastEl.checked
  });
  showStatus("Ayarlar kaydedildi.");
}

async function resetSettings() {
  await extApi.storage.local.set(DEFAULTS);
  await loadSettings();
  showStatus("Varsayılan ayarlara dönüldü.");
}

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    thresholdEl.value = btn.dataset.val;
    saveSettings();
  });
});

document.getElementById("saveBtn").addEventListener("click", saveSettings);
document.getElementById("resetBtn").addEventListener("click", resetSettings);

loadSettings();