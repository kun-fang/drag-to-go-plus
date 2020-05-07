import { actionScriptMap } from "../common/actionScript";

browser.runtime.onMessage.addListener(function(event) {
  let actionScript = actionScriptMap[event.type];
  if (!!actionScript) {
    return actionScript.contentAction(event);
  }
});