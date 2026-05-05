// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        ABS - MatchMate
// @author      WirlyWirly
// @version     1.0
// @homepage
// @description Additional AudioBookShelf match tab features
//              Written on LibreWolf via Violentmonkey

// @namespace   UserScript
// @icon        https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/monkey.png?raw=true

// ----------------------------------- Matches --------------------------------------

// @match     http://192.168.1.105:32060/audiobookshelf/*

// ----------------------------------- Permissions --------------------------------------

// @grant       GM_addStyle

// ----------------------------------- Dependencies --------------------------------------

// @require   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/waitForElement.js

// ----------------------------------- Script Links --------------------------------------

// @updateURL
// @downloadURL

// ==/UserScript==

let asinSearchSite = 'audible.com'
let matchWindowHeight = '75%' // Percentile
let maxCoverWidth = '192px' // Pixels
let afterSaveDirection = 'Previous' // Previous | Next | false


// =================================== CODE ======================================

async function main() {

    let editPanel = await waitForElement('div.relative:has(#formWrapper)')

    let matchTabButton = editPanel.querySelector('div.absolute[role="tablist"] :nth-child(5)')
    matchTabButton.addEventListener('mouseup', async function(event) {
        // The match tab of the edit panel was clicked

        if ( event.button == 0 ) {
            await waitForElement('#match-wrapper', editPanel)
            matchTabObservation()
        }

    })

}

main()

async function matchTabObservation() {
    // Setup Mutation observation in the match tab

    let matchTab = document.getElementById('match-wrapper')

    // The Title search button
    let titleSearchButton = document.createElement('button')
    titleSearchButton.innerText = 'Title'
    titleSearchButton.setAttribute('class', 'abs-btn rounded-md shadow-md relative border border-gray-600 mt-5 ml-1 text-white bg-primary px-8 py-2')
    matchTab.querySelector('form > div').appendChild(titleSearchButton)
    titleSearchButton.addEventListener('mouseup', function(event) {
        event.button == 0 ? titleSearch() : null
    })

    let observer = new MutationObserver(async function(mutations) {
        // Actions to take when there are changes in the match tab

        let allMatchResults = matchTab.querySelectorAll('div.matchListWrapper div.cursor-pointer:not(.matchButtonDone)')

        if ( allMatchResults.length > 0  ) {
            // There are new match results

            for ( let matchResult of allMatchResults ) {

                // Save Button
                let saveMatchButton = document.createElement('button')
                saveMatchButton.innerText = 'Save'
                saveMatchButton.classList.add('saveMatch', 'matchMateButton')
                saveMatchButton.addEventListener('mouseup', function(event) {
                    event.button == 0 ? saveMatch(this) : null
                })

                // ASIN Button
                let asinButton = document.createElement('button')
                asinButton.innerText = '🔎 Audible'
                asinButton.classList.add('asinSearch', 'matchMateButton')
                asinButton.addEventListener('mouseup', function(event) {
                    event.button == 0 ? audibleLookup(this) : null
                })

                matchResult.insertAdjacentElement('afterend', asinButton)
                matchResult.insertAdjacentElement('afterend', saveMatchButton)

                matchResult.classList.add('matchButtonDone')
            }

        }

    })

    let target = document.getElementById('match-wrapper')
    let config = { childList: true, subtree: true }
    observer.observe(target, config)

}

async function titleSearch() {
    // The 'Title' search button was clicked

    // The floating Edit panel
    let editPanel = document.querySelector('div.relative:has(> div[role="tablist"]')

    // Switch to the details tab
    editPanel.querySelector('div[role="tablist"] :nth-child(1)').click()

    // Wait until the details tab is ready, then parse the search info
    let detailsTab = await waitForElement('#formWrapper', editPanel)
    let title = editPanel.querySelector('#formWrapper input[placeholder="Title"]').value
    //let author = editPanel.querySelector('#formWrapper input[placeholder="Author"]').value

    // Return to the match tab and perform the search
    editPanel.querySelector('div[role="tablist"] :nth-child(5)').click()
    let matchTab = await waitForElement('#match-wrapper', editPanel)
    matchTabObservation()


    setTimeout(() => {
        let matchTab = document.getElementById('match-wrapper')
        let searchField = matchTab.querySelector('form input[placeholder="Search.."]')
        searchField.click()
        searchField.dispatchEvent(new KeyboardEvent('change', {'key': 'a'}));
        searchField.value = title

        matchTab.querySelector('form > div > button').click()
    }, 1000)

}

async function saveMatch(matchButton) {
    // The 'Save' button of a bookResult was clicked

    // The floating Edit panel
    let editPanel = document.querySelector('div.relative:has(> div[role="tablist"]')

    // Click the book item, which will load the new data
    matchButton.parentElement.querySelector('div').click()

    // Wait until the submit button is available, then click it
    let submitButton = await waitForElement('button.bg-success[type="submit"]', editPanel.querySelector('#match-wrapper'))
    submitButton.click()

    // Wait until the details tab is ready, then go back to the Match tab
    let detailsTab = await waitForElement('#formWrapper', editPanel)
    editPanel.querySelector('div[role="tablist"] :nth-child(5)').click()
    await waitForElement('#match-wrapper', editPanel)
    matchTabObservation()

    // If enabled, change the match window to the previous\next book
    if ( afterSaveDirection != false ) {

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

    // Wait until the submit button is available, then get the ASIN
    let submitButton = await waitForElement('button.bg-success[type="submit"]', editPanel.querySelector('#match-wrapper'))

    let bookURL
    try {
        let asinValue = editPanel.querySelector('#match-wrapper input[placeholder="ASIN"]').value
        bookURL = `https://duckduckgo.com/?q=\\${asinValue}+site%3A${asinSearchSite}`
    } catch(error) {}

    // Click the back arrow to return to match results
    let backArrowElement = editPanel.querySelector('#match-wrapper div.absolute div.cursor-pointer')
    backArrowElement.click()

    bookURL ? window.open( bookURL, '_blank') : asinButton.innerText = 'No ASIN'

}

GM_addStyle(`

    div.relative:has(> div > #match-wrapper) {
        /* edit panel size */
        height: ${matchWindowHeight.match(/^(\d+)%?$/)[1]}% !important;
    }

    #match-wrapper div:has(> div > img) {
        /* cover size */
        width: unset;
        height: unset;
        max-width: ${maxCoverWidth.match(/^(\d+)(px)?$/)[1]}px;

    }

    #match-wrapper div:has( > p.text-xs) {
        /* synopsis size */
        max-height: 95px
    }

    #match-wrapper form div:has( > div > div > input[placeholder="Author"]) {
        width: 110px;
    }

    button.matchMateButton {
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        font-size: medium;
        padding: 3px;
        width: 46%;
        margin: 10px 0px 20px 15px;

    }

    button.saveMatch {
        background-color: var(--color-success);
    }

    button.saveMatch:hover {
        background-color: #316c33;
    }

    button.asinSearch {
        background-color: #ce813e;
    }

    button.asinSearch:hover {
        background-color: #714a33;
    }

`)
