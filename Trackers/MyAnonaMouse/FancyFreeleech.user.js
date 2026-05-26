// ==UserScript==
// @name 		MAM - FancyFreeleech
// @author 		WirlyWirly
// @namespace 	https://github.com/WirlyWirly
// @version 	2.0

// @match 		https://www.myanonamouse.net/freeleech.php

// @icon 		https://www.myanonamouse.net/favicon.ico

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/MyAnonaMouse/FancyFreeleech.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/FancyFreeleech.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/FancyFreeleech.user.js?raw=true

// @description Fancy up the list of freeleech torrents
// @grant 		GM_addStyle
// @run-at 		document-end
// ==/UserScript==

// ----------------------------------- CODE --------------------------------------

// Retrieve all category elements in the torrent list
let allCategories = document.querySelectorAll('#freeleechList div.media_cat > div.category')

for ( let category of allCategories ) {
    // For each category in the list, make it so clicking the <h3> header will toggle the 'hideTorrents' class

    // Hide the category torrents by default by pre-applying the class
    category.classList.add('hideTorrents')

    let headerText = category.querySelector('h3')
    headerText.classList.add('categoryHeader')

    headerText.addEventListener('click', function(event) {
        let category = this.parentElement
        category.classList.contains('hideTorrents') ? category.classList.remove('hideTorrents') : category.classList.add('hideTorrents')
    })

    // Update the <h3> header text of this category
    let torrentCount = category.querySelectorAll('div.freeleechItem').length
    let emoji = '📘'

    let mediaTypeText = category.parentElement.querySelector('div.torrentInfo').innerText
    mediaTypeText.match(/audiobook/i) ? emoji = '🎧' : null
    mediaTypeText.match(/comic/i) ? emoji = '🦸‍♂️' : null
    mediaTypeText.match(/ebook/i) ? emoji = '📘' : null
    mediaTypeText.match(/manga/i) ? emoji = '🌸' : null
    mediaTypeText.match(/musicology/i) ? emoji = '🎵' : null
    mediaTypeText.match(/radio/i) ? emoji = '🎙️' : null

    headerText.innerText = `${emoji} ${headerText.innerText} [${torrentCount}]`


}


GM_addStyle(`

    h3.categoryHeader {
        cursor: pointer;
        margin-top: 20px;
        font-size: 20px;
        padding: 10px;
        background-color: #4847475c;
    }

    h3.categoryHeader:hover {
        color: #34aed4;
    }

    div.hideTorrents div.freeleechItem {
        display: None;
    }

    div.category > div:nth-child(even) {
        background-color: #000000ab;
    }

    #freeleechList div.freeleechItem.hasPoster {
        /* Torrent <div> */
        padding: 10px 0px 10px 130px !important;
        min-height: 125px !important;
    }

    #freeleechList div.freeleechItem.hasPoster img.flThumb {
        /* Torrent <img> */
        top: 10px !important;
        max-width: 125px;
        max-height: 125px;
        border: 1px solid black;
        box-shadow: 0px 0px 5px black;
        border-radius: 5px;
    }

`)
