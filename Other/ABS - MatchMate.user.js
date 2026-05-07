// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        ABS - MatchMate
// @author      WirlyWirly
// @version     0.3
// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Other/ABS%20-%20MatchMate.user.js
// @description A buddy to help out when matching book in AudioBookShelf
//              Written on LibreWolf via Violentmonkey
// @namespace   UserScript
// @run-at      document-end

// ----------------------------------- Matches --------------------------------------

// @match       http://192.168.1.105:80/audiobookshelf/*
// @include     /https?://.+/audiobookshelf/.+/

// ----------------------------------- Permissions --------------------------------------

// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_info
// @grant       GM_listValues
// @grant       GM_registerMenuCommand
// @grant       GM_setValue

// ----------------------------------- Dependencies --------------------------------------

// @require     https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/waitForElement.js
// @require     https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js

// ----------------------------------- Script Links --------------------------------------

// @icon        https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/monkey.png?raw=true

// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/ABS%20-%20MatchMate.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/ABS%20-%20MatchMate.user.js?raw=true

// ==/UserScript==

// =================================== CODE ======================================

let pageURL = document.URL
let absURL = pageURL.match(/^(.+?\/audiobookshelf)\//)[1]

async function main() {
    // Observer the <body> children until the edit panel is loaded, and then apply the main event listener to the Match tab

    let modalOverlay = await waitForElement('body > div.modal', document.body, false)
    let editPanel = await waitForElement('div.relative:has(#formWrapper)', modalOverlay)

    let matchTabButton = editPanel.querySelector('div.absolute[role="tablist"] :nth-child(5)')
    matchTabButton.addEventListener('mouseup', async function(event) {
        // The match tab of the edit panel was clicked

        await waitForElement('#match-wrapper', editPanel)

        // Check if this match tab does not have a 'Title' button, indicating it needs a MutationObserver
        !editPanel.querySelector('button.mmTitleSearch') ? matchTabObservation() : null

    })

    // The top-most element that will be used to display the enlarged cover image
    let hoverCoverElement = document.createElement('div')
    document.body.appendChild(hoverCoverElement)
    hoverCoverElement.outerHTML = `<div id="mmHoverCover"><img src="" style="border-radius: 10px; max-height: 100%; max-width: 100%"></div>`

}


// =================================== FUNCTIONS ======================================

async function matchTabObservation() {
    // Setup Mutation observation in the match tab and act on any new results

    let editPanel = document.querySelector('div.relative:has(> div[role="tablist"]')
    let matchTab = editPanel.querySelector('#match-wrapper')

    // Create the 'Title' search button
    let titleSearchButton = document.createElement('button')
    titleSearchButton.innerText = 'Title'
    titleSearchButton.setAttribute('class', 'mmTitleSearch abs-btn rounded-md shadow-md relative border border-gray-600 mt-5 ml-1 text-white bg-primary px-8 py-2')
    titleSearchButton.title = 'Fill the search field with the current title'
    matchTab.querySelector('form > div').appendChild(titleSearchButton)
    titleSearchButton.addEventListener('mouseup', function(event) {
        // The actions to take when the 'Title' button is clicked

        if ( event.button == 0 ) {
            observer.disconnect()
            titleSearch()
        }

    })

    let observer = new MutationObserver(async function(mutations) {
        // Actions to take when there are changes in the match tab

        let allMatchResults = matchTab.querySelectorAll('div.matchListWrapper div.cursor-pointer:not(.mmProcessing, .mmDone)')

        if ( allMatchResults.length > 0  ) {
            // There are new match results
            allMatchResults.forEach(element => {element.classList.add('mmProcessing')})

            // Remove a previous cover if present
            let previousCover = matchTab.querySelectorAll('div:has(> img.currentCover)')
            if ( previousCover.length > 0 ) {
                previousCover.forEach(element => {element.remove()})
            }

            // --- Use the first match to get the current cover ---
            allMatchResults[0].click()

            // Wait until the submit button is available, indicating the form details are ready
            let submitButton = await waitForElement('button.bg-success[type="submit"]', matchTab)
            let coverURL = matchTab.querySelector('form img[src*="/api/items/"]').src

            // Click the back arrow to return to match results
            let backArrowElement = matchTab.querySelector('div.absolute div.cursor-pointer')
            backArrowElement.click()

            let currentCoverElement = document.createElement('div')
            matchTab.querySelector('form > div').firstChild.insertAdjacentElement('beforebegin', currentCoverElement)

            currentCoverElement.title = 'The current cover for this book'
            currentCoverElement.classList.add('currentCover')
            currentCoverElement.innerHTML = `<img class="currentCover" src="${coverURL}">`

            currentCoverElement.addEventListener('mouseover', function(event) {
                let { clientX, clientY } = event
                enlargeCover(this.parentElement.querySelector('img').src, clientX, clientY)
            })

            currentCoverElement.addEventListener('mouseout', function(event) {
                let hoverCoverElement = document.getElementById('mmHoverCover')
                hoverCoverElement.classList.remove('active')
            })

            for ( let matchResult of allMatchResults ) {

                setTimeout(() => {
                    // Match Cover Dimensions
                    let matchCover = matchResult.querySelector('img')

                    let dimensionsElement = document.createElement('div')
                    dimensionsElement.classList.add('mmMatchDimensions')
                    dimensionsElement.innerText = `${matchCover.naturalWidth} x ${matchCover.naturalHeight}`
                    matchCover.parentElement.insertAdjacentElement('afterend', dimensionsElement)

                    dimensionsElement.addEventListener('mouseover', function(event) {

                        let { clientX, clientY } = event
                        enlargeCover(this.parentElement.querySelector('img').src, clientX, clientY)

                    })

                    dimensionsElement.addEventListener('mouseout', function(event) {
                        let hoverCoverElement = document.getElementById('mmHoverCover')
                        hoverCoverElement.classList.remove('active')
                    })

                }, 500)

                // Save + Tag Button
                let saveTagButton = document.createElement('button')
                saveTagButton.innerText = `Save + 🏷️`
                saveTagButton.title = `Save this match, add the custom tags, then continue to the next book`
                saveTagButton.classList.add('saveMatchTags', 'matchMateButton')
                saveTagButton.addEventListener('mouseup', function(event) {

                    if ( event.button == 0 ) {

                        if ( apiKey == '' ) {
                            window.alert('❌ MatchMate ❌\n\nThis button requires a valid ApiKey\n\nProvide an ApiKey from the settings panel then try again')
                            return
                        } else {
                            observer.disconnect()
                            saveMatch(this, saveTagsList)
                        }
                    }

                })

                // Save Button
                let saveMatchButton = document.createElement('button')
                saveMatchButton.innerText = 'Save Match'
                saveMatchButton.title = "Save this match then continue to the next book\n\nℹ️ This is the same as clicking the 'Submit' button of the match"
                saveMatchButton.classList.add('saveMatch', 'matchMateButton')
                saveMatchButton.addEventListener('mouseup', function(event) {
                    event.button == 0 ? saveMatch(this) : null
                    observer.disconnect()
                })

                // Audible Button
                let asinButton = document.createElement('button')
                asinButton.innerText = 'Audible'
                asinButton.title = 'Open the Audible page of this match\n\nℹ️ Only works if the match has an ASIN'
                asinButton.classList.add('asinSearch', 'matchMateButton')
                asinButton.addEventListener('mouseup', function(event) {
                    event.button == 0 ? audibleLookup(this) : null
                })

                matchResult.insertAdjacentElement('afterend', asinButton)
                matchResult.insertAdjacentElement('afterend', saveMatchButton)
                matchResult.insertAdjacentElement('afterend', saveTagButton)

                matchResult.classList.add('mmDone')

            }

        } else {
            setTimeout(() => {
                // If there are no results, try a Title search

                let matchWrapper = document.getElementById('match-wrapper').querySelector('div.matchListWrapper')

                // Make sure a Title search has not already been made
                if ( !matchWrapper.classList.contains('mmTitleSearchReady') && matchWrapper.childElementCount == 0 ) {
                    observer.disconnect()
                    titleSearch()
                }

            }, 1000)
        }
    })

    let target = document.getElementById('match-wrapper').querySelector('div.matchListWrapper')
    let config = { childList: true }
    observer.observe(target, config)

}


async function titleSearch() {
    // The 'Title' search button of the match tab was clicked

    // The floating Edit panel
    let editPanel = document.querySelector('div.relative:has(> div[role="tablist"]')

    // Switch to the details tab
    editPanel.querySelector('div[role="tablist"] :nth-child(1)').click()

    // Wait until the details tab is ready, then get the book title
    let detailsTab = await waitForElement('#formWrapper', editPanel)
    let bookTitle = editPanel.querySelector('#formWrapper input[placeholder="Title"]').value
    //let author = editPanel.querySelector('#formWrapper input[placeholder="Author"]').value

    // Return to the match tab and wait until it's ready
    editPanel.querySelector('div[role="tablist"] :nth-child(5)').click()
    let matchTab = await waitForElement('#match-wrapper', editPanel)

    // Start the match tab observation
    matchTabObservation()

    setTimeout(() => {
        // Update the Search title and click the search button
        let matchTab = document.getElementById('match-wrapper')
        let searchField = matchTab.querySelector('form input[placeholder="Search.."]')
        searchField.value = bookTitle

        // Update the Search field label
        searchField.parentElement.previousElementSibling.innerText = '📖 The title is ready! Click this input, add a space, then hit Search!'
        searchField.parentElement.previousElementSibling.style.textShadow = '0px 0px 8px rgb(22, 84, 0)'

        // Add a class to indicate that a title search has already been done
        matchTab.querySelector('div.matchListWrapper').classList.add('mmTitleSearchReady')

        // -- NOT WORKING --
        matchTab.querySelector('form > div > button').click()
    }, 500)

}


function enlargeCover(imgURL, clientX, clientY) {

    let hoverCoverElement = document.getElementById('mmHoverCover')
    hoverCoverElement.querySelector('img').src = imgURL
    hoverCoverElement.classList.add('active')

    let positionY =
      clientY + hoverCoverElement.scrollHeight >= window.innerHeight
        ? window.innerHeight - hoverCoverElement.scrollHeight - 20
        : clientY + 20;
    let positionX =
      clientX + hoverCoverElement.scrollWidth >= window.innerWidth
        ? window.innerWidth - hoverCoverElement.scrollWidth - 20
        : clientX + 20;

    hoverCoverElement.style.top = `${positionY}px`
    hoverCoverElement.style.left = `${positionX}px`

}


async function saveMatch(matchButton, additionalTags = false) {
    // The 'Save' button of a bookResult was clicked

    // The floating Edit panel
    let editPanel = document.querySelector('div.relative:has(> div[role="tablist"]')

    // Click the book item, which will load the new data
    matchButton.parentElement.querySelector('div').click()


    // Wait until the submit button is available, then click it
    let submitButton = await waitForElement('button.bg-success[type="submit"]', editPanel.querySelector('#match-wrapper'))

    // Get the absId from the current cover
    let absId = editPanel.querySelector('img[src*="/api/items/"]').src.match(/\/items\/(.+?)\//)[1]

    submitButton.click()

    // Wait until the details tab is ready, indicating the match has been saved
    await waitForElement('#formWrapper', editPanel)

    // PATH additional tag(s)
    if ( additionalTags ) {

        // GET the newly saved tags
        let response = await fetch(`${absURL}/api/items/${absId}?token=${apiKey}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        })

        let metadata = await response.json()
        let currentTags = metadata.media.tags

        // PATCH the new + custom tags
        await fetch(`${absURL}/api/items/${absId}/media`, {
            method: 'PATCH',
            body: JSON.stringify({ tags: currentTags.concat(additionalTags) }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
        })

    }

    editPanel.querySelector('div[role="tablist"] :nth-child(5)').click()
    await waitForElement('#match-wrapper', editPanel)
    matchTabObservation()

    // If enabled, change the match window to the previous\next book
    if ( afterSaveDirection != 'None' ) {

        setTimeout(async () =>{
            // check that there is a previous\next book
            editPanel.querySelector(`button[aria-label="${afterSaveDirection}"]`) ? editPanel.querySelector(`button[aria-label="${afterSaveDirection}"]`).click() : null
        }, 500)
    }

}


async function audibleLookup(asinButton) {
    // The 'Audible' lookup button was clicked

    // The floating Edit panel
    let editPanel = document.querySelector('div.relative:has(> div[role="tablist"]')

    // Click the book item, which will load the new data
    asinButton.parentElement.querySelector('div').click()

    // Wait until the submit button is available, indicating the form is available, then get the ASIN
    let submitButton = await waitForElement('button.bg-success[type="submit"]', editPanel.querySelector('#match-wrapper'))

    let asinURL
    try {
        let asinValue = editPanel.querySelector('#match-wrapper input[placeholder="ASIN"]').value
        asinURL = audibleTemplate.replace(/%asin%/, asinValue)
    } catch(error) {}

    // Click the back arrow to return to match results
    let backArrowElement = editPanel.querySelector('#match-wrapper div.absolute div.cursor-pointer')
    backArrowElement.click()

    asinURL ? window.open(asinURL, '_blank') : asinButton.innerText = 'No ASIN'

}


// =================================== GM_CONFIG ======================================

let configFrame = document.createElement('div')
document.body.appendChild(configFrame)
let reloadWindow
GM_config.init({
    'id': 'matchMate',
    'frame': configFrame,
    'title': `
        <a id="matchMateHeader" href="${GM_info.script.homepage}" target="_blank">MatchMate</a><br>
        <div>★ Hover over emojis for details ★</div>
    `,

    'fields': {
        'matchPanelWidth': {
            'label': '↔️ Match Panel Width',
            'type': 'text',
            'default': '1200px',
            'title': 'The width of the edit panel when the Match tab is active'
        },

        'matchPanelHeight': {
            'label': '↕️ Match Panel Height',
            'type': 'text',
            'default': '80%',
            'title': 'The height of the edit panel when the Match tab is active'
        },

        'currentCoverHeight': {
            'label': '🖼️ Current Cover Height',
            'type': 'text',
            'default': '75px',
            'title': 'The maximum height of the current cover displayed above the match results'
        },

        'matchCoverHeight': {
            'label': '🖼️ Match Cover Height',
            'type': 'text',
            'default': '192px',
            'title': 'The maximum height of the cover displayed by each match result'
        },

        'hoverCoverHeight': {
            'label': '🖼️ Hover Cover Height',
            'type': 'text',
            'default': '700px',
            'title': 'The maximum height of a cover when hovered over'
        },

        'afterSaveDirection': {
            'label': '🧭 After Save Direction',
            'type': 'select',
            'options': ['Previous', 'Next', 'None'],
            'default': 'Previous',
            'title': 'The direction that will be navigated after the match is saved\n\nPrevious: Down the list\nNext: Up the list\n\nℹ️ This direction corresponds to the navigation arrows on each end of the edit panel'
        },

        'saveTagsList': {
            'label': '🏷️ SaveTags List',
            'type': 'text',
            'default': '',
            'title': "A comma seperated list of tags to apply to the book when clicking the 'Save + 🏷️' button\n\nℹ️ Setting a unique tag is a simple way to later distinguish books that have already been matched"
        },

        'apiKey': {
            'label': '🔑 ApiKey',
            'type': 'text',
            'default': '',
            'title': 'A valid AudioBookShelf ApiKey'
        },

        'audibleTemplate': {
            'label': '🔎 Audible Template',
            'type': 'text',
            'default': 'https://www.audible.com/pd/%asin%',
            'title': "The search template URL that will be used when clicking the 'Audible' button\n\nℹ️ The '%asin%' placeholder will be replaced with the actual ASIN of the match"
        },

    },
    'events': {
        'open': function() {
            reloadWindow = false

        },
        'save': function () {
            // Actions to take when the 'Save' button is clicked
            document.getElementById('matchMate_saveBtn').innerText = '✔️'
            reloadWindow = true

            // Clear cached data when settings are saved
            GM_listValues().forEach(key => {
                if (key !== 'matchMate') {
                    GM_setValue(key, null)
                }
            })

        },
        'close': function () {
            // Actions to take when the 'Close' button is clicked
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
        'reset': function () {
            // Actions to take when the 'Reset' button is clicked
            if (typeof resetToDefaults === 'function') {
                resetToDefaults()
            }
        }
    }
})


// Register the settings panel to be opened from the UserScript manager dialouge
GM_registerMenuCommand('Settings', () => {
    GM_config.open()
})

// Get the saved GM_config settings
let matchPanelHeight = GM_config.get('matchPanelHeight')
let matchPanelWidth = GM_config.get('matchPanelWidth')

let currentCoverHeight = GM_config.get('currentCoverHeight')
let matchCoverHeight = GM_config.get('matchCoverHeight')
let hoverCoverHeight = GM_config.get('hoverCoverHeight')

let afterSaveDirection = GM_config.get('afterSaveDirection')

let saveTagsList = GM_config.get('saveTagsList').split(',')
let apiKey = GM_config.get('apiKey')
let audibleTemplate = GM_config.get('audibleTemplate')


// =================================== Styling ======================================

// Styling the GM_config panel
GM_addStyle(`

    #matchMate {
        backdrop-filter: blur(9px) !important;
        background: #191d2aa3 !important;
        border-radius: 10px !important;
        border: 1px solid #2C3E50 !important;
        box-shadow: 0px 0px 15px #2C3E50 !important;
        color: #ffffff !important;
        height: auto !important;
        inset: 15px 30px auto auto !important;
        line-height: 22px !important;
        margin: 0 !important;
        overflow: auto scroll !important;
        padding: 0px 0px !important;
        position: fixed !important;
        width: 350px !important;
        scrollbar-width: none;
    }

    div#matchMate_header {
        margin: 20px 0px 10px 0px !important;
    }

    #matchMate_header > a {
        text-decoration: none;
        user-select: none;
        font-family: 'Bebas Neue', Helvetica, Tahoma, Geneva, sans-serif;
        background-color: #DAD142;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-filter: brightness(110%);
        filter: brightness(110%);
        text-shadow: 0 0 15px rgba(230, 101, 52, 0.55);
        transition: all 0.3s;
        font-weight: bold;
        padding-top: 3%;
        margin: 0px 0px 5px 0px;
    }

    #matchMate_header > div {
        color: #95a5a6;
        display: block;
        font-size: 12px;
        margin: 5px 0px 0px 0px;

    }

    #matchMate div.config_var {
        margin: 0px 0px 10px 0px;
    }

    #matchMate label.field_label {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        font-weight: normal;
        margin: 0px 0px 0px 20px;

    }
    #matchMate input[type="text"], #matchMate select {
        /* Text Fields */
        background: rgba(255, 255, 255, 0.9);
        border-radius: 3px;
        border: 1px solid #ddd;
        color: #191d2a;
        font-size: 13px;
        font-weight: 400;
        margin: 0px 20px 0 0px;
        position: fixed;
        right: 0px;
        text-align: center;
        transition: all 0.3s ease;
        width: 100px;
    }

    #matchMate select {
        padding: 4px;
    }

    #matchMate #matchMate_field_saveTagsList,
    #matchMate #matchMate_field_apiKey,
    #matchMate #matchMate_field_audibleTemplate {
        width: 155px;
    }

    #matchMate_buttons_holder {
        display: grid;
    }

    button.saveclose_buttons {
        background-color: #2C3E50;
        border-radius: 5px;
        border: none;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        color: #FFFFFF;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        margin: 15px auto 0px auto !important;
        padding: 2px 12px !important;
        width: 50%;
    }

    button.saveclose_buttons:hover {
        background-color: #3a4a5b;
    }

    #matchMate div.reset_holder {
        margin: 10px 20px 20px 0px;
    }

    #matchMate a.reset {
        color: #95a5a6;
    }
`)


GM_addStyle(`

    /* ---------- Edit Panel ---------- */
    div.relative:has(> div > #match-wrapper) {
        /* edit panel size */
        height: ${matchPanelHeight} !important;
        width: ${matchPanelWidth} !important;
    }

    /* ---------- Search Bar Row ---------- */

    div.currentCover {
        /* current cover size */
        max-height: ${currentCoverHeight};
        box-shadow: 0px 0px 10px #000000;
        margin-right: 10px;
        margin-top: -12px;
    }

    img.currentCover {
        /* current cover size */
        max-height: inherit;
        max-width: inherit;
    }

    div:has(> div.currentCover) {
        /* search bar vertical item alignment */
        align-items: end;
    }

    #match-wrapper form div:has( > div > div > input[placeholder="Author"]) {
        /* search author size */
        width: 110px;
    }

    /* ---------- Match Results Grid ---------- */

    div.matchListWrapper {
        /* MatchTab grid view */
        display: grid;
        grid-template-columns: auto auto;
        height: unset;
        max-height: calc(100% - 80px);
        scrollbar-color: #0000 #555;
        scrollbar-width: thin;
    }

    #match-wrapper div:has(> div > img:not(.currentCover)) {
        /* match cover size */
        height: unset;
        max-height: ${matchCoverHeight};
        max-width: ${matchCoverHeight};
        min-width: unset;
        position: relative;
        width: unset;

    }

    div.mmMatchDimensions {
        /* cover dimensions */
        background: #0000006e;
        border-radius: 25px;
        font-size: x-small;
        left: 3px;
        padding: 1px 7px;
        position: absolute;
        top: 5px;
        width: fit-content;
    }


    div.mmProcessing > :nth-child(2) {
        /* match data size */
        width: fit-content;
        max-height: ${matchCoverHeight};
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #555 #0000;
    }

    div.matchListWrapper h1 {
        /* match titles */
        font-weight: 600;
        font-size: 1.1rem;
    }

    div.matchListWrapper div.rounded-full:has(> p) {
        /* match series */
        background-color: #00000080;
    }

    div.matchListWrapper div.rounded-full > p {
        /* match series */
        color: white;
        font-size: .8rem;
        padding: 3px 5px 3px 5px;
    }

    #match-wrapper div:has( > p.text-xs) {
        /* match synopsis size */
        max-height: 100%;
        overflow: initial;
    }

    /* ---------- MatchMate Buttons ---------- */

    button.matchMateButton {
        /* matchMate Button sizes */
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        font-size: medium;
        padding: 3px;
        width: 30%;
        margin: 8px 0px 5px 15px;

    }

    button.saveMatch {

        background-color: #153245;
        border: #B6D3E7 solid 1px;
        color: #B6D3E7;
    }

    button.saveMatch:hover {
        background-color: #224f6d;
    }

    button.saveMatchTags {
        background-color: #113400;
        border: #A0DA83 solid 1px;
        color: #A0DA83;
    }

    button.saveMatchTags:hover {
        background-color: #1d5900;
    }

    button.asinSearch {
        background-color: #431C00;
        color: #F09D63;
        border: #F09D63 solid 1px;
    }

    button.asinSearch:hover {
        background-color: #7C3400;
    }

    /* ---------- Enlarged Cover Hover ---------- */

    #mmHoverCover {
        display: none;
    }

    #mmHoverCover.active {
        /* enlarged img panel */
        border-radius: 10px;
        box-shadow: 0px 0px 13px #000000;
        display: unset;
        max-height: ${hoverCoverHeight};
        max-width: ${hoverCoverHeight};
        position: fixed;
        z-index: 999;
    }

`)

main()
