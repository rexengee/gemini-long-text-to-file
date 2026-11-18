const extApi = typeof browser !== "undefined" ? browser : chrome;

const DEFAULTS = {
  enabled: true,
  charThreshold: 4000,
  showToast: true,
  language: "en"
};

const STRINGS = {
  en: {
    enabledTitle: "Enable Extension",
    enabledDesc: "Automatically convert large pasted text on Gemini into a .txt attachment.",
    thresholdTitle: "Character Threshold",
    thresholdDesc: "Pasted text equal to or longer than this limit will be attached as a .txt file.",
    defaultTag: "Default",
    toastTitle: "Show Notification",
    toastDesc: "Display a brief notification in the bottom-right corner when text is converted.",
    langTitle: "Language",
    langDesc: "Select the language used for extension settings and notifications.",
    resetTitle: "Restore Default Settings",
    resetBtn: "Reset",
    savedText: "Saved"
  },
  tr: {
    enabledTitle: "Eklenti Aktif",
    enabledDesc: "Gemini'de uzun metinleri otomatik olarak .txt ekine dönüştürür.",
    thresholdTitle: "Karakter Sınırı",
    thresholdDesc: "Bu değer ve üzerindeki yapıştırmalar .txt dosyası olarak eklenir.",
    defaultTag: "Varsayılan",
    toastTitle: "Bildirim Göster",
    toastDesc: "Dosyaya dönüştürüldüğünde sağ alt köşede kısa bilgi gösterir.",
    langTitle: "Dil",
    langDesc: "Eklenti ayarları ve bildirimler için kullanılacak dili seçin.",
    resetTitle: "Varsayılan Ayarlara Dön",
    resetBtn: "Sıfırla",
    savedText: "Kaydedildi"
  }
};

const enabledEl = document.getElementById("enabled");
const thresholdEl = document.getElementById("charThreshold");
const showToastEl = document.getElementById("showToast");
const languageEl = document.getElementById("language");
const savedBadgeEl = document.getElementById("savedBadge");

let badgeTimer = null;

function flashSaved() {
  savedBadgeEl.classList.add("visible");
  clearTimeout(badgeTimer);
  badgeTimer = setTimeout(() => {
    savedBadgeEl.classList.remove("visible");
  }, 1400);
}

function applyLanguage(lang) {
  const dict = STRINGS[lang] || STRINGS.en;
  const locale = lang === "tr" ? "tr-TR" : "en-US";
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll(".preset-btn").forEach((btn) => {
    const formatted = Number(btn.dataset.val).toLocaleString(locale);
    btn.textContent =
      btn.dataset.default === "true" ? `${formatted} (${dict.defaultTag})` : formatted;
  });
}

async function saveCurrentSettings() {
  const parsedThreshold = Math.max(
    100,
    Math.min(500000, Number(thresholdEl.value) || DEFAULTS.charThreshold)
  );
  thresholdEl.value = parsedThreshold;
  const lang = languageEl.value === "tr" ? "tr" : "en";

  applyLanguage(lang);

  await extApi.storage.local.set({
    enabled: enabledEl.checked,
    charThreshold: parsedThreshold,
    showToast: showToastEl.checked,
    language: lang
  });

  flashSaved();
}

async function loadSettings() {
  const stored = await extApi.storage.local.get(DEFAULTS);
  const lang = stored.language === "tr" ? "tr" : "en";

  enabledEl.checked = Boolean(stored.enabled);
  thresholdEl.value = Number(stored.charThreshold) || DEFAULTS.charThreshold;
  showToastEl.checked = Boolean(stored.showToast);
  languageEl.value = lang;

  applyLanguage(lang);
}

enabledEl.addEventListener("change", saveCurrentSettings);
showToastEl.addEventListener("change", saveCurrentSettings);
languageEl.addEventListener("change", saveCurrentSettings);
thresholdEl.addEventListener("change", saveCurrentSettings);

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    thresholdEl.value = btn.dataset.val;
    saveCurrentSettings();
  });
});

document.getElementById("resetBtn").addEventListener("click", async () => {
  await extApi.storage.local.set(DEFAULTS);
  await loadSettings();
  flashSaved();
});

loadSettings();