import { id, fromX, fromY, toX, toY, TargetType } from '../common/constants.js'

let fakeDiv = document.createElement("div");

function getId() {
  let chars = [];
  for (var i = 0; i < 16; i++) {
    chars.push(Math.floor(Math.random() * 16).toString(16));
  }
  return chars.join("");
}

document.addEventListener('dragstart', function(event) {
  if (!event.altKey
      && !event.ctrlKey
      && !event.metaKey
      && !event.shiftKey) {
    event.dataTransfer.setData(fromX, event.screenX);
    event.dataTransfer.setData(fromY, event.screenY);
    event.dataTransfer.setData(id, getId());
  }
}, false);

document.addEventListener('dragover', (event) => {
  event.preventDefault();
})

document.addEventListener('drop', function(event) {
  event.preventDefault();
  if (!!event.dataTransfer.getData(id)
      && !event.dataTransfer.mozUserCancelled) {
    let message = createDragAndDropMessage(event);
    browser.runtime.sendMessage(message);
  }
}, false);

function createDragAndDropMessage(dropEvent) {
  return {
    [id]: dropEvent.dataTransfer.getData(id),
    [fromX]: parseInt(dropEvent.dataTransfer.getData(fromX)),
    [fromY]: parseInt(dropEvent.dataTransfer.getData(fromY)),
    [toX]: dropEvent.screenX,
    [toY]: dropEvent.screenY,
    [TargetType.IMAGE]: getImage(dropEvent),
    [TargetType.ANCHOR]: getAnchor(dropEvent),
    [TargetType.TEXT]: getText(dropEvent)
  };
}

function findImageInElement(element) {
  if (element.textContent.length > 50) {
    return "";
  }
  let imageElements = element.getElementsByTagName("img");
  return imageElements.length === 1 ? imageElements[0].src : "";
}

function getImage(event) {
  let imageSrc = "";
  if (event.dataTransfer.types.indexOf("application/x-moz-nativeimage") >= 0) {
    imageSrc = event.dataTransfer.getData("application/x-moz-file-promise-url");
  }
  if (!imageSrc) {
    fakeDiv.innerHTML = event.dataTransfer.getData("text/html");
    imageSrc = findImageInElement(fakeDiv);
  }
  return imageSrc;
}

function getAnchor(event) {
  return event.dataTransfer.getData("text/uri-list");
}

function getText(event) {
  return event.dataTransfer.getData("text/plain");
}