import { storageKey, optionVersion, version, textToUrl, openToNext } from './constants.js'
import { directionGroupMap, na } from './direction.js';
import { actionGroupMap, actionMap } from './actions.js';
import { allTargetTypes } from './target.js';

function createOptions(options) {
  let data = {[version]: optionVersion};
  data[textToUrl] = options[textToUrl] || false;
  data[openToNext] = options[openToNext] || false;
  allTargetTypes.forEach(target => {
    data[target.name] = createTargetOption(
      target,
      options[target.name] || {});
  });
  return data;
}

function createTargetOption(target, option) {
  let data = {};
  let directionGroup = directionGroupMap[option.mode];
  data.mode = option.mode || na.name;
  data.actions = {};
  directionGroup.directions.forEach(direction => {
    const directionOption = createDirectionOption(target, option.actions[direction.name] || {});
    if (!!directionOption) {
      data.actions[direction.name] = directionOption;
    }
  });
  return data;
}

function createDirectionOption(target, option) {
  let data = {};
  let actionGroup = actionGroupMap[target.name];
  let action = actionMap[option.action];
  if (!!action) {
    data.action = option.action;
    if (action.isSearch) {
      data.engine = option.engine;
    }
    if (action.openNewTab) {
      data.stage = option.stage;
    }
  }
  return data;
}

export async function saveDragAndDropOptions(options) {
  let data = createOptions(options);
  return await browser.storage.sync.set({[storageKey]: data})
}

function getOptions(data) {
  let options = {};
  options[textToUrl] = data[textToUrl];
  options[openToNext] = data[openToNext]
  allTargetTypes.forEach(target => {
    options[target.name] = getTargetOptions(target, data[target.name] || {});
  });
  return options;
}

function getTargetOptions(target, data) {
  let options = {
    mode: data.mode,
    actions: {}
  };
  let directionGroup = directionGroupMap[data.mode];
  directionGroup.directions.forEach(direction => {
    let action = data.actions[direction.name];
    if (!!action) {
      options.actions[direction.name] = getDirectionOptions(target, data.actions[direction.name]);
    }
  });
  return options;
}

function getDirectionOptions(target, data) {
  let options = {};
  let actionGroup = actionGroupMap[target.name];
  let action = actionGroup.actionMap[data.action];
  if (!!action) {
    options.action = data.action;
    if (action.isSearch) {
      options.engine = data.engine;
    }
    if (action.openNewTab) {
      options.stage = data.stage;
    }
  }
  return options;
}

export async function readDragAndDropOptions() {
  let storage = await browser.storage.sync.get(storageKey);
  let data = storage[storageKey] || {};
  return getOptions(data);
}