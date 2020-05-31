import '../icons/drag-to-go-plus-48.png'
import '../icons/drag-to-go-plus-96.png'

import { readDragAndDropOptions } from '../common/optionStorage'
import { directionGroupMap } from '../common/direction'
import { actionMap, inBackground } from '../common/actions'
import { allTargetTypes } from '../common/target'
import { openToNext, textToUrl, TargetType } from '../common/constants'

browser.runtime.onMessage.addListener(async (data) => {
  let currentTab = (await browser.tabs.query({active: true}))[0];
  let options = await readDragAndDropOptions();
  if (options[textToUrl] && !data[TargetType.ANCHOR]) {
    try {
      let url = new URL(data[TargetType.TEXT]);
      data[TargetType.ANCHOR] = url.toString();
    }
    catch(err) {

    }
  }
  let targets = allTargetTypes.slice().reverse().filter(type => !!data[type.name]);
  if (targets.length == 0) {
    return;
  }
  return await processTarget(targets[0].name, currentTab, data, options);
});

function processTarget(targetType, currentTab, data, options) {
  let targetOptions = options[targetType];
  let direction = getDragDirection(data, targetOptions.mode);
  let dragOption = targetOptions.actions[direction.name];
  if (!!dragOption) {
    let action = actionMap[dragOption.action];
    let config = {};
    config.openInBackground = (dragOption.stage === inBackground.name);
    config.openTabNext = options[openToNext];
    config.engine = dragOption.engine;
    Object.keys(data).forEach(key => config[key] = data[key]);
    if (!!action) {
      let content = data[action.target];
      return action.apply(currentTab, content, config);
    }
  }
}

function getDragDirection(data, mode) {
  let directionGroup = directionGroupMap[mode];
  return !!directionGroup ? directionGroup.getDirection(data) : undefined;
}

async function hintDisableOldAddOn() {
  let addons = await browser.management.getAll();
  let oldAddons = addons.filter(addon => addon.enabled && addon.name === "Drag To Go");
  if (oldAddons.length > 0) {
    await browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("drag-to-go-plus-48.png"),
      "title": "Old DragToGo is found",
      "message": "Please uninstall or disable the old \"Drag To Go\". It may affect functions of DragToGo+. "
    });
  }
}

browser.runtime.onInstalled.addListener(function() {
  browser.runtime.openOptionsPage();
  hintDisableOldAddOn();
});