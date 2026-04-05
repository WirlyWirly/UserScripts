// ==UserScript==
// @name 		MAM - FancyFreeleech
// @author 		WirlyWirly
// @namespace 		https://github.com/WirlyWirly
// @version 		1.1

// @match 		https://www.myanonamouse.net/freeleech.php

// @icon 		https://www.myanonamouse.net/favicon.ico

// @homepage    https://gist.github.com/WirlyWirly/f13255697e47864b743e8320651e2c18
// @updateURL   https://gist.github.com/WirlyWirly/f13255697e47864b743e8320651e2c18/raw/MAM%2520-%2520FancyFreeleech.user.js
// @downloadURL https://gist.github.com/WirlyWirly/f13255697e47864b743e8320651e2c18/raw/MAM%2520-%2520FancyFreeleech.user.js

// @description Fancy up the list of freeleech torrents
// @grant 		none
// @run-at 		document-end
// ==/UserScript==

// ----------------------------------- CODE --------------------------------------

// Retrieve all <a> elements in the torrent list
let mainListElement = document.querySelector('#mainBody .biglink').parentElement.parentElement
let allListLinks = mainListElement.getElementsByTagName('a')

// Create an object that will hold an array for each category
let torrentCategories = {}
let categoriesDisplayOrder = []

let categoryId = ''
for (link of allListLinks) {
    if (link.classList[0] == 'biglink') {
        // Link is a category, create an array for this category
        categoryId = link.href.match(/cat\]\[\]=(\d+)/)[1]
        torrentCategories[categoryId] = [link]
        categoriesDisplayOrder.push(categoryId)

    } else if (link.classList[0] == 'fLeech') {
        // Link is a torrent, add the link to the latest category
        torrentCategories[categoryId].push(link)
    }
}

// Clear the current list elements
mainListElement.closest('div.blockCon').setAttribute('style', 'width:98%')
mainListElement.innerHTML = ''

// Append the categories and torrents back onto the page
for (categoryId of categoriesDisplayOrder) {
    for (link of torrentCategories[categoryId]) {
        if (link.classList[0] == 'biglink') {
            // This link is a category link, edit and create a header out of it 

            // Create the category text title
            let categoryTitle = document.createElement('a')
            categoryTitle.href = 'javascript:void(0)'
            categoryTitle.setAttribute('class', `biglink MAM-FF-${categoryId}`)
            categoryTitle.textContent = link.innerText

            categoryTitle.addEventListener('click', function() {
                // When the category title is clicked, toggle the display of related torrent links 
                let torrentElements = mainListElement.querySelectorAll(`a.fLeech.${this.classList[1]}`)
                for (torrentLink of torrentElements) {
                    if (torrentLink.style.display == 'none') {
                        torrentLink.setAttribute('style', 'display: table')
                    } else {
                        torrentLink.setAttribute('style', 'display: none')
                    }
                }
            })

            // Remove the original category text, so that only the icon will redirect to the browse page
            link.innerHTML = `<span class="cat${categoryId}">&nbsp;</span>`

            mainListElement.appendChild(link)
            mainListElement.appendChild(categoryTitle)

        } else {
            // The link is a torrent link, prepare it for hiding
            link.setAttribute('class', `fLeech MAM-FF-${categoryId}`)
            link.setAttribute('style', 'display: none')
            mainListElement.appendChild(link)
        }

    }

    mainListElement.appendChild(document.createElement('br'))
    mainListElement.appendChild(document.createElement('br'))
}
