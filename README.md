# Gemini Long Text to File

A lightweight WebExtension for **Zen Browser**, **Firefox**, and Gecko-based browsers that automatically converts large pasted text blocks on **Google Gemini** (`gemini.google.com`) into clean `.txt` file attachments—matching the native behavior of ChatGPT and Claude and preventing editor lag.

## Features
- **Instant Freeze Prevention:** Intercepts clipboard text (`>= 4,000` characters) synchronously before Gemini's rich-text editor renders thousands of DOM nodes.
- **Automatic `.txt` Attachment:** Wraps the pasted text into a uniquely named UTF-8 `.txt` file (`pasted_<timestamp>.txt`) and attaches it to the prompt box.
- **Zero Data Collection:** Runs 100% locally in browser memory with no network requests or storage permissions.

## Local Installation (Development)
1. Open `about:debugging` in Zen Browser or Firefox.
2. Go to **This Firefox / This Zen**.
3. Click **Load Temporary Add-on...** and select `manifest.json`.

## License
[MIT](LICENSE)