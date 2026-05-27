const tabHistory = {};

function getHistory(windowId) {
  if (!tabHistory[windowId]) tabHistory[windowId] = [];
  return tabHistory[windowId];
}

function rememberActiveTab(windowId, tabId) {
  const history = getHistory(windowId);
  const idx = history.indexOf(tabId);
  if (idx !== -1) history.splice(idx, 1);
  history.push(tabId);
}

function removeFromHistory(windowId, tabId) {
  const history = getHistory(windowId);
  let idx = history.indexOf(tabId);
  while (idx !== -1) {
    history.splice(idx, 1);
    idx = history.indexOf(tabId);
  }
}

async function activateLastValidTab(windowId) {
  const history = getHistory(windowId);

  while (history.length > 0) {
    const targetTabId = history[history.length - 1];

    try {
      const targetTab = await chrome.tabs.get(targetTabId);

      if (targetTab.windowId !== windowId) {
        history.pop();
        continue;
      }

      await chrome.tabs.update(targetTabId, { active: true });
      return;
    } catch (e) {
      history.pop();
    }
  }
}

async function handleTabRemovedFromWindow(windowId, tabId) {
  const history = getHistory(windowId);
  if (history.length === 0) return;

  const wasMostRecentActive = history[history.length - 1] === tabId;
  removeFromHistory(windowId, tabId);
  if (!wasMostRecentActive) return;

  await activateLastValidTab(windowId);
}

chrome.tabs.query({ active: true }, (tabs) => {
  for (const tab of tabs) {
    rememberActiveTab(tab.windowId, tab.id);
  }
});

chrome.tabs.onActivated.addListener(({ windowId, tabId }) => {
  rememberActiveTab(windowId, tabId);
});

chrome.windows.onRemoved.addListener((windowId) => {
  delete tabHistory[windowId];
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  if (removeInfo.isWindowClosing) return;
  await handleTabRemovedFromWindow(removeInfo.windowId, tabId);
});

chrome.tabs.onDetached.addListener(async (tabId, detachInfo) => {
  await handleTabRemovedFromWindow(detachInfo.oldWindowId, tabId);
});
