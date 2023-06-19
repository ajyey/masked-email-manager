console.log('background script loaded');
chrome.storage.sync.get(null, function (data) {
  console.info(data);
});
