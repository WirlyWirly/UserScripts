// ==UserScript==
// @name 		MAM - SnazzySeries
// @author 		WirlyWirly
// @namespace 	https://github.com/WirlyWirly
// @version 	1.5

// @description Series pages, but done all snazzy-like!

// @match 		https://www.myanonamouse.net/tor/browse.php*series*

// @icon 		https://www.myanonamouse.net/favicon.ico

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/MyAnonaMouse/SnazzySeries/SnazzySeries.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SnazzySeries/SnazzySeries.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SnazzySeries/SnazzySeries.user.js?raw=true

// @resource    MAM-SS-CSS https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SnazzySeries/SnazzySeries.css?raw=true
// @grant       GM_getResourceText
// @grant       GM_addStyle

// @grant 		GM_setValue
// @grant 		GM_getValue

// @run-at 		document-end
// ==/UserScript==

// SnazzySeries version number
let versionNumber = '1.4'

// Load CSS into DOM
GM_addStyle(GM_getResourceText('MAM-SS-CSS'))

// The default settings during install
const snazzySeriesSettings = {'auto': true, 'match': true, 'covers': true, 'icons': true}


if (GM_getValue('MAM-SnazzySeries') === undefined) {
    // Create cache item for new installs
    GM_setValue('MAM-SnazzySeries', snazzySeriesSettings)
} else {
    // Check and add missing settings for updaters
    let gmCache = GM_getValue('MAM-SnazzySeries')
    let keyArray = Object.keys(snazzySeriesSettings)
    for (let key of keyArray) {
        if (gmCache[key] === undefined) {
            gmCache[key] = snazzySeriesSettings[key]
        }
    }

    GM_setValue('MAM-SnazzySeries', gmCache)
}

// Load saved settings
const gmCache = GM_getValue('MAM-SnazzySeries')

function configMenu() {
    // --- The Configuration Menu ---

    // Create menu elements
    let ssMenu = document.createElement('div')
    ssMenu.id = 'MAM-SS-Menu'
    ssMenu.innerHTML = `<a href="https://www.myanonamouse.net/f/t/68859/p/p768908#768908" target="_blank">📚 SnazzySeries (v${versionNumber})</a> | <label title="Run SnazzySeries sorting on page-load">Automatic <input type="checkbox" id="MAM-SS-Automatic"></label> | <label title="Move numberless torrents into groups that have similar titles">Match Titles <input type="checkbox" id="MAM-SS-Match"></label> | <label title="Increase cover size for easier viewing">Large Covers <input type="checkbox" id="MAM-SS-Covers"></label> | <label title="Display unique icons for easily distinguising file-types">Icons <input type="checkbox" id="MAM-SS-Icons"></label>`


    // Append menu element to the page
    document.getElementsByClassName('blockFoot')[0].appendChild(ssMenu)


    // Automatic: Toggle
    let ssMenuAutomatic = document.getElementById('MAM-SS-Automatic')
    ssMenuAutomatic.checked = gmCache.auto

    ssMenuAutomatic.addEventListener('click', function(){
        gmCache.auto = ssMenuAutomatic.checked
        GM_setValue('MAM-SnazzySeries', gmCache)
    })

    // Match: Toggle
    let ssMenuMatch = document.getElementById('MAM-SS-Match')
    ssMenuMatch.checked = gmCache.match

    ssMenuMatch.addEventListener('click', function(){
        gmCache.match = ssMenuMatch.checked
        GM_setValue('MAM-SnazzySeries', gmCache)
    })

    // Covers: Toggle
    let ssMenuCovers = document.getElementById('MAM-SS-Covers')
    ssMenuCovers.checked = gmCache.covers

    ssMenuCovers.addEventListener('click', function(){
        gmCache.covers = ssMenuCovers.checked
        GM_setValue('MAM-SnazzySeries', gmCache)
    })

    // Icons: Toggle
    let ssMenuIcons = document.getElementById('MAM-SS-Icons')
    ssMenuIcons.checked = gmCache.icons

    ssMenuIcons.addEventListener('click', function(){
        gmCache.icons = ssMenuIcons.checked
        GM_setValue('MAM-SnazzySeries', gmCache)
    })
}


function organizeTorrents(torrentPage) {
    // --- Organize torrent rows by series number ---

    var seriesID = document.URL.match(/.*seriesID%5D=(\d+)&.*/)[1]
    var seriesName = document.querySelector(`#ssr a.series[href*="${seriesID}"`).innerText

    // The regex, built from the seriesID query in the URL, that will match the correct series number in multi-series books
    var seriesNumberRegex = new RegExp(`series=${seriesID}.+?</a>(\\s|\\(\\#([\\d\\-\\.\\s &nbsp;]+)\\))`)


    // Get all torrent rows
    var torrentrow = torrentPage.getElementsByTagName('tr')

    // Group torrent rows into series numbers
    const seriesGroups = {'numberless':[]}
    const bookTitles = {}
    for (var i = 0, l = torrentrow.length; i < torrentrow.length; i++) {

        if (torrentrow[i].id.length === 0) {
            // If the id is empty, this row isn't a torrent
            continue
        }



        // Torrent row series text
        let seriesElement = torrentrow[i].getElementsByClassName('torSeries')[0]
        let seriesText = seriesElement.outerHTML

        try {
            // Parse series text for series number
            seriesNumber = seriesText.match(seriesNumberRegex)[2]
            seriesNumber = seriesNumber.replace(/[^\d\.\-]/g, '')
            // seriesNumber = seriesNumber.replace(/[\s &nbsp;]/g, '')
        } catch(e) {
            // If there's no match(), there's no series number
            seriesGroups['numberless'].push(torrentrow[i])
            continue
        }

        // Remove series number padding
        try {
            paddedCheck = seriesNumber.match(/^(\d+?).0+$/)
            seriesNumber = `${paddedCheck[1]}`
        } catch(e) {
            // Number is not 1.0
        }

        try {
            let paddedCheck = seriesNumber.match(/^0+(\d[\d\-\.]*$)/)[1]
            seriesNumber = paddedCheck
        } catch(e) {
            // First number is not 01
        }

        try {
            paddedCheck = seriesNumber.match(/^([\d\-\.]+?-)0+([\d\-\.]+$)/)
            seriesNumber = `${paddedCheck[1]}${paddedCheck[2]}`
        } catch(e) {
            // Second number is not -01
        }


        if (seriesNumber in seriesGroups) {
            // If the seriesNumber is a property for seriesGroups, then append it to the array
            seriesGroups[seriesNumber].push(torrentrow[i])
        } else {
            // Create an array for this new series number
            seriesGroups[seriesNumber] = []

            seriesGroups[seriesNumber].push(torrentrow[i])
        }

        // Save book titles + series number to attempt matching numberless books
        let torrentTitle = torrentrow[i].getElementsByClassName('torTitle')[0].innerText.toLowerCase()
        torrentTitle = torrentTitle.replace(/[^\w]/g, '')
        bookTitles[torrentTitle] = seriesNumber


    }


    // Match numberless books with numbered books that have the same title
    let bookTitlesKeys = Object.keys(bookTitles)
    bookTitlesKeys.sort()

    for (let i = seriesGroups['numberless'].length - 1; i >= 0; i--) {
        let numberlessTitle = seriesGroups['numberless'][i].getElementsByClassName('torTitle')[0].innerText.toLowerCase()
        numberlessTitle = numberlessTitle.replace(/[^\w]/g, '')


        // Check if numberless title has an exact match
        if (numberlessTitle in bookTitles) {
            seriesNumber = bookTitles[numberlessTitle]
            let seriesMatched = seriesGroups['numberless'][i]
            seriesGroups['numberless'].splice(i, 1)
            seriesGroups[seriesNumber].push(seriesMatched)
            continue
        }

        // Matched Titles: Apply
        if (gmCache.match === true) {

            for (let x = 0; x < bookTitlesKeys.length; x++) {
                // Check if a bookTitlesKey contains 'numberlessTitle'
                if (bookTitlesKeys[x].includes(numberlessTitle)) {
                    seriesNumber = bookTitles[bookTitlesKeys[x]]
                    let seriesMatched = seriesGroups['numberless'][i]
                    seriesGroups['numberless'].splice(i, 1)
                    seriesGroups[seriesNumber].push(seriesMatched)
                    break
                }

            }

            for (let x = 0; x < bookTitlesKeys.length; x++) {
                // Check if numberlessTitle contains 'bookTitlesKey'
                if (numberlessTitle.includes(bookTitlesKeys[x])) {
                    seriesNumber = bookTitles[bookTitlesKeys[x]]
                    let seriesMatched = seriesGroups['numberless'][i]
                    seriesGroups['numberless'].splice(i, 1)
                    seriesGroups[seriesNumber].push(seriesMatched)
                    break
                }

            }
        }

    }


    // Remove all torrents rows from page
    let sortingRow = torrentrow[0]
    while (torrentPage.lastChild) {
        torrentPage.removeChild(torrentPage.lastChild)
    }

    // Insert torrent rows back onto page
    torrentPage.appendChild(sortingRow)

    var keys = Object.keys(seriesGroups)
    keys.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))

    keys.forEach((seriesNumber) => {
        // Create the banner for the seriesNumber
        if (seriesNumber != 'numberless') {

            // If groubookp is a range pluralize banner
            let bookRange = ''
            if (seriesNumber.includes('-')) {
                bookRange = 's'
            }

            // Insert book number banner
            let seriesBanner = document.createElement('tr')
            seriesBanner.innerHTML = `
            <th colspan="7">
                <div class="MAM-SS-SeriesDiv">
                    <a target="_blank" class="MAM-SS-BookNumber" href="https://duckduckgo.com/?q=\\${seriesName}+book+%23${seriesNumber}+site%3Agoodreads.com&t=ffab&ia=web">📚 Book${bookRange} #${seriesNumber} 📚</a>
                    <br>
                    <a target="_blank" class="MAM-SS-SeriesName" href="https://duckduckgo.com/?q=\\${seriesName}+series+site%3Agoodreads.com&t=ffab&ia=web">${seriesName}</a>
                </div>
            </th>`
            torrentPage.appendChild(seriesBanner)
        } else {
            // Insert numberless banner
            if (seriesGroups['numberless'].length > 0) {
                let numberlessBanner = document.createElement('tr')
                numberlessBanner.innerHTML = `
                <th colspan="7">
                    <div class="MAM-SS-SeriesDiv">
                        <a target="_blank" class="MAM-SS-BookNumber" href="https://duckduckgo.com/?q=\\${seriesName}+series+site%3Agoodreads.com&t=ffab&ia=web">📚 ${seriesName} 📚</a>
                        <br>
                    </div>
                </th>`
                torrentPage.appendChild(numberlessBanner)
            }
        }


        for (i = 0; i < seriesGroups[seriesNumber].length; i++) {
            torrentPage.appendChild(seriesGroups[seriesNumber][i])
        }
    })


}


var observer = new MutationObserver(function(mutations) {
    // Function to run when changes are detected to the target element
    try {
        // Set SnazzySeries button
        let searchResultsTitle = mutations[0]['target'].getElementsByTagName('h1')[0]
        searchResultsTitle.innerHTML = '📚 SnazzySeries'
        searchResultsTitle.addEventListener('click', function(){ organizeTorrents(document.getElementsByTagName('tbody')[1]) })

        // Large Covers: Apply
        if (gmCache.covers === true) {
            let coverElements = mutations[0]['target'].getElementsByClassName('posterImage')
            for (element of coverElements) {
                element.classList.add('MAM-SS-CoverElement')
            }
        }

        // Icons: Apply
        if (gmCache.icons === true) {
            // Update Download/Bookmark icons
            let downloadButtons = mutations[0]['target'].getElementsByClassName('directDownload')

            for (button of downloadButtons) {
                button.parentNode.classList.add('MAM-SS-DownBook')
            }

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

        // Automatic: Apply
        if (gmCache.auto === true) {
            organizeTorrents(document.getElementsByTagName('tbody')[1])
        }


    } catch(error) {
        // console.log(error)
    }
})

if (document.URL.match(/.+series=\d+/) || document.URL.match(/^.+seriesID%5D=\d+/)) {
    // Only run SnazzySeries when URL contains a series number

    // Target element to observe for changes
    var target = document.getElementById("ssr")
    var config = { childList: true }

    // Append the configuration menu
    configMenu()

    // Mutation observer to watch for page changes
    observer.observe(target, config)
}
