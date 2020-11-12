// the state of the extension
let active = false;

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.message === "toggleState"){
        active = !active;
        toggle();
    }
})

function toggle() {
    const extensionOrigin = `chrome-extension://${chrome.runtime.id}`;
    if (active) {
        if (!location.ancestorOrigins.contains(extensionOrigin)) {
            fetch(chrome.runtime.getURL('index.html') /* options can go here */)
            .then(response => response.text())
            .then(html => {
                const reactHTML = html.replace(/\/static\//g, `${extensionOrigin}/static/`);
                $(reactHTML).appendTo('body');
            })
            .catch(err => {
                console.warn(err);
            })
        }
    } else {
        $('#main-window').detach(); // detach over remove since its a toggle button and the extension will be inserted and take out multiple times a session
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
