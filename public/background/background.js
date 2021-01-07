// Detects when the chrome extension is clicked
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { message: 'toggleState' });
})