// ==UserScript==
// @name        qobuz - OliveTinAction
// @author      WirlyWirly
// @namespace   https://github.com/WirlyWirly
// @version     0.1

// @description Send the URL of the current qobuz page to OliveTin
//              Create an OliveTin action for 'qobuz-dl' that will receive and download the provided URL. See below for a config.yaml example.


// @match       https://play.qobuz.com/*

// @grant   GM_xmlhttpRequest

// ==/UserScript==

const oliveTinURL = 'http://192.168.1.105:32025' // The URL to your OliveTin service
const actionId = 'qobuz_dl_albums' // The action id, as definied in the OliveTin config.yaml
const argumentName = 'qobuzURL' // The name of the qobuz URL argument, as defined in the OliveTin config.yaml


// -------------- OliveTin Config Example --------------
/*

actionGroups:
  downloaders:
    maxConcurrent: 1
    queueSize: 100

actions:
  - title: "qobuz Download"
    id: qobuz_dl
    timeout: 2000
    groups: [ downloaders ]
    exec: 
      - qobuz-dl
      - dl
      - "{{ qobuzURL }}"
    arguments:
      - name: qobuzURL
        type: 'regex:^https://play.qobuz.com/.+$'
        description: A qobuz URL to be downloaded

*/


// -------------- CODE --------------

const timedDelay = ms => new Promise(res => setTimeout(res, ms));

function oliveTinqobuzDownload(qobuzURL) {

    let postData = JSON.stringify({bindingId: actionId, arguments: [{name: argumentName, value: qobuzURL}]})

    GM_xmlhttpRequest({
        // Use the internal GM function to prevent source-origin errors
        method: 'POST',
        url: `${oliveTinURL}/api/StartAction`,
        data: postData,
        headers: {
            'Content-Type': 'application/json',
        },
        onload: async function(response) {

            // Update the button icon to reflect the results
            if (response.responseText.match(/executionTrackingId/)) {
                document.querySelector('#buttonText').innerText = '✔️'
            } else {
                document.querySelector('#buttonText').innerText = '❌'
            }

            // Return the button icon to the default
            await timedDelay(3000)
            document.querySelector('#buttonText').innerText = '🤖'
        }
    })

}

// Create the floating corner button
let buttonContainer = document.createElement('div')
buttonContainer.id = 'sendURL'
buttonContainer.setAttribute('style', 'bottom: 1rem; left: 1rem; padding: 10px 0px; position: fixed; z-index: 3333; cursor: pointer;')

buttonContainer.addEventListener('mouseup', function(event) {
    // When this button is clicked, send the current URL to the OliveTin server

    if (event.button == 0) {
        // Left-click
        oliveTinqobuzDownload(document.URL)

    } else if (event.button == 1) {
        // Middle-click
        window.open(`${oliveTinURL}/logs`, '_blank').focus()

    }

})

let buttonElement = document.createElement('a')
buttonElement.id = 'buttonText'
buttonElement.innerText = '🤖'
buttonElement.style.fontSize = '300%'

buttonElement.addEventListener('mouseover', function() {
    this.style.fontSize = '350%'
})

buttonElement.addEventListener('mouseout', function() {
    this.style.fontSize = '300%'
})

buttonContainer.appendChild(buttonElement)

// Append the button to the main <body> element
document.body.appendChild(buttonContainer)
