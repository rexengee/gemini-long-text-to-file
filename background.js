const extApi = typeof browser !== "undefined" ? browser : chrome;

extApi.action.onClicked.addListener(() => {
  extApi.runtime.openOptionsPage();
});