// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        ABS - MatchMate
// @author      WirlyWirly
// @version     0.1
// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Other/ABS%20-%20MatchMate.user.js
// @description Additional AudioBookShelf match tab features
//              Written on LibreWolf via Violentmonkey
// @namespace   UserScript

// ----------------------------------- Matches --------------------------------------

// @match       http://192.168.1.105:80/audiobookshelf/*
// @include     /https?://.+/audiobookshelf/.*/

// ----------------------------------- Permissions --------------------------------------

// @grant       GM_addStyle

// ----------------------------------- Dependencies --------------------------------------

// @require     https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/waitForElement.js

// ----------------------------------- Script Links --------------------------------------

// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASsSURBVFhHrVb/b1NVFH9/yn7VGJ3REJVgjEjQX8wi+oNGQxOjETUGQYYkGoZEDcuGssAcbGOyoWNRHDAYcRu0K7ixtF3btZlt17puq92wGwMqwojJ8X7uu7e97737OlA/yWc7595zPud+7zMY6F5YXV1NdXV15PP5aKW4QDfzUQv/XvmT9yEGsToNF2obS/R4PBSJRGg5O0JZfyNFul6mUPsLWsZ6NvMYxCIHuTpNG7WNVFVVxWe0mBrgwrqClYgc5EIDWroags7GmpoaWsynKXmuViueGfqM8uPHLUSbLhYay4U819TVYrQ2YNn+WspolxqFsNduQB9i7HnQgqbLlpQdjFJXXAoAK8WrNHflME32vlfqh4029AGVNDQrYRrYJyx7peK62alE7GJqkMe6DQLbYTsTpoHDos5Ksjg/wQWz/v2OPjdioAAGY+/DmUAtywCwNzix9uBU/04udH1m1NG3GuXAdZNCLeU8GPzO6q4aCgOxHo+jbzWiMKBbBdRCTT4AvFq62YM41ZiJ9OX1k3uLgwfCRkH0qTPGOcDBlL5KvJ78xcTTmR7cQ8G25y0Md27iM4Ao/IkTm0tXEC/d7GgLtwHY8qAiRmrIAyl9ldPDDfzZNnAgAh0v0ZXDGy2c7NvBk+djvZT8eU/JB27kJygX7BIeWWwA+chBrvTtDH/3hnkY79xcoF+aNzgYP/URTwYwq+TA58JjA/g9SrOBTuGxFVBsINj1urBM6PRBwFjORWi4ab2DaX8zD5DI+A8Ji92KXJSyY8eEx66oYgPRk9uEZSIxWK+tgdrG8lyELn71rINoV5HylQeAvunRclHVBsZ/+FBYJirVMK7Nhmmg4RkHr9kGkPAeFBbxvszIt8Jjq6PYQKBnq7BMIF5bg9U2lmbCdH7f0w4usU4Vv15oEhbxvqnLHcIjiw2MdX8gLBOI19ZgtY1b1+ep74t1Dl449AotsgCJ+GB5AGhPXjoqPLLYwMjx8gAQCy1dDYBfw3P1G+nU3rVaFrJhununSIGfdvMEAG2J4Xbhse1RbMB7xMP/z0b7tZrgQNMm8xriMRjprqWTu5/U8syXG2i0eyf5O8ynFShMj9Okt0147L1XbAB5yEGuXU8y2LvXfIjwHE6Pn6WeT56oSG/7u0Ke6A82gPjFclHVBnT5dl79LSQ/Xs0fo9P7XqTvd61x5VDrO0KeeHJsqFV47MdKsQFdvkrUKv0Y4Q9+GtOBPuqsfdyVZ79+TcgTLWRCFDjTKDx27Zh993ZReKTNV4laypcR/8MPxOnGV6lj+2OuvHSijubToVLcTNxHU0wMNtrQhxg1x87zzW85P0hAfCbls0k69vE6at36aIn5dFDM6/6RjXktWtAuLOT0n2Qg/xyfS9DRHWup5f1HOIP931B+Kviv6O36tKQDTWi7fpRK4jwUWOCRbU/RwS0P/y+EFjRX/SyXxChz2QT92OChA28/9J8IDSy7ZuaS2ka+Tzgs8cu91Fb7HO1/88H7InKQCw3bntupbSwRy4Y7mwoNUX/rLjqwZQ3Vex7QsmX7eh6DWOS4LLmd2kYH8Wrh6cSMbt+6QTOTYxaiDX2IES/cPdCgfwDT6KzLhtlSxwAAAABJRU5ErkJggg==

// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/ABS%20-%20MatchMate.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/ABS%20-%20MatchMate.user.js?raw=true

// ==/UserScript==

let matchWindowHeight = '75%' // Percentile
let currentCoverWidth = '75px' // Pixels
let afterSaveDirection = 'Previous' // Previous | Next | false
let audibleSearchTemplate = 'https://www.audible.com/pd/%asin%'

// =================================== CODE ======================================

async function main() {

    let floatingElement = document.createElement('div')
    document.body.appendChild(floatingElement)
    floatingElement.outerHTML = `<div id="mmFloating"><img src=""></div>`

    let editPanel = await waitForElement('div.relative:has(#formWrapper)')

    let matchTabButton = editPanel.querySelector('div.absolute[role="tablist"] :nth-child(5)')
    matchTabButton.addEventListener('mouseup', async function(event) {
        // The match tab of the edit panel was clicked

        await waitForElement('#match-wrapper', editPanel)
        matchTabObservation()

    })

}

main()

// =================================== FUNCTIONS ======================================

async function matchTabObservation() {
    // Setup Mutation observation in the match tab and act on any new results

    // The floating Edit panel
    let editPanel = document.querySelector('div.relative:has(> div[role="tablist"]')
    let matchTab = editPanel.querySelector('#match-wrapper')

    // Create the 'Title' search button
    let titleSearchButton = document.createElement('button')
    titleSearchButton.innerText = 'Title'
    titleSearchButton.setAttribute('class', 'abs-btn rounded-md shadow-md relative border border-gray-600 mt-5 ml-1 text-white bg-primary px-8 py-2')
    titleSearchButton.title = 'Fill the search field with the current title'
    matchTab.querySelector('form > div').appendChild(titleSearchButton)
    titleSearchButton.addEventListener('mouseup', function(event) {
        event.button == 0 ? titleSearch() : null
    })

    let observer = new MutationObserver(async function(mutations) {
        // Actions to take when there are changes in the match tab

        let allMatchResults = matchTab.querySelectorAll('div.matchListWrapper div.cursor-pointer:not(.mmProcessing, .mmDone)')

        if ( allMatchResults.length > 0  ) {
            // There are new match results
            allMatchResults.forEach(element => {element.classList.add('mmProcessing')})

            let oldImages = matchTab.querySelectorAll('div:has(> img.currentCover)')
            if ( oldImages.length > 0 ) {
                oldImages.forEach(element => {element.remove()})
            }

            // Get the current cover
            allMatchResults[0].click()

            // Wait until the submit button is available, indicating the form is available, then get the coverURL
            let submitButton = await waitForElement('button.bg-success[type="submit"]', matchTab)
            let coverURL = matchTab.querySelector('form img[src^="/audiobookshelf/api/items/"]').src

            // Click the back arrow to return to match results
            let backArrowElement = matchTab.querySelector('div.absolute div.cursor-pointer')
            backArrowElement.click()

            setTimeout(() => {
                let currentCoverElement = document.createElement('div')
                currentCoverElement.title = 'The current cover for this book'
                currentCoverElement.classList.add('currentCover')

                matchTab.querySelector('form > div').firstChild.insertAdjacentElement('beforebegin', currentCoverElement)

                currentCoverElement.innerHTML = `<img class="currentCover" src="${coverURL}">`

                currentCoverElement.addEventListener('mouseover', function(event) {
                    let floatingElement = document.getElementById('mmFloating')
                    floatingElement.querySelector('img').src = this.querySelector('img').src
                    floatingElement.classList.add('active')
                })

                currentCoverElement.addEventListener('mouseout', function(event) {
                    let floatingElement = document.getElementById('mmFloating')
                    floatingElement.querySelector('img').src = ''
                    floatingElement.classList.remove('active')
                })

            }, 500)

            for ( let matchResult of allMatchResults ) {

                // Save Button
                let saveMatchButton = document.createElement('button')
                saveMatchButton.innerText = 'Save'
                saveMatchButton.classList.add('saveMatch', 'matchMateButton')
                saveMatchButton.addEventListener('mouseup', function(event) {
                    event.button == 0 ? saveMatch(this) : null
                })

                // Audible Button
                let asinButton = document.createElement('button')
                asinButton.innerText = '🔎 Audible'
                asinButton.title = 'Search Audible using this ASIN'
                asinButton.classList.add('asinSearch', 'matchMateButton')
                asinButton.addEventListener('mouseup', function(event) {
                    event.button == 0 ? audibleLookup(this) : null
                })

                matchResult.insertAdjacentElement('afterend', asinButton)
                matchResult.insertAdjacentElement('afterend', saveMatchButton)

                matchResult.classList.add('mmDone')

            }

        }

    })

    let target = document.getElementById('match-wrapper')
    let config = { childList: true, subtree: true }
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
    let title = editPanel.querySelector('#formWrapper input[placeholder="Title"]').value
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
        searchField.value = title

        matchTab.querySelector('form > div > button').click()
    }, 500)

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

    // Wait until the submit button is available, indicating the form is available, then get the ASIN
    let submitButton = await waitForElement('button.bg-success[type="submit"]', editPanel.querySelector('#match-wrapper'))

    let asinURL
    try {
        let asinValue = editPanel.querySelector('#match-wrapper input[placeholder="ASIN"]').value
        asinURL = audibleSearchTemplate.replace(/%asin%/, asinValue)
    } catch(error) {}

    // Click the back arrow to return to match results
    let backArrowElement = editPanel.querySelector('#match-wrapper div.absolute div.cursor-pointer')
    backArrowElement.click()

    asinURL ? window.open(asinURL, '_blank') : asinButton.innerText = 'No ASIN'

}


GM_addStyle(`

    div.relative:has(> div > #match-wrapper) {
        /* edit panel size */
        height: ${matchWindowHeight.match(/^(\d+)%?$/)[1]}% !important;
    }

    #match-wrapper div:has(> div > img:not(.currentCover)) {
        /* result cover size */
        width: unset;
        height: unset;
        max-width: 192px;

    }

    div:has(> div.currentCover) {
        align-items: end;
    }

    div.currentCover {
        max-width: ${currentCoverWidth.match(/^(\d+)(px)?$/)[1]}px;
    }

    #mmFloating.active {
        box-shadow: 0px 0px 13px #000000;
        left: 50%;
        max-width: 500px;
        position: fixed;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 999;
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
