import { ActionType, TargetType, StageType } from './constants.js'
import { actionScriptMap } from './actionScript.js';

export const actionMap = {};

export class Action {
  constructor(action) {
    this.name = action.name;
    this.openNewTab = action.openNewTab || false;
    this.isSearch = action.isSearch || false;
    this.actionScript = action.actionScript;
    this.displayFunction = action.display;
    actionMap[this.name] = this;
  }

  apply(currentTab, content, options) {
    if (!!this.actionScript) {
      return this.actionScript.backgroundAction(currentTab, content, options);
    }
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
  display: () => "Do Nothing"
})

const openLinkAction = new Action({
  name: ActionType.OPEN_LINK,
  openNewTab: true,
  actionScript: actionScriptMap[ActionType.OPEN_LINK],
  display: () => "Open the Link"
});

const saveLinkAction = new Action ({
  name: ActionType.SAVE_LINK,
  openNewTab: false,
  actionScript: actionScriptMap[ActionType.SAVE_LINK],
  display : () => "Save the Link"
});

const openImageAction = new Action({
  name: ActionType.OPEN_IMAGE,
  openNewTab: true,
  actionScript: actionScriptMap[ActionType.OPEN_LINK],
  display: () => "Open the Image"
});

const saveImageAction = new Action({
  name: ActionType.SAVE_IMAGE,
  openNewTab: false,
  actionScript: actionScriptMap[ActionType.SAVE_LINK],
  display: () => "Save the Image"
});

const textSearchAction = new Action({
  name: ActionType.SEARCH_TEXT,
  openNewTab: true,
  isSearch: true,
  actionScript: actionScriptMap[ActionType.SEARCH_TEXT],
  display: () => "Search the Text"
});

const copyTextAction = new Action({
  name: ActionType.COPY_TEXT,
  openNewTab: false,
  isSearch: false,
  actionScript: actionScriptMap[ActionType.COPY_TEXT],
  display: () => "Copy the Text"
});

const saveTextAction = new Action({
  name: ActionType.SAVE_TEXT,
  openNewTab: false,
  isSearch: false,
  actionScript: actionScriptMap[ActionType.SAVE_TEXT],
  display: () => "Save As a Text File"
})

const findTextInPage = new Action({
  name: ActionType.FIND_IN_PAGE,
  openNewTab: false,
  isSearch: false,
  actionScript: actionScriptMap[ActionType.FIND_IN_PAGE],
  display: () => "Find and Highlight the Text in Page (Experimental)"
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
  name: StageType.IN_FOREGROUND,
  display: () => "in Foreground"
});

export const inBackground = new ActionStage({
  name: StageType.IN_BACKGROUND,
  display: () => "in Background"
});

export const allActionGroups = [anchorActions, imageActions, textActions];
export const allActionStages = [inForeground, inBackground];