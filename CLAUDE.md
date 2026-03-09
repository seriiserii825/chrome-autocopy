# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Manifest V3 Chrome extension called "Auto copy" that automatically copies selected text to the clipboard when the user releases the mouse button (without Ctrl held).

## Loading / Testing

No build step — load the extension directly in Chrome:
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory
4. After making changes, click the reload button on the extension card

## Architecture

- **`js/content.js`** — injected into every page (`<all_urls>`). Listens for `click` events; if no Ctrl key and there is a selection, writes to clipboard via `navigator.clipboard.writeText` (with `document.execCommand('copy')` fallback). Shows a Toastify toast on success.
- **`js/background.js`** — service worker. Currently minimal/empty; previously handled toggling and badge state.
- **`js/toastify.js`** + **`css/toastify.css`** — vendored Toastify library for toast notifications.
- **`manifest.json`** — MV3 manifest. Declares the `move-to-last` keyboard command (`Ctrl+Shift+Right`) for moving the active tab to the last position.

## Key Permissions

`tabs`, `activeTab`, `scripting`, `storage`, `alarms`, `notifications`, `<all_urls>` host permissions.
