// ==UserScript==
// @name 		MAM - HumbleHunter
// @author 		WIRLYWIRLY
// @namespace 	https://github.com/WirlyWirlyPool
// @version 	1.1
// @description Hunt down books from HumbleBookBundles on MyAnonaMouse!
// @icon 		https://www.myanonamouse.net/favicon.ico
// @grant 		none
// @run-at 		document-end


// @match 		https://www.humblebundle.com/books/*

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/MyAnonaMouse/HumbleHunter.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/HumbleHunter.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/HumbleHunter.user.js?raw=true
// ==/UserScript==

// Get all book detail boxes
let bookSlides = document.getElementsByClassName("slick-slide")

for (let i = 0, l = bookSlides.length; i < bookSlides.length; i++) {

    // Get book title without edition number
    let bookTitle = bookSlides[i].getElementsByClassName('heading-medium')[0]
    bookTitle = bookTitle.innerText.match(/^([\w\d\s\'\:\.\-]+),?.*/)[1]

    // Generate MAM search URL
    let mamURL = `https://www.myanonamouse.net/tor/browse.php?action=search&tor%5Btext%5D=${bookTitle}`

    // Prepare MAM search element
    let mamElement = document.createElement('div')
    mamElement.setAttribute('class', 'publishers-and-developers')
    mamElement.innerHTML = `HumbleHunter: <a href="${mamURL}" target='_blank'><span>MyAnonaMouse</span></a/>`

    // Insert MAM search element below publisher
    let bookDetails = bookSlides[i].getElementsByClassName('details')[0]
    bookDetails.insertBefore(mamElement, bookDetails.children[2])
}
