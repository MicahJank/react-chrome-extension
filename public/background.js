// Detects when the chrome extension is clicked
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('action from background.js')
    chrome.tabs.sendMessage(tab.id, { message: 'load' });
})