export const storageKey = "dragAndDropOptions";
export const optionVersion = "1.0.0";

export const id = "id";
export const fromX = "fromX";
export const fromY = "fromY";
export const toX = "toX";
export const toY = "toY";
export const textToUrl = "textToUrl";
export const openToNext = "openToNext";
export const version = "version";
export const title = "title";
export const modeTitle = "modeTitle";
export const actionTitle = "actionTitle";

export const TargetType = Object.freeze({
  TEXT: "text",
  ANCHOR: "anchor",
  IMAGE: "image"
});

export const ActionType = Object.freeze({
  OPEN_LINK: "open_link",
  OPEN_IMAGE: "open_image",
  SAVE_LINK: "save_link",
  SAVE_IMAGE: "save_image",
  SEARCH_TEXT: "search_text",
  SAVE_TEXT: "save_text",
  COPY_TEXT: "copy_text",
  FIND_IN_PAGE: "find_in_page"
});

export const StageType = Object.freeze({
  IN_FOREGROUND: "in_foreground",
  IN_BACKGROUND: "in_background"
});

export async function getSearchEngines() {
  let searchEngines = await browser.search.get();
  return searchEngines.map(engine => {
    engine.display = engine.name
    if (engine.isDefault) {
      engine.display = `${engine.name} (Default)`
    }
    return engine;
  })
}