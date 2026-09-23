// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        OTW - PopArt
// @author      WirlyWirly
// @version     0.1
// @homepage
// @description

// @namespace   https://github.com/WirlyWirly
// @icon
// @run-at      document-end
// @grant       GM_addStyle

// ----------------------------------- Matches --------------------------------------

// @match   https://oldtoons.world/torrents*
// @exclude https://oldtoons.world/torrents/*

// ----------------------------------- Script Links --------------------------------------

// @updateURL
// @downloadURL

// ==/UserScript==

// =================================== CODE ======================================

// This string helps prevent various JavaScript oddities when working with variables
'use strict'

const pagePath = document.location.pathname


// The MutationObserver global variables
let target, config

if ( pagePath.match(/\/$/) ) {
    // ---------- Homepage ----------

    target = document.querySelector('section.panelV2.blocks__top-torrents div.data-table-wrapper tbody')
    config = { childList: true }

    // The initial page load does not require a MutationObserver, so call homepageCoverUp()
    homepageCoverUp()

    // The MutationObserver that will monitor changes and call homepageCoverUp()
    let observer = new MutationObserver(homepageCoverUp)
    observer.observe(target, config)

} else if ( pagePath.match(/\/torrents/) ) {
    // ---------- Search Page ----------


    // The MutationObserver target and config, used for handling pagination
    target = document.querySelector('div.page__torrents > script[nonce]')
    config = { attributes: true }

    // The MutationObserver that will monitor changes and call searchpageCoverUp()
    let observer = new MutationObserver(function(mutation) {

        let allPosterElements = target.parentElement.querySelectorAll('img.torrent-search--list__poster-img')
        listViewArtwork(allPosterElements)

    })

    observer.observe(target, config)

    let allPosterElements = target.parentElement.querySelectorAll('img.torrent-search--list__poster-img')
    listViewArtwork(allPosterElements)
}


// =================================== FUNCTIONS ======================================

function listViewArtwork(allPosterElements) {

    for ( let posterElement of allPosterElements ) {

        posterElement.src = posterElement.src.replace(/\/w92\//, '/w342/')

        let fanartURL = posterElement.closest('td').querySelector('div.meta__poster-popup img').src

        let tableRow = posterElement.closest('tr')
        tableRow.style.backgroundImage = `url("${fanartURL}")`

    }

}

GM_addStyle(`
    tr.torrent-search--list__row {
        grid-template-columns: 125px 100px 1fr 150px 68px 100px 50px 50px 50px 120px;
        background-size: cover;
        background-position: center;


    }

    tr.torrent-search--list__row > td {
        background-color: #10192799 !important;
    }

    img.torrent-search--list__poster-img {
        width: unset;
        height: unset;
        max-width: 100%;
    }


`)
