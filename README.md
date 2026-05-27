# Auto-Select Last Active Tab Edge Extension

This Microsoft Edge extension automatically selects the last used or active tab when a tab is moved to a new window or when a tab is closed.

## Features
- Remembers the last active tab in each window.
- When a tab is closed or moved to a new window, the last used tab is automatically selected.

## Installation
1. Go to `edge://extensions/` in Microsoft Edge.
2. Enable "Developer mode".
3. Click "Load unpacked" and select this project folder.

## Files
- `manifest.json`: Extension manifest (v3).
- `background.js`: Background service worker handling tab events.

## Usage
No action is required. The extension works automatically in the background.

## Permissions
- `tabs`: To monitor and switch tabs.

---

**Note:** This extension is for personal use and not published on the Edge Add-ons store.
