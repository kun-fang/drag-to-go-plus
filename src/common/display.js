import { textToUrl, openToNext, title, modeTitle, actionTitle } from "./constants";

class Display {
  constructor(name, display) {
    this.name = name;
    this.displayFunction = display;
  }

  display(config) {
    return this.displayFunction(config);
  }
}

export const convertTextToUrl = new Display(
  textToUrl,
  (config) => "Treat Url-like Text As a Link");

export const openTabNextToCurrent = new Display(
  openToNext,
  (config) => "Open New Tab Next to the Current Tab");

export const targetTitle = new Display(
  title,
  (config) => `Gesture of dragging selected ${config.target.toLowerCase()}`
)

export const gestureDirectionTitle = new Display(
  modeTitle,
  (config) => "Setting of gesture direction"
)

export const gestureSettingTitle = new Display(
  actionTitle,
  (config) => "Setting of each gesture"
)