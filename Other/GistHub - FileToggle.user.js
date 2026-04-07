// ==UserScript==
// @name        GistHub - FileToggle
// @author      WirlyWirly
// @namespace   https://github.com/WirlyWirly
// @version     1.0

// @description Toggle the visibility of each file in a gisthub until its header is clicked

// @icon        https://gist.github.com/favicon.ico

// @match       https://gist.github.com/WirlyWirly/*

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Other/GistHub%20-%20FileToggle.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/GistHub%20-%20FileToggle.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/GistHub%20-%20FileToggle.user.js?raw=true

// ==/UserScript==

// Get all files in the gisthub
let fileBoxes = document.querySelectorAll('div.file div.Box-body')

for ( let file of fileBoxes ) {
    // Hide the fileBox and enable a toggle onclick of the header
    file.style.display = 'none'

    let header = file.previousElementSibling

    header.addEventListener('click', function(event) {
        // When this header is clicked, re-display the associated filebox

        let fileBox = this.nextElementSibling

        if ( fileBox.style.display == 'none' ) {
            fileBox.style.display = ''
        } else {
            fileBox.style.display = 'none'
        }
    })
}
