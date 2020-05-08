import { ActionType, TargetType } from './constants.js'

//#region openTab

function openTabInContent(event) {
  return window.location.replace(event.url);
}

async function openTabInBackground(currentTab, url, openInBackground=false, openTabNext=false) {
  let active = !openInBackground;
  let index = openTabNext ? currentTab.index + 1 : undefined;
  let newTab = await browser.tabs.create({
    active: !openInBackground,
    index: index,
    url: "extension.html"
  });

  async function loadUrlInTab() {
    return await browser.tabs.sendMessage(newTab.id, {
      type: ActionType.OPEN_LINK,
      url: url
    });
  }

  browser.webNavigation.onCompleted.removeListener(loadUrlInTab);

  browser.webNavigation.onCompleted.addListener(loadUrlInTab, {
    url: [
      {
        urlMatches: "^moz-extension://[0-9a-f-]{36}/extension.html$"
      }
    ]
  });
}

//#endregion openTab

//#region downloadUrl

function downloadUrlInContent(event) {
  let element = document.createElement("a");
  element.href = event.url;
  element.download = "";
  element.target = "_blank";
  element.click();
  element.remove();
}

async function downloadUrlInBackground(currentTab, url) {
  return await browser.tabs.sendMessage(currentTab.id, {
    type: ActionType.SAVE_LINK,
    url: url
  });
}

//#endregion downloadUrl

//#region search

async function search(currentTab, query, engine, searchInBackground=false, openTabNext=false) {
  let index = openTabNext ? currentTab.index + 1 : undefined;
  let newTab = await browser.tabs.create({
    index: index,
    openerTabId: currentTab.id,
    active: false
  });
  return await browser.search.search({
    query: query,
    engine: engine,
    tabId: newTab.id
  }).then(() => {
    if (!searchInBackground) {
      return browser.tabs.update(newTab.id, {
        active: true
      });
    }
  });
}

//#endregion search

//#region copyText

async function copyToClipboard(content) {
  return await navigator.clipboard.writeText(content);
}

//#endregion copyText

//#region saveText

async function saveText(currentTab, content) {
  return await downloadUrlInBackground(currentTab, `data:text/plain,${content}`);
}

//#endregion saveText

//#region findInPage

function findInPageInContent(event) {
  let searchText = event.text;
  while (!!searchText && find(event.text)) {
    let selection = getSelection();
    let range = selection.getRangeAt(0);
    let mark = document.createElement("mark")
    range.surroundContents(mark);
  }
}

async function findInPageInBackground(currentTab, content) {
  return await browser.tabs.sendMessage(currentTab.id, {
    type: ActionType.FIND_IN_PAGE,
    text: content
  });
}

//#endregion findInPage

//#region bookmark
async function bookmarkUrlInBackend(url, title) {
  return await browser.bookmarks.create({
    url: url,
    title: title
  });
}

//#endregion bookmark

export const actionScriptMap = {};

class ActionScript {
  constructor(name) {
    this.name = name;
    this._contentFunction = undefined;
    this._backgroundFunction = undefined;
    actionScriptMap[this.name] = this;
  }

  static newActionScript(name) {
    return new ActionScript(name);
  }

  setContentScript(func) {
    this._contentFunction = func;
    return this;
  }

  setBackgroundScript(func) {
    this._backgroundFunction = func;
    return this;
  }

  contentAction(event) {
    if (!!this._contentFunction) {
      this._contentFunction(event);
    }
  }

  backgroundAction(currentTab, content, options) {
    if (!!this._backgroundFunction) {
      this._backgroundFunction(currentTab, content, options);
    }
  }
}

const openTabScript = new ActionScript(ActionType.OPEN_LINK)
  .setContentScript(openTabInContent)
  .setBackgroundScript((currentTab, content, options) => openTabInBackground(currentTab, content, options.openInBackground, options.openTabNext));

const downloadUrlScript = new ActionScript(ActionType.SAVE_LINK)
  .setContentScript(downloadUrlInContent)
  .setBackgroundScript((currentTab, content, options) => downloadUrlInBackground(currentTab, content));

const searchTextScript = new ActionScript(ActionType.SEARCH_TEXT)
  .setBackgroundScript((currentTab, content, options) => search(currentTab, content, options.engine, options.searchInBackground, options.openTabNext));

const copyTextScript = new ActionScript(ActionType.COPY_TEXT)
  .setBackgroundScript((currentTab, content, options) => copyToClipboard(content));

const saveTextScript = new ActionScript(ActionType.SAVE_TEXT)
  .setBackgroundScript((currentTab, content, options) => saveText(currentTab, content));

const findInPageScript = new ActionScript(ActionType.FIND_IN_PAGE)
  .setContentScript(findInPageInContent)
  .setBackgroundScript((currentTab, content, options) => findInPageInBackground(currentTab, content));

const bookmarkUrl = new ActionScript(ActionType.BOOKMARK_URL)
  .setBackgroundScript((currentTab, content, options) => bookmarkUrlInBackend(content, options[TargetType.TEXT]));
