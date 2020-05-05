import { TargetType, ImageAction } from './constants.js'

async function openTab(currentTab, url, openInBackground=false, openTabNext=false) {
  let active = !openInBackground;
  let index = openTabNext ? currentTab.index + 1 : undefined;
  let newTab = await browser.tabs.create({
    active: active,
    index: index,
    url: "extension.html"
  });

  async function loadUrlInTab() {
    return await browser.tabs.sendMessage(newTab.id, {
      type: "openUrl",
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
  })
}

async function downloadFile(url) {
  let currentTab = await browser.tabs.query({active: true});
  return await browser.tabs.sendMessage(currentTab[0].id, {
    type: "download",
    url: url
  });
}

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

async function copyToClipboard(content) {
  return await navigator.clipboard.writeText(content);
}

async function saveText(content) {
  return await downloadFile(`data:text/plain,${content}`);
}

async function findInPage(content) {
  let currentTab = await browser.tabs.query({active: true});
  return await browser.tabs.sendMessage(currentTab[0].id, {
    type: "findText",
    text: content
  });
}

export const actionMap = {};

export class Action {
  constructor(action) {
    this.name = action.name;
    this.openNewTab = action.openNewTab || false;
    this.isSearch = action.isSearch || false;
    this.applyFunction = action.apply;
    this.displayFunction = action.display;
    actionMap[this.name] = this;
  }

  apply(currentTab, content, options) {
    return this.applyFunction(currentTab, content, options);
  }

  display() {
    return this.displayFunction();
  }
}

export const actionGroupMap = {};

export class ActionGroup {
  constructor(group) {
    this.target = group.target;
    this.actions = group.actions;
    this.display = group.display;
    this.showEngine = group.showEngine;
    this.actionMap = this.actions.reduce((map, action) => {
      map[action.name] = action;
      return map;
    }, {});
    actionGroupMap[this.target] = this;
  }
}

class ActionStage {
  constructor(stage) {
    this.name = stage.name;
    this.display = stage.display;
  }
}

const noAction = new Action({
  name: "",
  apply: (currentTab, content, options) => undefined,
  display: () => "Do Nothing"
})

const openLinkAction = new Action({
  name: "open_link",
  openNewTab: true,
  apply: function(currentTab, content, options) {
    return openTab(currentTab, content, options.openInBackground, options.openTabNext);
  },
  display: () => "Open the Link"
});

const saveLinkAction = new Action ({
  name: "save_link",
  openNewTab: false,
  apply: function(currentTab, content, options) {
    return downloadFile(content);
  },
  display : () => "Save the Link"
});

const openImageAction = new Action({
  name: "open_image",
  openNewTab: true,
  apply: function(currentTab, content, options) {
    return openTab(currentTab, content, options.openInBackground, options.openTabNext);
  },
  display: () => "Open the Image"
});

const saveImageAction = new Action({
  name: "save_image",
  openNewTab: false,
  apply: function(currentTab, content, options) {
    return downloadFile(content);
  },
  display: () => "Save the Image"
});

const textSearchAction = new Action({
  name: "search_text",
  openNewTab: true,
  isSearch: true,
  apply: function(currentTab, content, options) {
    return search(currentTab, content, options.engine, options.openInBackground, options.openTabNext);
  },
  display: () => "Search the Text"
});

const copyTextAction = new Action({
  name: "copy_text",
  openNewTab: false,
  isSearch: false,
  apply: function(currentTab, content, options) {
    return copyToClipboard(content);
  },
  display: () => "Copy the Text"
});

const saveTextAction = new Action({
  name: "save_text",
  openNewTab: false,
  isSearch: false,
  apply: function(currentTab, content, options) {
    return saveText(content);
  },
  display: () => "Save As a Text File"
})

const findTextInPage = new Action({
  name: "find_text",
  openNewTab: false,
  isSearch: false,
  apply: function(currentTab, content, options) {
    return findInPage(content);
  },
  display: () => "Find and Highlight the Text in Page"
})

const anchorActions = new ActionGroup({
  target: TargetType.ANCHOR,
  actions: [openLinkAction, saveLinkAction],
  showEngine: false,
  display: () => "Link"
});

const imageActions = new ActionGroup({
  target: TargetType.IMAGE,
  actions: [openImageAction, saveImageAction, openLinkAction],
  showEngine: false,
  display: () => "Image"
});

const textActions = new ActionGroup({
  target: TargetType.TEXT,
  actions: [textSearchAction, copyTextAction, saveTextAction, findTextInPage],
  showEngine: true,
  display: () => "Text"
});

const inForeground = new ActionStage({
  name: "in_foreground",
  display: () => "in Foreground"
});

export const inBackground = new ActionStage({
  name: "in_background",
  display: () => "in Background"
});

export const allActionGroups = [anchorActions, imageActions, textActions];
export const allActionStages = [inForeground, inBackground];