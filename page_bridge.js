(() => {
  const BRIDGE_CHANNEL = "__GEMINI_LONG_TEXT_TO_FILE__";

  function findEditorTarget() {
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      (active.isContentEditable || active.tagName === "TEXTAREA")
    ) {
      return active;
    }
    return (
      document.querySelector('rich-textarea [contenteditable="true"]') ||
      document.querySelector('[contenteditable="true"]') ||
      document.querySelector("textarea") ||
      document.body
    );
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.type !== BRIDGE_CHANNEL || !(data.file instanceof File)) return;

    const target = findEditorTarget();
    target.focus?.();

    const dt = new DataTransfer();
    dt.items.add(data.file);

    const dropZone =
      target.closest("[xap-dropzone], [data-dropzone], form") || target;

    dropZone.dispatchEvent(
      new DragEvent("dragenter", { bubbles: true, cancelable: true, dataTransfer: dt })
    );
    dropZone.dispatchEvent(
      new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer: dt })
    );
    dropZone.dispatchEvent(
      new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: dt })
    );
  });
})();