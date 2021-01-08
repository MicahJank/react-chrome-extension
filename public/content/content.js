// the state of the extension
// let active = false;

// chrome.runtime.onMessage.addListener(function(request, sender, callback) {
//     if (request.message === "toggleState"){
//         active = !active;
//         toggle();
//     }
// })

// function toggle() {
//     const extensionOrigin = `chrome-extension://${chrome.runtime.id}`;
//     if (active) {
//         if (!location.ancestorOrigins.contains(extensionOrigin)) {
//             fetch(chrome.runtime.getURL('index.html') /* options can go here */)
//             .then(response => response.text())
//             .then(html => {
//                 const reactHTML = html.replace(/\/static\//g, `${extensionOrigin}/static/`);
//                 $(reactHTML).appendTo('body');
//             })
//             .catch(err => {
//                 console.warn(err);
//             })
//         }
//     } else {
//         $('#main-window').detach(); // detach over remove since its a toggle button and the extension will be inserted and take out multiple times a session
//     }
// }

// window.addEventListener("message", function(event) {
//     if (event.source !== window) return;
//     // onDidReceiveMessage(event);
//   });
  
//   async function onDidReceiveMessage(event) {
//     if (event.data.type && (event.data.type === "GET_EXTENSION_ID")) {
//       window.postMessage({ type: "EXTENSION_ID_RESULT", extensionId: chrome.runtime.id }, "*");
//     }
//   }


// -----------------------------------------------------------------------------

var jcrop, selection

var overlay = ((active) => (state) => {
  active = typeof state === 'boolean' ? state : state === null ? active : !active
  $('.jcrop-holder')[active ? 'show' : 'hide']()
  chrome.runtime.sendMessage({message: 'active', active})
})(false)

var image = (done) => {
  var image = new Image()
  image.id = 'fake-image'
  image.src = chrome.runtime.getURL('/images/pixel.png')
  image.onload = () => {
    $('body').append(image)
    done()
  }
}

var init = (done) => {
  $('#fake-image').Jcrop({
    bgColor: 'none',
    onSelect: (e) => {
      selection = e
      capture()
    },
    onChange: (e) => {
      selection = e
    },
    onRelease: (e) => {
      setTimeout(() => {
        selection = null
      }, 100)
    }
  }, function ready () {
    jcrop = this

    $('.jcrop-hline, .jcrop-vline').css({
      backgroundImage: `url(${chrome.runtime.getURL('/images/Jcrop.gif')})`
    })

    if (selection) {
      jcrop.setSelect([
        selection.x, selection.y,
        selection.x2, selection.y2
      ])
    }

    done && done()
  })
}

var capture = (force) => {
  chrome.storage.sync.get((config) => {
    if (selection && (config.method === 'crop' || (config.method === 'wait' && force))) {
      jcrop.release()
      setTimeout(() => {
        chrome.runtime.sendMessage({
          message: 'capture', area: selection, dpr: devicePixelRatio
        }, (res) => {
          overlay(false)
          selection = null
          save(res.image, config.format, config.save)
        })
      }, 50)
    }
    else if (config.method === 'view') {
      chrome.runtime.sendMessage({
        message: 'capture',
        area: {x: 0, y: 0, w: innerWidth, h: innerHeight}, dpr: devicePixelRatio
      }, (res) => {
        overlay(false)
        save(res.image, config.format, config.save)
      })
    }
  })
}

var filename = (format) => {
  var pad = (n) => (n = n + '', n.length >= 2 ? n : `0${n}`)
  var ext = (format) => format === 'jpeg' ? 'jpg' : format === 'png' ? 'png' : 'png'
  var timestamp = (now) =>
    [pad(now.getFullYear()), pad(now.getMonth() + 1), pad(now.getDate())].join('-')
    + ' - ' +
    [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join('-')
  return `Screenshot Capture - ${timestamp(new Date())}.${ext(format)}`
}

var save = (image, format, save) => {
  if (save === 'file') {
    var link = document.createElement('a')
    link.download = filename(format)
    link.href = image
    link.click()
  }
  else if (save === 'clipboard') {
    navigator.clipboard.writeText(image).then(() => {
      alert([
        'Screenshot Capture:',
        `${image.substring(0, 40)}...`,
        'Saved to Clipboard!'
      ].join('\n'))
    })
  }
}

window.addEventListener('resize', ((timeout) => () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    jcrop.destroy()
    init(() => overlay(null))
  }, 100)
})())

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.message === 'init') {
    res({}) // prevent re-injecting

    if (!jcrop) {
      image(() => init(() => {
        overlay()
        capture()
      }))
    }
    else {
      overlay()
      capture(true)
    }
  }
  return true
})

