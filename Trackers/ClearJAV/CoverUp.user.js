// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        CLEAR - CoverUp!
// @author      WirlyWirly
// @version     1.5
// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/ClearJAV/CoverUp.user.js
// @description Cover up low resolution posters with higher resolution covers!

// @namespace   https://github.com/WirlyWirly
// @icon        https://clearjav.com/favicon.ico
// @run-at      document-end
// @grant       GM_addStyle

// ----------------------------------- Matches --------------------------------------

// @match   https://clearjav.com/
// @match   https://clearjav.com/torrents*

// ----------------------------------- Script Links --------------------------------------

// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/ClearJAV/CoverUp.user.js
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/ClearJAV/CoverUp.user.js
//
// ==/UserScript==

// The dimensions of the CardCovers
const cardWidthMinimum = '420px' // Default: 420px
const coverHeight = '290px' // Default: 290px

// Other Ratios worth trying
// 480px by 338px

// This string helps prevent various JavaScript oddities when working with variables
'use strict'

const pageURL = document.URL
const pagePath = document.location.pathname
let target, config, queryFromElement


if ( pagePath.match(/(\/torrents[^/]*)$/) ) {
    // ---------- Search Page ----------

    // If CardCovers should be automatically triggered
    let autoCardCovers = false

    // Create the CardCovers button
    let cardCoversButton = document.createElement('div')
    cardCoversButton.textContent = 'CardCovers'
    cardCoversButton.title = 'Click to Display CardCovers'
    cardCoversButton.classList.add('coverup_button')
    cardCoversButton.setAttribute('style', `
        background: #153245;
        border-radius: 5px;
        border: #B6D3E7 solid 1px;
        color: #B6D3E7;
        cursor: pointer;
        display: none;
        font-size: 100%;
        font-weight: Bold;
        margin: 0px 8px 0px 0px;
        padding: 4px 10px 4px 10px;
    `)

    GM_addStyle(`div.coverup_button:hover {
        text-shadow: 0px 0px 1px black, 0px 0px 5px #B6D3E7 !important;
    }`)

    cardCoversButton.addEventListener('mouseup', function(event) {
        // The actions to take when the CardCover button is clicked

        if ( document.querySelector('div.torrent-search--card__results article[data-coverup_cardcovers="true"]') ) {
            // There are already CardCovers in this view, so toggle autoCardCovers

            if ( autoCardCovers == false ) {
                autoCardCovers = true
                this.textContent = '🤖 CardCovers'
                this.title = 'Click to Disable Auto CardCovers'
            } else if ( autoCardCovers == true ) {
                autoCardCovers = false
                this.textContent = 'CardCovers'
                this.title = 'Click to Display CardCovers'
            }

        } else {
            // There are NOT CardCovers in this view, so trigger cardCovers()
            event.button == 0 ? cardCovers() : null
        }

    })

    // Insert the CardCovers Button after the 'ClearJAV' logo
    document.querySelector('a.top-nav__branding').insertAdjacentElement('afterend', cardCoversButton)

    // The MutationObserver target and config, used for handling pagination
    target = document.querySelector('section.torrent-search__results')
    config = { childList: true, subtree: true }

    function coverUp() {
        // Functionality to run when changes are detected to the target element

        // --- List View ---
        let allListViewRows = target.querySelectorAll('div.torrent-search--list__results tbody > tr:not([data-coverup_done="true"])')
        if ( allListViewRows.length > 0 ) {
            cardCoversButton.style.display = ''

            for ( let tableRow of allListViewRows ) {
                // For each tableRow (torrent), replace the Poster image with the Hover Cover

                let coverURL = tableRow.querySelector('div.torrent-search--hover__info img').src
                let posterElement = tableRow.querySelector('img.torrent-search--list__poster-img')
                let posterHoverElement = tableRow.querySelector('div.meta__poster-popup img')

                posterElement.src = coverURL
                posterHoverElement.src = coverURL

                tableRow.setAttribute('data-coverup_done', 'true')
            }

            // If autoCardCovers is enabled, call cardCovers()
            autoCardCovers == true ? cardCovers() : null

        }

        // --- Grouped View ---
        let allGroupedViewArticles = target.querySelectorAll('div.torrent-search--grouped__results article:not([data-coverup_done="true"])')
        if ( allGroupedViewArticles.length > 0 ) {
            cardCoversButton.style.display = 'none'
            for ( let article of allGroupedViewArticles ) {
                // For each Article (torrent), replace the Poster image with the Hover Cover

                let coverURL = article.querySelector('div.torrent-search--hover__info img').src
                let posterElement = article.querySelector('a.torrent-search--grouped__poster img')

                posterElement.src = coverURL

                article.setAttribute('data-coverup_done', 'true')
            }
        }

        // --- Card View ---
        let allCardViewArticles = target.querySelectorAll('div.torrent-search--card__results article:not([data-coverup_cardcovers="true"])')
        if ( allCardViewArticles.length > 0 ) {
            // This is the CardView (not the CardCovers view)
            cardCoversButton.style.display = 'none'
        }

        // --- Poster View ---
        let allPosterViewArticles = target.querySelectorAll('div.torrent-search--poster__results article')
        if ( allPosterViewArticles.length > 0 ) {
            cardCoversButton.style.display = 'none'
        }

    }

    // The intial page load does not require a MutationObserver, so call coverUp()
    coverUp()

    let observer = new MutationObserver(coverUp)
    observer.observe(target, config)

} else if ( pagePath.match(/\/$/) ) {
    // ---------- Homepage ----------

    target = document.querySelector('section.panelV2.blocks__top-torrents div.data-table-wrapper tbody')
    config = { childList: true }
    coverUp()

    function coverUp() {
        // Functionality to run when changes are detected to the target element

        // --- List View ---
        let allListViewRows = target.querySelectorAll('tr:not([data-coverup_done="true"])')
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

// List view to Card view

function cardCovers() {
    // Convert the List view into a Card type view

    let listViewElement = document.querySelector('div.torrent-search--list__results')
    if ( listViewElement == null ) { return }
    let allListViewRows = listViewElement.querySelectorAll('tbody > tr:not([data-coverup_cardcovers="true"])')

    if ( allListViewRows ) {
        let articlesHolder = document.createElement('div')
        articlesHolder.className = 'panel__body torrent-search--card__results'

        for ( let tableRow of allListViewRows ) {
            // For each tableRow (torrent), create and populate a <article> element based on the CardsView

            let torrentId = tableRow.querySelector('a[href^="https://clearjav.com/torrents/download/"]').href.match(/\/download\/(\d+)/)[1]
            let moviesId = tableRow.querySelector('a[href^="https://clearjav.com/movies/"]').href.match(/\/movies\/(\d+)/)[1]

            let torrentResolution = tableRow.querySelector('td.torrent-search--list__format .torrent-search--list__resolution').innerText
            let torrentSource = tableRow.querySelector('td.torrent-search--list__format .torrent-search--list__type').innerText
            let torrentSize = tableRow.querySelector('td.torrent-search--list__size').innerText

            let seederCount = tableRow.querySelector('td.torrent-search--list__seeders').innerText
            let leecherCount = tableRow.querySelector('td.torrent-search--list__leechers').innerText
            let completedCount = tableRow.querySelector('td.torrent-search--list__completed').innerText

            let coverURL = tableRow.querySelector('div.torrent-search--hover__info img').src

            let torrentTitle = tableRow.querySelector('div.torrent-search--list__name div.video-title').innerText
            let uploaderElement = tableRow.querySelector('span.torrent-search--list__uploader > a')
            uploaderElement != null ? uploaderElement = uploaderElement.outerHTML : uploaderElement = `<span class="user-tag fas fa-eye-slash torrent-search--list__uploader"> (Anonymous) </span>`

            let torrentAgeElement = tableRow.querySelector('td.torrent-search--list__age > time').outerHTML

            let cardArticleElement = document.createElement('article')
            cardArticleElement.className = 'torrent-card'
            cardArticleElement.setAttribute('data-coverup_cardcovers', 'true')
            cardArticleElement.innerHTML = `
    <header class="torrent-card__header">
        <div class="torrent-card__left-header">
            <span class="torrent-card__resolution">
                🖥️ ${torrentResolution}
            </span>
            <span class="torrent-card__meta-separator">★</span>
            <span class="torrent-card__type">${torrentSource}</span>
            <span class="torrent-card__meta-separator">★</span>
            <span class="torrent-card__size">${torrentSize}</span>
        </div>
        <div class="torrent-card__right-header">
            <a class="torrent-card__seeds torrent__seeder-count" href="https://clearjav.com/torrents/${torrentId}/peers">
                <i class="fas fa-arrow-up"></i>
                ${seederCount}
            </a>
            <span class="torrent-card__meta-separator">•</span>
            <a class="torrent-card__leeches torrent__leecher-count" href="https://clearjav.com/torrents/${torrentId}/peers">
                <i class="fas fa-arrow-down"></i>
                ${leecherCount}
            </a>
            <span class="torrent-card__meta-separator">•</span>
            <a class="torrent-card__completed torrent__times-completed-count" href="https://clearjav.com/torrents/${torrentId}/history">
                <i class="fas fa-check"></i>
                ${completedCount}
            </a>
        </div>
    </header>
    <aside class="torrent-card__aside" style="background-image: url('${coverURL}');">
        <a class="torrent-card__similar-link" href="https://clearjav.com/movies/${moviesId}">
            <figure class="torrent-card__figure">
                <img class="torrent-card__image" src="${coverURL}" alt="Similar Torrents" loading="lazy">
            </figure>
        </a>
    </aside>
    <div class="torrent-card__body">
        <h2 class="torrent-card__title" title="${torrentTitle}">
            <a class="torrent-card__link max-2-lines" href="https://clearjav.com/movies/${moviesId}">
                ${torrentTitle}
            </a>
        </h2>

            </div>
    <footer class="torrent-card__footer">
        <div class="torrent-card__left-footer">
            <address class="torrent-card__uploader">
                <span class="user-tag" style="background-image: none;">
                    ${uploaderElement}
                </span>
            </address>
            <span class="torrent-card__meta-separator">★</span>
            ${torrentAgeElement}
        </div>
        <div class="torrent-card__right-footer">
                            <a class="form__standard-icon-button" href="https://clearjav.com/torrents/download/${torrentId}">
                    <i class="fas fa-download"></i>
                </a>
                    </div>
    </footer>
`

            articlesHolder.appendChild(cardArticleElement)

            tableRow.setAttribute('data-coverup_cardcovers', 'true')

        }

        // The styles that will be applied to CardCovers (and at the same time override normal CardView)
        GM_addStyle(`
            div.torrent-search--card__results {
                grid-gap: 1rem;
                grid-template-columns: repeat(auto-fit,minmax(${cardWidthMinimum}, 1fr));
            }

            article.torrent-card {
               min-width: ${cardWidthMinimum};
               border-radius: 8px;
               height: unset;
               grid-template-rows: 40px ${coverHeight} 55px 40px;
               grid-template-areas: "header header" "poster poster" "body body" "footer footer";
            }

            aside.torrent-card__aside {
                background-size: 100% 100%;
            }

            aside.torrent-card__aside .torrent-card__image {
                object-fit: contain;
            }

            figure.torrent-card__figure {
                width: unset;
                height: ${coverHeight};
                backdrop-filter: blur(20px)
            }

            div.torrent-card__body {
                padding: 13px 13px;
            }


        `)

        // Insert the new articles and remove the table rows
        listViewElement.insertAdjacentElement('beforebegin', articlesHolder)
        listViewElement.remove()

    }

}
