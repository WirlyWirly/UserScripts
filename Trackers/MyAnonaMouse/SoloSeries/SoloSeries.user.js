// ==UserScript==
// @name 		MAM - SoloSeries
// @author 		WirlyWirly
// @namespace 	https://github.com/WirlyWirly
// @version 	1.1

// @description Clear out all torrents belonging to a series from search results

// @match 		https://www.myanonamouse.net/tor/browse.php*

// @icon 		https://www.myanonamouse.net/favicon.ico

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/MyAnonaMouse/SoloSeries/SoloSeries.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SoloSeries/SoloSeries.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SoloSeries/SoloSeries.user.js?raw=true

// @resource    MAM-SS-CSS https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SoloSeries/SoloSeries.css?raw=true
//
// @grant       GM_getResourceText
// @grant       GM_addStyle

// @grant 		GM_setValue
// @grant 		GM_getValue

// @run-at 		document-end
// ==/UserScript==

// SoloSeries version number
let versionNumber = '1.0'

// Load CSS into DOM
GM_addStyle(GM_getResourceText('MAM-SS-CSS'))

// The default settings during install
const soloSeriesSettings = {'auto': false, 'covers': true, 'icons': true}


if (GM_getValue('MAM-SoloSeries') === undefined) {
    // Create cache item for new installs
    GM_setValue('MAM-SoloSeries', soloSeriesSettings)
} else {
    // Check and add missing settings for updaters
    let gmCache = GM_getValue('MAM-SoloSeries')
    let keyArray = Object.keys(soloSeriesSettings)
    for (let key of keyArray) {
        if (gmCache[key] === undefined) {
            gmCache[key] = soloSeriesSettings[key]
        }
    }

    GM_setValue('MAM-SoloSeries', gmCache)
}

// Load saved settings
const gmCache = GM_getValue('MAM-SoloSeries')

function configMenu() {
    // --- The Configuration Menu ---

    // Create menu elements
    let ssMenu = document.createElement('div')
    ssMenu.id = 'MAM-SS-Menu'
    ssMenu.innerHTML = `<a href="https://www.myanonamouse.net/f/t/81869/p/p969002#969002" target="_blank">🔰 SoloSeries (v${versionNumber})</a> | <label title="Run SoloSeries on page-load">Automatic <input type="checkbox" id="MAM-SS-Automatic"></label> | <label title="Increase cover size for easier viewing">Large Covers <input type="checkbox" id="MAM-SS-Covers"></label> | <label title="Display unique icons for easily distinguising file-types">Icons <input type="checkbox" id="MAM-SS-Icons"></label>`


    // Append menu element to the page
    document.getElementsByClassName('blockFoot')[0].appendChild(ssMenu)


    // Automatic: Toggle
    let ssMenuAutomatic = document.getElementById('MAM-SS-Automatic')
    ssMenuAutomatic.checked = gmCache.auto

    ssMenuAutomatic.addEventListener('click', function(){
        gmCache.auto = ssMenuAutomatic.checked
        GM_setValue('MAM-SoloSeries', gmCache)
    })

    // Covers: Toggle
    let ssMenuCovers = document.getElementById('MAM-SS-Covers')
    ssMenuCovers.checked = gmCache.covers

    ssMenuCovers.addEventListener('click', function(){
        gmCache.covers = ssMenuCovers.checked
        GM_setValue('MAM-SoloSeries', gmCache)
    })

    // Icons: Toggle
    let ssMenuIcons = document.getElementById('MAM-SS-Icons')
    ssMenuIcons.checked = gmCache.icons

    ssMenuIcons.addEventListener('click', function(){
        gmCache.icons = ssMenuIcons.checked
        GM_setValue('MAM-SoloSeries', gmCache)
    })

    // Element to display the number of removed items
    let removedElement = document.createElement('h2')
    removedElement.id = 'MAM-SS-Removed'
    removedElement.classList.add('left')
    document.getElementById('mainBody').insertBefore(removedElement, document.getElementById('ssr'))
}


function removeTorrents(torrentPage) {
    // --- Remove all torrents that are part of a series ---

    // Get all torrent rows
    let torrentRows = torrentPage.getElementsByTagName('tr')
    let removeList = []
    let seriesCount = 0

    // Identify table rows to be removed
    for (let torrent of [...torrentRows]) {
        if (torrent.getElementsByClassName('torSeries')[0]) {
            // Row is part of a series
            seriesCount++
            removeList.push(torrent)

        } else if (torrent.childNodes[0].textContent.includes('Torrents added ')) {
            // Row is a date seperator
            removeList.push(torrent)

        } else {
            // Row is not part of a series
            // console.log(`Not a series: ${torrent.id}`)
        }
    }

    // Remove identified torrents
    removeList.forEach((torrent) => {
        torrent.remove()
    })

    return seriesCount

}


var observer = new MutationObserver(function(mutations) {
    // Function to run when changes are detected to the target element
    try {
        // Clear Torrent removal count
        document.getElementById('MAM-SS-Removed').innerHTML = ``

        // Set SoloSeries button
        let searchResultsTitle = mutations[0]['target'].getElementsByTagName('h1')[0]
        searchResultsTitle.id = 'MAM-SS-Title'
        searchResultsTitle.innerHTML = '🔰 SoloSeries'
        searchResultsTitle.addEventListener('click', function() {
            let removedCount = removeTorrents(document.getElementsByTagName('tbody')[1])
            document.getElementById('MAM-SS-Removed').innerHTML = `${removedCount} Torrents Removed`
        })

        // Automatic: True
        if (gmCache.auto === true) {
            let removedCount = removeTorrents(document.getElementsByTagName('tbody')[1])
            document.getElementById('MAM-SS-Removed').innerHTML = `${removedCount} Torrents Removed`

        }

        // Large Covers: True
        if (gmCache.covers === true) {
            let coverElements = mutations[0]['target'].getElementsByClassName('posterImage')
            for (element of coverElements) {
                element.classList.add('MAM-SS-CoverElement')
            }
        }

        // Icons: True
        if (gmCache.icons === true) {
            // Update FileType icons
            let fileTypes = mutations[0]['target'].getElementsByClassName('torFileTypes')
            for (type of fileTypes) {
                let fileExtensions = type.getElementsByTagName('a')
                for (ext of fileExtensions) {

                    if (ext.innerText === 'm4b') {
                        ext.classList.add('MAM-SS-FileType-1')
                        ext.innerText = '📀 M4B '
                    }

                    if (ext.innerText === 'm4a') {
                        ext.classList.add('MAM-SS-FileType-1')
                        ext.innerText = '📀 M4A '
                    }

                    if (ext.innerText === 'mp3') {
                        ext.classList.add('MAM-SS-FileType-1')
                        ext.innerText = '💿 MP3 '
                    }

                    if (ext.innerText === 'pdf') {
                        ext.classList.add('MAM-SS-FileType-2')
                        ext.innerText = '📕 PDF '
                    }

                    if (ext.innerText === 'epub') {
                        ext.classList.add('MAM-SS-FileType-2')
                        ext.innerText = '📘 EPUB '
                    }

                    if (ext.innerText === 'azw3') {
                        ext.classList.add('MAM-SS-FileType-2')
                        ext.innerText = '📒 AZW3 '
                    }

                    if (ext.innerText === 'mobi') {
                        ext.classList.add('MAM-SS-FileType-2')
                        ext.innerText = '📔 MOBI '
                    }

                    if (ext.innerText === 'azw') {
                        ext.classList.add('MAM-SS-FileType-2')
                        ext.innerText = '📔 AZW '
                    }

                    if (ext.innerText === 'cbz') {
                        ext.classList.add('MAM-SS-FileType-2')
                        ext.innerText = '🦸 CBZ '
                    }

                    if (ext.innerText === 'cbr') {
                        ext.classList.add('MAM-SS-FileType-2')
                        ext.innerText = '🦸 CBR '
                    }
                }
            }
        }



    } catch(error) {
        // console.log(error)
    }
})

if (!document.URL.match(/.+series=\d+/) && !document.URL.match(/^.+seriesID%5D=\d+/) && !document.URL.match(/^.+seriesID]=\d+/)) {
    // Only run SoloSeries when URL contains a series number

    // Target element to observe for changes
    var target = document.getElementById("ssr")
    var config = { childList: true }

    // Append the configuration menu
    configMenu()

    // Mutation observer to watch for page changes
    observer.observe(target, config)
}
