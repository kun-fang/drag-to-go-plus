import { storageKey, optionVersion, version, textToUrl, openToNext, getSearchEngines } from './constants.js'
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
  if (!!directionGroup) {
    data.mode = option.mode || na.name;
    data.actions = {};
    directionGroup.directions.forEach(direction => {
      const directionOption = createDirectionOption(target, option.actions[direction.name] || {});
      if (!!directionOption) {
        data.actions[direction.name] = directionOption;
      }
    });
  }
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
  if (!!data.mode) {
    let directionGroup = directionGroupMap[data.mode];
    directionGroup.directions.forEach(direction => {
      let action = data.actions[direction.name];
      if (!!action) {
        options.actions[direction.name] = getDirectionOptions(target, data.actions[direction.name]);
      }
    });
  }
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
  let data = storage[storageKey] || await getDefaultOption();
  return getOptions(data);
}

export async function removeDragAndDropOptions() {
  return await browser.storage.sync.remove(storageKey);
}

async function getDefaultOption() {
  let engines = await getSearchEngines();
  let defaultEngines = engines.filter(engine => engine.isDefault);
  let textOption = defaultEngines.length > 0
    ? {
      mode: "any",
      actions: {
        any: {
          action: "search_text",
          stage: "in_foreground",
          engine: defaultEngines[0].name
        }
      }
    }
    : {
      mode: "na",
      actions: {}
    };
  return {
    text: textOption,
    anchor: {
      mode: "any",
      actions: {
        any: {
          action: "open_link",
          stage: "in_foreground"
        }
      }
    },
    image: {
      mode: "any",
      actions: {
        any:{
          action: "open_image",
          stage: "in_foreground"
        }
      }
    }
  };
}