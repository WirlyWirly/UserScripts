// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        CLEAR - CoverUp
// @author      WirlyWirly
// @version     1.0
// @homepage    https://github.com/WirlyWirly/quiCKIE
// @description Swap out low resolution posters for higher resolution covers!

// @namespace   https://github.com/WirlyWirly
// @icon        https://raw.githubusercontent.com/WirlyWirly/quiCKIE/main/icon.webp?raw=true
// @run-at      document-end

// ----------------------------------- Matches --------------------------------------

// @match   https://clearjav.com/
// @match   https://clearjav.com/torrents*

// ----------------------------------- Script Links --------------------------------------

// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/ClearJAV/CoverUp.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/ClearJAV/CoverUp.user.js?raw=true
//
// ==/UserScript==

// This string helps prevent various JavaScript oddities when working with variables
'use strict'

const pageURL = document.URL
const pagePath = document.location.pathname
let target, config, queryFromElement


if ( pagePath.match(/(\/torrents[^/]*)$/) ) {
    // ---------- Search Page ----------

    target = document.querySelector('section.torrent-search__results')
    config = { childList: true, subtree: true }
    queryFromElement = target
    coverUp()

    function coverUp() {
        // Functionality to run when changes are detected to the target element

        // --- List View ---
        let allListViewRows = queryFromElement.querySelectorAll('div.torrent-search--list__results tbody > tr:not([data-coverup_done="true"])')
        if ( allListViewRows ) {
            for ( let tableRow of allListViewRows ) {
                // For each tableRow (torrent), replace the Poster image with the Hover Cover

                let coverURL = tableRow.querySelector('div.torrent-search--hover__info img').src
                let posterElement = tableRow.querySelector('img.torrent-search--list__poster-img')
                let posterHoverElement = tableRow.querySelector('div.meta__poster-popup img')

                posterElement.src = coverURL
                posterHoverElement.src = coverURL

                tableRow.setAttribute('data-coverup_done', 'true')
            }
        }

        // --- Grouped View ---
        let allGroupedViewArticles = queryFromElement.querySelectorAll('div.torrent-search--grouped__results article:not([data-coverup_done="true"])')
        if ( allGroupedViewArticles ) {
            for ( let article of allGroupedViewArticles ) {
                // For each Article (torrent), replace the Poster image with the Hover Cover

                let coverURL = article.querySelector('div.torrent-search--hover__info img').src
                let posterElement = article.querySelector('a.torrent-search--grouped__poster img')

                posterElement.src = coverURL

                article.setAttribute('data-coverup_done', 'true')
            }
        }


    }

    let observer = new MutationObserver(coverUp)
    observer.observe(target, config)

} else {
    // ---------- Homepage ----------

    target = document.querySelector('section.panelV2.blocks__top-torrents div.data-table-wrapper tbody')
    config = { childList: true }
    queryFromElement = target
    coverUp()

    function coverUp() {
        // Functionality to run when changes are detected to the target element

        // --- List View ---
        let allListViewRows = queryFromElement.querySelectorAll('tr:not([data-coverup_done="true"])')
        if ( allListViewRows ) {
            for ( let tableRow of allListViewRows ) {
                // For each tableRow (torrent), replace the Poster image with the Hover Cover

                let coverURL = tableRow.querySelector('div.torrent-search--hover__info img').src
                let posterElement = tableRow.querySelector('img.torrent-search--list__poster-img')
                let posterHoverElement = tableRow.querySelector('div.meta__poster-popup img')

                posterElement.src = coverURL
                posterHoverElement.src = coverURL

                tableRow.setAttribute('data-coverup_done', 'true')

            }
        }
    }

    let observer = new MutationObserver(coverUp)
    observer.observe(target, config)

}
