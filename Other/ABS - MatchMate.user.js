// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        ABS - MatchMate
// @author      WirlyWirly
// @version     0.4
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

    // Observer the <body> child elements until the <div> of the edit panel [data-v-779b4e02] is loaded
    let modalOverlay = await waitForElement('body > div.modal[data-v-779b4e02]', document.body, false)
    let editPanel = await waitForElement('div.relative:has(#formWrapper)', modalOverlay)

    // Set identifiers for the edit panel and important elements
    modalOverlay.id = 'modalOverlay'
    modalOverlay.querySelector('div > h1').id = 'bookTitle'

    editPanel.id = 'editPanel'
    editPanel.querySelector('div[role="tablist"]').id = 'editPanelTabs'
    editPanel.querySelector('div.absolute[role="tablist"] :nth-child(1)').id = 'detailsTab'
    editPanel.querySelector('div.absolute[role="tablist"] :nth-child(2)').id = 'coverTab'
    editPanel.querySelector('div.absolute[role="tablist"] :nth-child(3)').id = 'chaptersTab'
    editPanel.querySelector('div.absolute[role="tablist"] :nth-child(4)').id = 'filesTab'
    editPanel.querySelector('div.absolute[role="tablist"] :nth-child(5)').id = 'matchTab'
    editPanel.querySelector('div.absolute[role="tablist"] :nth-child(6)').id = 'toolsTab'

    editPanel.querySelector('button[aria-label="Previous"]').id = 'cyclePrevious'
    editPanel.querySelector('button[aria-label="Next"]').id = 'cycleNext'

    let matchTabButton = editPanel.querySelector('#matchTab')
    matchTabButton.addEventListener('mouseup', async function(event) {
        // The match tab of the edit panel was clicked

        await waitForElement('#match-wrapper', editPanel)

        // Check if this match tab does not have a 'Title' button, indicating it needs a MutationObserver
        !editPanel.querySelector('#buttonTitle') ? matchTabObservation() : null

    })

    // The top-most element that will be used to display the enlarged cover image
    let hoverCoverElement = document.createElement('div')
    document.body.appendChild(hoverCoverElement)
    hoverCoverElement.outerHTML = `<div id="mmHoverCover"><img src="" style="border-radius: 10px; max-height: 100%; max-width: 100%"></div>`

}


// =================================== FUNCTIONS ======================================

async function matchTabObservation() {
    // Setup Mutation observation in the match tab and act on any new results

    let editPanel = document.querySelector('#editPanel')
    let matchTab = editPanel.querySelector('#match-wrapper')

    // Add identifiers to the various elements
    matchTab.querySelector('form').id = 'searchForm'
    matchTab.querySelector('#searchForm input[placeholder="Search.."]').id = 'inputTitle'
    matchTab.querySelector('#searchForm input[placeholder="Search.."]').parentElement.previousElementSibling.id = 'labelInputTitle'
    matchTab.querySelector('#searchForm input[placeholder="Author"]').id = 'inputAuthor'
    matchTab.querySelector('#searchForm button[type="Submit"]').id = 'buttonSearch'
    matchTab.querySelector('div.matchListWrapper').id = 'resultsList'
    //matchTab.querySelector('#searchForm button[aria-label^="Provider"]').id = 'buttonProvider'

    // Create the 'Title' search button
    let titleSearchButton = document.createElement('button')
    titleSearchButton.id = 'buttonTitle'
    titleSearchButton.innerText = 'Title'
    titleSearchButton.setAttribute('class', 'abs-btn rounded-md shadow-md relative border border-gray-600 mt-5 ml-1 text-white bg-primary px-8 py-2')
    titleSearchButton.title = 'Fill the search field with the current title'
    matchTab.querySelector('form > div').appendChild(titleSearchButton)
    titleSearchButton.addEventListener('mouseup', function(event) {
        // The actions to take when the 'Title' button is clicked
        titleSearch()

    })

    // When manually cycled, clean up the Match tab
    editPanel.querySelector('#cyclePrevious').addEventListener('mouseup', () => { cleanMatchTab() } )
    editPanel.querySelector('#cycleNext').addEventListener('mouseup', () => { cleanMatchTab() } )

    let observer = new MutationObserver(async function(mutations) {
        // Actions to take when there are changes in the match tab

        let allMatchResults = matchTab.querySelectorAll('#resultsList > div > div.cursor-pointer:not(.matchMateResult)')

        if ( allMatchResults.length > 0  ) {
            // There are new match results

            // Remove a previous cover image if present
            matchTab.querySelectorAll('div.currentCover').forEach((element) => { element.remove() })

            for ( let result of allMatchResults ) {
                // For each match, generate the new elements (buttons|coverDimensions)

                // Add classes\identifiers to the various elements in a match result
                result.classList.add('matchMateResult')
                result.parentElement.classList.add('resultContainer')

                result.querySelector(':nth-child(1)').classList.add('resultCover')
                result.querySelector('.resultCover img').classList.add('resultCoverImg')

                result.querySelector(':nth-child(2)').classList.add('resultMeta')
                result.querySelector('.resultMeta > :nth-child(1)').classList.add('resultTitle')
                result.querySelector('.resultMeta > :nth-child(2)').classList.add('resultDetails')
                try{ result.querySelector('.resultMeta > div:has( > div.rounded-full > p)').classList.add('resultSeries') } catch(error) {}
                result.querySelector('.resultMeta > div.overflow-hidden:has(> p)').classList.add('resultSynopsis')

                setTimeout(() => {

                    // Create the Cover Dimensions element
                    let matchCover = result.querySelector('.resultCoverImg')
                    let dimensionsElement = document.createElement('div')
                    dimensionsElement.classList.add('resultCoverDimensions')
                    dimensionsElement.innerText = `${matchCover.naturalWidth} x ${matchCover.naturalHeight}`
                    matchCover.parentElement.insertAdjacentElement('afterend', dimensionsElement)

                    dimensionsElement.addEventListener('mouseover', function(event) {
                        // Display the enlarged result cover
                        let { clientX, clientY } = event
                        viewHoverCover(this.parentElement.querySelector('.resultCoverImg').src, clientX, clientY)
                    })

                    dimensionsElement.addEventListener('mouseout', function(event) {
                        // Stop displaying the enlarged result cover
                        let hoverCoverElement = document.getElementById('mmHoverCover')
                        hoverCoverElement.classList.remove('active')
                    })

                }, 500)

                // The element that will contain the MatchMate buttons
                let buttonHolder = document.createElement('div')
                buttonHolder.classList.add('mmButtonHolder')

                // Save + Tag Button
                let saveTagButton = document.createElement('button')
                saveTagButton.innerText = `Save + 🏷️`
                saveTagButton.title = `Save this match result, add the custom tags, then continue to the next book`
                saveTagButton.classList.add('saveMatchTags', 'matchMateButton')
                saveTagButton.addEventListener('mouseup', function(event) {

                    if ( event.button == 0 ) {

                        if ( apiKey == '' ) {
                            window.alert('❌ MatchMate ❌\n\nThis button requires a valid ApiKey\n\nProvide an ApiKey from the settings panel then try again')
                            return
                        } else {
                            observer.disconnect()
                            saveResult(this, saveTagsList)
                        }
                    }

                })

                // Save Button
                let saveResultButton = document.createElement('button')
                saveResultButton.innerText = 'Save Match'
                saveResultButton.title = "Save this match result then continue to the next book\n\nℹ️ This is the same as clicking the 'Submit' button of the match result"
                saveResultButton.classList.add('saveResult', 'matchMateButton')
                saveResultButton.addEventListener('mouseup', function(event) {
                    event.button == 0 ? saveResult(this) : null
                    observer.disconnect()
                })

                // Audible Button
                let asinButton = document.createElement('button')
                asinButton.innerText = 'Audible'
                asinButton.title = 'Open the Audible page of this match result\n\nℹ️ Only works if the result has an ASIN'
                asinButton.classList.add('asinSearch', 'matchMateButton')
                asinButton.addEventListener('mouseup', function(event) {
                    event.button == 0 ? audibleLookup(this) : null
                })

                buttonHolder.appendChild(saveTagButton)
                buttonHolder.appendChild(saveResultButton)
                buttonHolder.appendChild(asinButton)

                result.parentElement.appendChild(buttonHolder)

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
                viewHoverCover(this.parentElement.querySelector('img').src, clientX, clientY)
            })

            currentCoverElement.addEventListener('mouseout', function(event) {
                let hoverCoverElement = document.getElementById('mmHoverCover')
                hoverCoverElement.classList.remove('active')
            })

        } else {
            // If there are no results after 1000ms, populate the search field with the books Title

            setTimeout(() => {

                let resultsList = document.getElementById('resultsList')

                // Make sure a title search has not already been readied AND that there are 0 results
                if ( resultsList && !resultsList.classList.contains('titleSearchReady') && resultsList.childElementCount == 0 ) {
                    titleSearch()
                }

            }, 1000)
        }
    })

    let target = matchTab.querySelector('#resultsList')
    let config = { childList: true , attributeFilter: ['style'] }
    observer.observe(target, config)

}


function cleanMatchTab() {
    // Clean the match tab of book-specific changes

    let matchTab = document.getElementById('match-wrapper')

    if ( matchTab ) {
        // Remove a previous cover image if present
        matchTab.querySelectorAll('div.currentCover').forEach((element) => { element.remove() })

        // Remove 'Title' search styling and indicators
        let labelTitle = matchTab.querySelector('#labelInputTitle')
        if ( labelTitle.classList.contains('titleSearchReady') ) {
            labelTitle.innerText = 'Search Title or ASIN'
            labelTitle.classList.remove('titleSearchReady')
            matchTab.querySelector('#resultsList').classList.remove('titleSearchReady')
        }

    }

}


async function titleSearch() {
    // The 'Title' search button of the match tab was clicked or there were no results during the search

    let bookTitle = document.getElementById('bookTitle').innerText

    // Update the search field of the Match tab and click the search button
    let matchTab = document.getElementById('match-wrapper')
    let titleField = matchTab.querySelector('#inputTitle')
    titleField.value = bookTitle

    // Remove a previous cover image if present
    matchTab.querySelectorAll('div.currentCover').forEach((element) => { element.remove() })

    // Update the Search field label
    matchTab.querySelector('#labelInputTitle').innerText = '📖 No Results? Try a title search! Just add a space then hit Search!'
    matchTab.querySelector('#labelInputTitle').classList.add('titleSearchReady')

    // Add a class to indicate that a title search has already been readied
    matchTab.querySelector('#resultsList').classList.add('titleSearchReady')

    // -- NOT WORKING --
    matchTab.querySelector('#buttonSearch').click()

}


function viewHoverCover(imgURL, clientX, clientY) {

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


async function saveResult(matchButton, additionalTags = false) {
    // The 'Save' button of a bookResult was clicked

    // The floating Edit panel
    let editPanel = document.getElementById('editPanel')

    // Click the book item, which will load the new data
    matchButton.closest('div.resultContainer').querySelector('div.matchMateResult').click()

    // Wait until the submit button is available, then click it
    let submitButton = await waitForElement('button.bg-success[type="submit"]', editPanel.querySelector('#match-wrapper'))

    // Get the absId from the current cover
    let absId = editPanel.querySelector('img[src*="/api/items/"]').src.match(/\/items\/(.+?)\//)[1]

    submitButton.click()

    // Wait until the details tab is ready, indicating the match has been saved
    await waitForElement('#formWrapper', editPanel)

    // API: Additional tag(s)
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

    editPanel.querySelector('#matchTab').click()
    await waitForElement('#match-wrapper', editPanel)
    matchTabObservation()

    setTimeout(async () =>{
        // If enabled, cycle the match tab to the previous\next book
        cleanMatchTab()
        afterSaveDirection == 'Previous' ? editPanel.querySelector('#cyclePrevious').click() : null
        afterSaveDirection == 'Next' ? editPanel.querySelector('#cycleNext').click() : null
    }, 500)

}


async function audibleLookup(asinButton) {
    // The 'Audible' lookup button was clicked

    // The floating Edit panel
    let editPanel = document.getElementById('editPanel')

    // Click the book item, which will load the new data
    asinButton.closest('div.resultContainer').querySelector('div.matchMateResult').click()

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

    #labelInputTitle.titleSearchReady {
     text-shadow: 0px 0px 8px rgb(22, 84, 0);
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
        scrollbar-color: #7a7a7a #0000;
        scrollbar-width: thin;
        padding: 0px 5px 0px 0px;
        gap: 5px;
    }

    .resultCover {
        /* match cover size */
        height: unset;
        max-height: ${matchCoverHeight};
        max-width: ${matchCoverHeight};
        min-width: unset;
        position: relative;
        width: unset;

    }

    .resultCoverDimensions {
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


    .resultMeta {
        /* match metadata size */
        width: fit-content;
        max-height: ${matchCoverHeight};
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #555 #0000;
    }

    .resultTitle h1 {
        /* match titles */
        font-weight: 600;
        font-size: 1.1rem;
    }

    .resultSeries > div.rounded-full {
        /* match series */
        background-color: #00000080;
    }

    .resultSeries p {
        /* match series */
        color: white;
        font-size: .8rem;
        padding: 3px 5px 3px 5px;
    }

    .resultSynopsis {
        /* match synopsis size */
        max-height: 100%;
        overflow: initial;
    }

    .resultContainer {
        border: none;
    }

    /* ---------- MatchMate Buttons ---------- */


    div.mmButtonHolder {
        display: grid;
        grid-template-columns: repeat(3, auto);
        margin: 5px 15px 5px 0px;
        gap: 15px
    }

    button.matchMateButton {
        /* matchMate Button sizes */
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        font-size: medium;
        padding: 3px;
        width: unset;
    }

    button.saveResult {

        background-color: #153245;
        border: #B6D3E7 solid 1px;
        color: #B6D3E7;
    }

    button.saveResult:hover {
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
