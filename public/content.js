
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    console.log('here')
    main();
})

function main() {
    const extensionOrigin = `chrome-extension://${chrome.runtime.id}`;
    
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
        fetch(chrome.runtime.getURL('index.html') /* options can go here */)
        .then(response => response.text())
        .then(html => {
            const styleStashHTML = html.replace(/\/static\//g, `${extensionOrigin}/static/`);
            $(styleStashHTML).appendTo('body');
        })
        .catch(err => {
            console.warn(err);
        })
    }
}

window.addEventListener("message", function(event) {
    if (event.source !== window) return;
    // onDidReceiveMessage(event);
  });
  
  async function onDidReceiveMessage(event) {
    if (event.data.type && (event.data.type === "GET_EXTENSION_ID")) {
      window.postMessage({ type: "EXTENSION_ID_RESULT", extensionId: chrome.runtime.id }, "*");
    }
  }
