// ==UserScript==
// @name 		MAM - SearchParty
// @author 		WirlyWirly
// @version     2.5
// @description It's a search party! 🥳 Custom search bars and quick-search icons throughout the site

// @match 		https://www.myanonamouse.net/*

// @icon 		https://www.myanonamouse.net/favicon.ico
// @namespace 	https://github.com/WirlyWirly
// @run-at 		document-end

// @resource    gmcFrameCSS https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/GMConfig/gmcFrameStylesheet.css?raw=true

// @require     https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/GMConfig/gmcSettingsImportExport.js?raw=true
// @require     https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js

// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_registerMenuCommand
// @grant       GM_setValue

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/MyAnonaMouse/SearchParty.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SearchParty.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SearchParty.user.js?raw=true
// ==/UserScript==

// ----------------------------------- UserScript --------------------------------------

// =================================== CONFIG MENU ======================================

let configFrame = document.createElement('div')
configFrame.classList.add('gmcFrame')
document.body.appendChild(configFrame)

let reloadWindow = false
GM_config.init({
    'id': 'MAM_SearchParty',
    'frame': configFrame,
    'title': `
            <div>
                <a class="headerMainText" href="${GM_info.script.homepage}" target="_blank">SearchParty</a>
            </div>

            <div class="headerSubText">
                ★ Hover over settings for details ★
            </div>
    `,

    'fields': {
        // ------------------ Settings Import\Export ------------------

        'settingsImport' : {
            'label': 'Import Settings',
            'type': 'button',
            'click': () => { importGMConfigSettings(GM_config.id, GM_info.script.version) },
        },

        'settingsExport' : {
            'label': 'Export Settings',
            'type': 'button',
            'click': () => { exportGMConfigSettings('SearchParty', GM_config.id, GM_info.script.version) },
        },

        // ------------------ OPTIONS ------------------

        'authorIcons': {
            'label': 'Author Icons 🧑',
            'type': 'checkbox',
            'default': true,
            'title': 'Display quick-search icons for each author of a torrent'
        },
        'narratorIcons': {
            'label': 'Narrator Icons 🧑',
            'type': 'checkbox',
            'default': true,
            'title': 'Display quick-search icons for each narrator of a torrent'
        },
        'seriesIcons': {
            'label': 'Series Icons 📚',
            'type': 'checkbox',
            'default': true,
            'title': 'Display quick-search icons for each series of a torrent'
        },

        'oldSearchLinks': {
            'label': 'Old Search Links',
            'type': 'checkbox',
            'default': true,
            'title': "Replace various 'search.php' links (new search page) with 'browse.php' links (old search page)",
        },


        'iconsFontSize': {
            'label': 'Icon FontSize',
            'type': 'text',
            'default': '125%',
            'title': "The fontSize of the emoji icons; Any percentile or CSS 'font-size' value",
        },

        // ------------------ BANNER BARS ------------------

        'searchbar1Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': ''
        },
        'searchbar1Text': {
            'label': '',
            'type': 'text',
            'default': 'Torrents 🔍',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab",
            'sectin': ['Banner Bars']
        },
        'searchbar1URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[cat][]=0&tor[main_cat]=0',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar2Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar2Text': {
            'label': '',
            'type': 'text',
            'default': 'AudioBooks 🎧',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar2URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[cat][]=0&tor[main_cat]=13',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar3Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar3Text': {
            'label': '',
            'type': 'text',
            'default': 'eBooks 📗',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar3URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[cat][]=0&tor[main_cat]=14',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar4Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar4Text': {
            'label': '',
            'type': 'text',
            'default': 'Series 📚',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar4URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[srchIn]=Series',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar5Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar5Text': {
            'label': '',
            'type': 'text',
            'default': 'Comics 🦸',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar5URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[cat][]=61',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar6Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar6Text': {
            'label': '',
            'type': 'text',
            'default': 'Audible 🔗',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar6URL': {
            'label': '',
            'type': 'text',
            'default': '#https://www.audible.com/search?keywords={SearchText}',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar7Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar7Text': {
            'label': '',
            'type': 'text',
            'default': 'Goodreads 🔗',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar7URL': {
            'label': '',
            'type': 'text',
            'default': '#https://www.goodreads.com/search?q={SearchText}',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

    },

    "events": {

        "open": function (doc) {

            reloadWindow = false

            // Collapse Searchbar fields into a single row
            for (let i = 1; i <= 7; i++) {
                let checkboxRowElement = doc.getElementById(`MAM_SearchParty_field_searchbar${i}Enabled`).parentElement
                let searchTextElement = doc.getElementById(`MAM_SearchParty_field_searchbar${i}Text`)
                searchTextElement.setAttribute('style', 'margin: 2%; width: 30%')
                let searchURLElement = doc.getElementById(`MAM_SearchParty_field_searchbar${i}URL`)

                searchTextElement.parentElement.remove()
                searchURLElement.parentElement.remove()

                checkboxRowElement.appendChild(searchTextElement)
                checkboxRowElement.appendChild(searchURLElement)
            }

            // ================ GMC ButtonsHolder ================

            let gmcPanel = this.frame

            // If there is a welcomeMessage element, remove it so that it's not creating a gap
            let welcomeMessage = gmcPanel.querySelector('div[id*=welcomeMessage]')
            welcomeMessage != null ? welcomeMessage.remove() : null

            let buttonsHolderElement = gmcPanel.querySelector('div:has(> button.saveclose_buttons)')

            // --- Settings Import\Export ---
            let exportButton = gmcPanel.querySelector('input[id$="_settingsExport"]')
            exportButton.classList.add('saveclose_buttons')

            let importButton = gmcPanel.querySelector('input[id$="_settingsImport"]')
            importButton.classList.add('saveclose_buttons')

            buttonsHolderElement.appendChild(importButton)
            buttonsHolderElement.appendChild(exportButton)

            // --- Version Element ---
            let versionSVG = '<svg width="16" height="16" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_730_27136)"><path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" fill="#FFFFFFF6"/></g><defs><clipPath id="clip0_730_27136"><rect width="98" height="96" fill="white"/></clipPath></defs></svg>'

            let versionElement = document.createElement('a')
            versionElement.classList = 'version reset'
            versionElement.title = 'Go to Homepage'
            versionElement.target = '_blank'
            versionElement.href = `${GM_info.script.homepage}`
            versionElement.innerHTML = `${versionSVG} Version ${GM_info.script.version}`

            buttonsHolderElement.appendChild(versionElement)

            // Add clicked button animation class
            let saveButtons = buttonsHolderElement.querySelectorAll('.saveclose_buttons')
            for ( let button of saveButtons) {
                button.addEventListener('click', () => {
                button.classList.add('clicked')
                setTimeout(() => button.classList.remove('clicked'), 800)
                })
            }

            // Remove the now empty <div> elements
            for ( let emptyElement of gmcPanel.querySelectorAll('div.config_var:empty') ) {
                emptyElement.remove()
            }

        },

        "save": function () {
            reloadWindow = true
            // Clear cached data when settings are saved
            GM_listValues().forEach(key => {
                if (key !== GM_config.id) {
                    GM_setValue(key, null)
                }
            })
        },

        "close": function () {
            if (reloadWindow) {
                if (this.frame) {
                    window.location.reload()
                } else {
                    setTimeout(() => {
                        window.location.reload()
                    }, 250)
                }
            }
        },

        "reset": function () {
            // Handle reset functionality
            if (typeof resetToDefaults === 'function') {
                resetToDefaults()
            }
        }

    },

    'css': `

        ${GM_getResourceText('gmcFrameCSS')}

        :root {

            /* ---------- UserScript Specific ---------- */
            --frameWidth: 380px;
            --frameHeight: auto;
            --frameInset: 2% 2% auto auto;
            --buttonContainerWidth: 75%;

        }

        /* ================== USERSCRIPT ================== */

        #MAM_SearchParty .config_var {
            align-items: center;
            border-bottom: none;
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-bottom: 0px;
            margin-left: auto;
            margin-right: auto;
            margin-top: 6px;
            padding: 0px;
            text-align: left;
            max-width: 90%;
            width: 100%;
        }

        #MAM_SearchParty_field_iconsFontSize {
            width: 50px !important;
        }

    `
})

// Register the menu command to open settings
GM_registerMenuCommand('🛠️ Settings', () => {
    GM_config.open()
})

GM_config.open()

// =================================== CODE ======================================

const authorIcons = GM_config.get('authorIcons')
const narratorIcons = GM_config.get('narratorIcons')
const seriesIcons = GM_config.get('seriesIcons')

const iconsFontSize = GM_config.get('iconsFontSize')
const oldSearchLinks = GM_config.get('oldSearchLinks')

// ----------------------------------- SearchBars --------------------------------------

// The element that will hold the search bars, inserted below the site banner
let searchBarsRowElement = document.createElement('div')
searchBarsRowElement.setAttribute('class', 'flexbox fbCen')

let navBar = document.getElementById('preNav')
navBar.parentElement.insertBefore(searchBarsRowElement, navBar)

for ( let i = 1; i <=7 ; i++ ) {
    // Generate a searchbar for each enabled config

    let itemEnabled = GM_config.get(`searchbar${i}Enabled`)
    let itemText = GM_config.get(`searchbar${i}Text`)
    let itemURL = GM_config.get(`searchbar${i}URL`)

    if ( itemEnabled == false ) {
        // This searchbar # is disabled, skip creation
        continue
    }

    let searchInput = document.createElement('input')
    searchInput.setAttribute('type', 'text')
    searchInput.setAttribute('placeholder', itemText)
    searchInput.setAttribute('class', 'ac_combined ui-autocomplete-input')
    searchInput.setAttribute('autocomplete', 'off')
    searchInput.setAttribute('size', '15')
    searchInput.setAttribute('style', 'text-align: center; margin-top: 2pt; margin-bottom: 5pt; margin-right: 5pt')

    searchInput.addEventListener('keypress', function(event) {

        if (event.key == 'Enter') {

            let url = itemURL.replace(/({SearchText}|__SearchText__)/i, `${encodeURIComponent(this.value)}`)

            if ( itemURL.match(/^#/) ) {
                // Open the search in a new tab
                this.value = ''
                window.open(url.substring(1))

            } else {
                // Open the search in the current tab
                window.location = url
            }

        }

    })

    searchBarsRowElement.appendChild(searchInput)

}

function quickSearchIcons(hrefElements, hrefType) {
    // For the provided <a> elements, generate and append the appropriate quickSearch icons

    for ( let element of hrefElements ) {
        // Generate the appropriate type of search icons for each provided <a> element

        let searchId
        hrefType == 'series' ? searchId = element.href.match(/series=(\d+)/)[1] : null
        hrefType == 'author' ?  searchId = element.href.match(/author=(\d+)/)[1] : null
        hrefType == 'narrator' ? searchId = element.href.match(/narrator=(\d+)/)[1] : null


        if ( searchId == undefined ) {
            // There was no search id found for this element, cannot create quickSearch icons
            console.log('none')
            continue
        }

        let authorURLS = {
            // The URLS that a user can pick from after clicking on the author name
            'authorEbooks' : `https://www.myanonamouse.net/tor/browse.php?author=${searchId}&tor%5Bcat%5D%5B%5D=0&tor%5Bmain_cat%5D=14`,
            'authorAudiobooks' : `https://www.myanonamouse.net/tor/browse.php?author=${searchId}&tor%5Bcat%5D%5B%5D=0&tor%5Bmain_cat%5D=13`,
            'authorAll' : `https://www.myanonamouse.net/tor/browse.php?author=${searchId}&tor%5Bcat%5D%5B%5D=0`,
        }

        let narratorURLS = {
            // The URLS that a user can pick from after clicking on the narrator name
            'narratorAudiobooks': `https://www.myanonamouse.net/tor/browse.php?narrator=${searchId}&tor%5Bcat%5D%5B%5D=0&tor%5Bmain_cat%5D=13`,
        }

        let seriesURLS = {
            // The URLS that a user can pick from after clicking on the series name
            'seriesEbooks' : `https://www.myanonamouse.net/tor/browse.php?series=${searchId}&tor[cat][]=0&tor[main_cat]=14`,
            'seriesAudiobooks' : `https://www.myanonamouse.net/tor/browse.php?series=${searchId}&tor[cat][]=0&tor[main_cat]=13`,
            'seriesAll' : `https://www.myanonamouse.net/tor/browse.php?series=${searchId}&tor[cat][]=0&tor[main_cat]=0`,
        }


        if ( hrefType == 'author' ) {
            // Apply the quickSearch icons for authors

            for ( let key in authorURLS ) {

                let quickSearchElement = document.createElement('a')
                quickSearchElement.href = authorURLS[key]
                quickSearchElement.classList = 'MAM-SP-QuickSearchIcon'
                quickSearchElement.style.fontSize = iconsFontSize

                if ( key == 'authorAll' ) {
                    quickSearchElement.text = '🔍'
                } else if ( key == 'authorAudiobooks') {
                    quickSearchElement.text = '🎧'
                } else if ( key == 'authorEbooks') {
                    quickSearchElement.text = '📗'
                }

                element.insertAdjacentElement('afterend', quickSearchElement)
            }

        } else if ( hrefType == 'narrator' ) {
            // Apply the quickSearch icons for narrators

            for ( let key in narratorURLS ) {

                let quickSearchElement = document.createElement('a')
                quickSearchElement.href = narratorURLS[key]
                quickSearchElement.classList = 'MAM-SP-QuickSearchIcon'
                quickSearchElement.style.fontSize = iconsFontSize

                if ( key == 'narratorAudiobooks' ) {
                    quickSearchElement.text = '🔍'
                }

                element.insertAdjacentElement('afterend', quickSearchElement)

            }

        } else if ( hrefType == 'series' ) {
            // Apply the quickSearch icons for narrators

            for ( let key in seriesURLS ) {

                let quickSearchElement = document.createElement('a')
                quickSearchElement.href = seriesURLS[key]
                quickSearchElement.classList = 'MAM-SP-QuickSearchIcon'
                quickSearchElement.style.fontSize = iconsFontSize

                if ( key == 'seriesAll' ) {
                    quickSearchElement.text = '🔍'
                } else if ( key == 'seriesAudiobooks') {
                    quickSearchElement.text = '🎧'
                } else if ( key == 'seriesEbooks') {
                    quickSearchElement.text = '📗'
                }

                element.insertAdjacentElement('afterend', quickSearchElement)

            }

        }

    }
}


function replaceBrowseLink(elements) {
    // For the provided <a> element, replace 'search.php' (new search page) with 'browse.php' (old search page)

    for ( let element of elements ) {
        element.href = element.href.replace('search\.php', 'browse\.php')
    }
}


pageURL = document.URL

if ( authorIcons || narratorIcons || seriesIcons ) {

    if ( pageURL.match(/\/tor\/browse\.php/) || pageURL.match(/myanonamouse\.net\/?$/) || pageURL.match(/\/tor\/search\.php/) || pageURL.match(/top10Tor\.php/) ) {
        // These pages require a MutationObserver
        // --- Bookmarks | Browse | Homepage | Search | Top10 ---

        let observer = new MutationObserver(function(mutations) {
            // Functionality to run when changes are detected to the target element

            try {

                // Query for all torrentRows in the target observer
                torrentRows = mutations[0]['target'].querySelectorAll('tr.torrentInfo')

                for ( let torrentRow of torrentRows ) {
                    // Loop through each individual torrentRow, adding search icons to each series of the torrent

                    if ( authorIcons == true ) {
                        // Author quickSearch icons
                        let authorElements = torrentRow.querySelectorAll('a.author[href^="/tor/browse.php?author="], a.author[href^="/tor/search.php?author="]')
                        authorElements.length > 0 ? quickSearchIcons(authorElements, 'author') : null
                    }

                    if ( narratorIcons == true ) {
                        // Narrator quickSearch icons
                        let narratorElements = torrentRow.querySelectorAll('a.narrator[href^="/tor/browse.php?narrator="], a.narrator[href^="/tor/search.php?narrator="]')
                        narratorElements.length > 0 ? quickSearchIcons(narratorElements, 'narrator') : null
                    }

                    if ( seriesIcons == true ) {
                        // Series quickSearch icons
                        let seriesElements = torrentRow.querySelectorAll('a.series[href^="/tor/browse.php?series="], a.series[href^="/tor/search.php?series="]')
                        seriesElements.length > 0 ? quickSearchIcons(seriesElements, 'series') : null
                    }

                }

            } catch(error) {
                console.log(error)
                return

            }
        })

        let target = document.getElementById("ssr")
        let config = { childList: true }

        pageURL.match(/\/top10Tor\.php/) ? target = document.getElementById('top10') : null // Top 10

        // Monitor the target element for any changes
        observer.observe(target, config)

    } else if ( pageURL.match(/\/t\/\d+/) ) {
        // --- Details ---

        if ( authorIcons == true ) {
            // Author quickSearch icons
            let authorElements = document.querySelectorAll('#torDetMainCon a[href^="/tor/search.php?author="]')

            if ( authorElements.length > 0 ) {
                quickSearchIcons(authorElements, 'author')
                oldSearchLinks == true ? replaceBrowseLink(authorElements) : null
            }

        }

        if ( narratorIcons == true ) {
            // Narrator quickSearch icons
            let narratorElements = document.querySelectorAll('#torDetMainCon a[href^="/tor/search.php?narrator="]')

            if ( narratorElements.length > 0 ) {
                quickSearchIcons(narratorElements, 'narrator')
                oldSearchLinks == true ? replaceBrowseLink(narratorElements) : null
            }
        }

        if ( seriesIcons == true ) {
            // Series quickSearch icons
            let seriesElements = document.querySelectorAll('#torDetMainCon a[href^="/tor/search.php?series="]')

            if ( seriesElements.length > 0 ) {
                quickSearchIcons(seriesElements, 'series')
                oldSearchLinks == true ? replaceBrowseLink(seriesElements) : null
            }

        }


    }
}
