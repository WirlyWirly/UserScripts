// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        CLEAR - PhotoShoot!
// @author      WirlyWirly
// @version     1.0
// @homepage    
// @description Quickly view the images of a torrent details page
//              Written in ✏️ NeoVim and tested on 🐺 LibreWolf via 🐵 Violentmonkey

// @namespace   https://github.com/WirlyWirly
// @icon        https://clearjav.com/favicon.ico
// @run-at      document-end
// @grant       GM_addStyle

// ----------------------------------- Matches --------------------------------------

// @match   https://clearjav.com/
// @match   https://clearjav.com/torrents*
// @exclude https://clearjav.com/torrents/*

// ----------------------------------- Script Links --------------------------------------

// @updateURL   
// @downloadURL 

// ==/UserScript==

// =================================== CODE ======================================

// This string helps prevent various JavaScript oddities when working with variables
'use strict'

// The URL path of the current page, used to determine what page this is and how to proceed
const pagePath = document.location.pathname

// CoverCardButton global element
let photoButton = document.createElement('div')

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

    // Style the CoverCards button
    coverCardsButton.title = 'Click to Enable CoverCards'
    coverCardsButton.textContent = '🌸 CoverCards'
    coverCardsButton.classList.add('coverup_button')

    if ( autoCoverCards == true ) {
        // AutoCoverCards is enabled, so style the button accordingly
        coverCardsButton.classList.add('coverCardsView')
        coverCardsButton.title = 'Click to Disable CoverCards'
    }

    if ( window.screen.availWidth < mobileScreenWidthThreshold ) {
        // SmallWidthScreen, likely a mobile, so adjust CoverCards accordingly
        cardWidthMinimum = mobileCardWidthMinimum
        cardCoverImgHeight = mobileCardCoverImgHeight
        coverCardsButton.textContent = '🌸'
    }

    coverCardsButton.addEventListener('mouseup', function(event) {
        // The actions to take when the CoverCard button is clicked

        if ( document.querySelector('div.torrent-search--card__results[data-coverup_covercards]') && event.button == 0 ) {
            // This is already the CoverCards view

            if ( autoCoverCards == true ) {
                // Disable autoCoverCards
                autoCoverCards = false

                this.title = 'Click to Enable CoverCards'
                this.classList.remove('coverCardsView')

            } else {
                // Enable autoCoverCards
                autoCoverCards = true
                this.title = 'Click to Disable CoverCards'
                this.classList.add('coverCardsView')
            }

        } else if ( event.button == 0 ) {
            // This is NOT the CoverCards view, so call CoverCards() and enable autoCoverCards
            CoverCards()
            autoCoverCards = true
            this.title = 'Click to Disable CoverCards'
            this.classList.add('coverCardsView')
        }

    })

    // Insert the CoverCards Button after the 'ClearJAV' logo
    document.querySelector('a.top-nav__branding').insertAdjacentElement('afterend', coverCardsButton)

    // The MutationObserver target and config, used for handling pagination
    target = document.querySelector('section.torrent-search__results')
    config = { childList: true, subtree: true }

    // The initial page load does not require a MutationObserver, so call searchpageCoverUp()
    searchpageCoverUp()

    // The MutationObserver that will monitor changes and call searchpageCoverUp()
    let observer = new MutationObserver(searchpageCoverUp)
    observer.observe(target, config)

}


// =================================== FUNCTIONS ======================================

if ( pagePath.match(/\/torrents/) ) {
    // Apply the styles of the CoverCards button and the coverCards themselves

    GM_addStyle(`

        /* --- CoverCards Button --- */

        div.top-nav__left {
            column-gap: 15px;
        }

        .coverup_button {
            background: #153245;
            border-radius: 5px;
            border: #B6D3E7 solid 1px;
            color: #B6D3E7;
            cursor: pointer;
            display: block;
            font-size: 100%;
            font-weight: Bold;
            padding: 3px 5px;
        }

        .coverup_button:hover {
            box-shadow: 0px 0px 15px #153245;
            text-shadow: 0px 0px 1px #000000, 0px 0px 5px #B6D3E7 !important;
        }

        .coverup_button.coverCardsView {
            background: #5e2247;
            border: rgb(231, 182, 214) solid 1px;
            color: rgb(231, 182, 214);
        }

        .coverup_button.coverCardsView:hover {
            box-shadow: 0px 0px 15px #5e2247;
            text-shadow: 0px 0px 1px #000000, 0px 0px 5px rgb(231, 182, 214) !important;
        }

        /* --- CoverCards View --- */

        #coverCardsView {
            grid-gap: 1rem;
            grid-template-columns: repeat(auto-fit,minmax(${cardWidthMinimum}, 1fr));
        }

        #coverCardsView article.torrent-card {
           min-width: ${cardWidthMinimum};
           border-radius: 8px;
           height: unset;
           grid-template-rows: 40px ${cardCoverImgHeight} 60px 40px;
           grid-template-areas: "header header" "poster poster" "body body" "footer footer";
        }

        #coverCardsView aside.torrent-card__aside {
            background-size: 100% 100%;
        }

        #coverCardsView aside.torrent-card__aside .torrent-card__image {
            object-fit: contain;
        }

        #coverCardsView figure.torrent-card__figure {
            width: unset;
            height: ${cardCoverImgHeight};
            backdrop-filter: blur(20px)
        }

        #coverCardsView div.torrent-card__body {
            padding: 13px 13px;
        }

        #coverCardsView h2.torrent-card__title a {
            font-size: 16px;
            font-weight: normal;
        }

        span.torrent-card__resolution {
            font-weight: bold;
            color: rgb(100, 196, 218);
        }

        span.torrent-card__type {
            font-weight: bold;
            color: rgb(122, 218, 100);
        }

        span.torrent-card__size {
            font-weight: bold;
            color: rgb(226, 101, 101);
        }

    `)
}
