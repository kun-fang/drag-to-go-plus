import { getSearchEngines } from "../common/constants";

function downloadUrl(event) {
  let element = document.createElement("a");
  element.href = event.url;
  element.download = "";
  element.target = "_blank";
  element.click();
  element.remove();
}

function openUrl(event) {
  window.location.replace(event.url);
}

function findText(event) {
  let searchText = event.text;
  while (!!searchText && find(event.text)) {
    let selection = getSelection();
    let range = selection.getRangeAt(0);
    let mark = document.createElement("mark")
    range.surroundContents(mark);
  }
}

const eventMap = {
  "download" : downloadUrl,
  "openUrl": openUrl,
  "findText": findText
};

browser.runtime.onMessage.addListener(function(event) {
  let func = eventMap[event.type];
  if (!!func) {
    return func(event);
  }
});