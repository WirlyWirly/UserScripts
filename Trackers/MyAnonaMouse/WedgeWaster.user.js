// ==UserScript==
// @name 		MAM - WedgeWaster
// @author 		WirlyWirly
// @namespace 		https://github.com/WirlyWirly
// @version 		3.1

// @match       https://www.myanonamouse.net/
// @match 		https://www.myanonamouse.net/t/*
// @match 		https://www.myanonamouse.net/tor/browse.php*

// @icon 		https://www.myanonamouse.net/favicon.ico

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/MyAnonaMouse/SearchParty.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/WedgeWaster.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/WedgeWaster.user.js?raw=true

// @description Waste a wedge and not your time when purchasing freeleech!
// @grant 		GM_download
// @run-at 		document-end
// ==/UserScript==

// =================================== SETTINGS ======================================

// change to false to NOT download .torrent file when the freeleech purchase fails (Use at your own risk)
const downloadTorrentFileOnErrors = true

// Change to true so that the regular download button will NOT be displayed
const hideRegularDownloadButton = false

// change to true to NEVER download the .torrent file, only check for and purchase freeleech
const neverDownloadTorrentFile = false

// Change to true to MODIFY the Right-Click behaviour of cheese: Purchase the FL and THEN simulate a Left-Click on the torrents existing quiCKIE BunnyButton
const quickieBunnyButton = false


// =================================== CODE ======================================

'use strict'

if ( document.URL.match(/\/t\/\d+/) ) {
    // --- Torrent Details page ---

    let torrentFileURL = document.getElementById("tddl").href
    let torrentID = document.URL.match(/\/t\/(\d+)/)[1]

    // Create WedgeWaster button
    let wedgeWasterButton = document.createElement('button')
    wedgeWasterButton.id = 'WedgeWasterButton'
    wedgeWasterButton.textContent = '🧀 WedgeWaster 🧀'
    wedgeWasterButton.title = 'Spend a wedge to make this torrent Freeleech'
    wedgeWasterButton.classList.add('torFormButton')
    wedgeWasterButton.style = 'max-width: 100%; font-size: 16px; margin-top: 1em;color: #222;background: radial-gradient(ellipse at center,#FFB21E 0%,#FFB21E 62%,#BDB100 100%);border-color: #222;'

    wedgeWasterButton.setAttribute('data-torrenturl', torrentFileURL)
    wedgeWasterButton.setAttribute('data-torrentid', torrentID)

    wedgeWasterButton.addEventListener('click', function(event) {
        // Left-Click: Check for and perform FL purchase then download .torrent
        let freeLeechStatus = document.getElementById('ratio').getElementsByClassName('torDetInnerBottomSpan')[0].innerText

        if (freeLeechStatus.match(/freeleech/i)) {
            this.textContent = '✔️ WedgeWaster ✔️'
            console.log('WedgeWaster: Save a wedge, this torrent is already freeleech!')

            if ( neverDownloadTorrentFile == false ) {
                window.location = this.dataset.torrenturl
            }

        } else {
            wedgeWasterButton.textContent = '💸 WedgeWaster 💸'
            purchaseTorrent(this.dataset.torrentid, this.dataset.torrenturl, 'details', true)

        }
    })

    wedgeWasterButton.addEventListener('contextmenu', function(event) {
        // Right-Click: Check for and perform FL purchase. Do NOT download .torrent

        event.preventDefault()

        let freeLeechStatus = document.getElementById('ratio').getElementsByClassName('torDetInnerBottomSpan')[0].innerText

        if (freeLeechStatus.match(/freeleech/i)) {
            this.textContent = '✔️ WedgeWaster ✔️'
            console.log('WedgeWaster: Save a wedge, this torrent is already freeleech!')

        } else {
            this.textContent = '💸 WedgeWaster 💸'
            purchaseTorrent(this.dataset.torrentid, this.dataset.torrenturl, 'details', false)

        }

        if ( quickieBunnyButton == true ) {
            // After the FL purchase, Left-Click a quiCKIE BunnyButton

            let quiCKIEBunnyButton = document.querySelector('#download a.quickie_bunnyButton')
            quiCKIEBunnyButton.dispatchEvent(new MouseEvent('mouseup'))

        }

    })

    // Append WedgeWaster button below normal download button
    let downloadButtons = document.getElementById('download').getElementsByClassName('torDetInnerBottom')[0]
    downloadButtons.appendChild(document.createElement('br'))
    downloadButtons.appendChild(wedgeWasterButton)

    // If enabled, hide the sites download button
    if ( hideRegularDownloadButton == true ) {
        document.querySelector('#tddl').style.display = 'none'
    }

} else {
    // --- Browse | Bookmarks | Homepage ---
    
    let tableObserver = new MutationObserver(function(mutations) {
        // Functionality to run when changes are detected to the target element
        
        try {

            // All torrent <tr> elements in the table <tbody>
            let torrentRows = mutations[0]['target'].querySelectorAll('tbody tr')

            for (let torrent of torrentRows) {

                if ( !torrent.classList.contains('torrentInfo') ) {
                    // not a torrent, skipping
                    continue
                }

                let downloadButton, torrentFileURL, torrentID
                try {
                    // Using the site's downloadButton, parse the necessary data to make the freeleech purchase
                    
                    downloadButton = torrent.getElementsByClassName('directDownload')[0]
                    
                    // Torrent download data
                    torrentFileURL = downloadButton.href
                    torrentID = torrentFileURL.match(/tid=(\d+)/)[1]

                } catch(error) {
                    // Could not parse the necessary download data (Maybe not VIP?), skipping
                    console.log(`WedgeWaster: Could not get the torrent download details, skipping: ${torrent}...`)
                    console.log(error)
                    continue
                }

                // If enabled, hide the sites download button
                if ( hideRegularDownloadButton == true ) {
                    downloadButton.style.display = 'none'
                }

                // Generate WedgeWaster button for the current torrent
                let wedgeWasterButton = document.createElement('a')
                wedgeWasterButton.textContent = '🧀'
                wedgeWasterButton.id = `MAM-WW-${torrentID}`
                wedgeWasterButton.title = 'Spend a wedge to make this torrent Freeleech'
                wedgeWasterButton.setAttribute('style', 'font-size: 135%; text-align: center; text-decoration: none; cursor: pointer')
                wedgeWasterButton.setAttribute('data-torrentid', torrentID)
                wedgeWasterButton.setAttribute('data-torrenturl', torrentFileURL)

                wedgeWasterButton.addEventListener('click', function() {
                    // Left-Click: Check for and perform FL purchase then download .torrent

                    // Elements that signify torrent is already freeleech
                    let vipFreeleech = torrent.children[1].querySelector('[title*="VIP"]')
                    let siteFreeleech = torrent.children[1].querySelector('[title*="freeleech"]')
                    let personalFreeleech = torrent.children[1].querySelector('[title="personal freeleech"]')

                    if ( vipFreeleech || siteFreeleech || personalFreeleech ) {
                        // Torrent is already freelech, skipping purchase
                        console.log('WedgeWaster: Save a wedge, this torrent is already freeleech!')

                        // Update button icon
                        this.textContent = '✔️'

                        if ( neverDownloadTorrentFile == false ) {
                            window.location = this.dataset.torrenturl
                        }

                    } else {
                        // Purchase torrent as freeleech
                        this.textContent = '💸'
                        purchaseTorrent(this.dataset.torrentid, this.dataset.torrenturl, 'table', true)

                    }


                })

                wedgeWasterButton.addEventListener('contextmenu', function(event) {
                    // Right-Click: Check for and perform FL purchase. Do NOT download .torrent

                    event.preventDefault()

                    // Elements that signify torrent is already freeleech
                    let vipFreeleech = torrent.children[1].querySelector('[title*="VIP"]')
                    let siteFreeleech = torrent.children[1].querySelector('[title*="freeleech"]')
                    let personalFreeleech = torrent.children[1].querySelector('[title="personal freeleech"]')

                    if (vipFreeleech || siteFreeleech || personalFreeleech) {
                        // Torrent is already freelech, skipping purchase
                        console.log('WedgeWaster: Save a wedge, this torrent is already freeleech!')

                        // Update button icon
                        this.textContent = '✔️'

                    } else {
                        // Purchase torrent as freeleech
                        this.textContent = '💸'
                        purchaseTorrent(this.dataset.torrentid, this.dataset.torrenturl, 'table', false)

                    }


                    if ( quickieBunnyButton == true ) {
                        // After the FL purchase, Left-Click a quiCKIE BunnyButton

                        let bunnyButton = torrent.querySelector('a.quickie_bunnyButton')
                        bunnyButton.dispatchEvent(new MouseEvent('mouseup'))

                    }

                })

                // Append the WedgeWaster button after the normal download button
                downloadButton.insertAdjacentElement('afterend', wedgeWasterButton)
            }

        } catch (error) {
            console.log(error)
            // No changes or not ready
        }

    })

    let target = document.getElementById("ssr")
    let config = {childList: true}

    // Monitor page for any changes
    tableObserver.observe(target, config)

}

// =================================== FUNCTIONS ======================================

function purchaseTorrent(torrentID, torrentFileURL, pageType, performDownload=true) {
    // Send a GET request to spend a wedge on making a torrent freeleech, after responding download the .torrent file if enabled

    if ( neverDownloadTorrentFile == true ) {
        // Never download the .torrent file, as specified in the settings above
        performDownload = false
    }

    let freeleechURL = `https://www.myanonamouse.net/json/bonusBuy.php/?spendtype=personalFL&torrentid=${torrentID}`

    // Creating the XMLHttpRequest object
    var xhr = new XMLHttpRequest()
    xhr.open("GET", freeleechURL, true)

    // Function to execute after a successfull request
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            // Parse MAM response as JSON
            let mam_response = JSON.parse(this.response)

            // Update Ratio box if freeleech purchase was successfull
            if (mam_response.success == true) {
                console.log(`WedgeWaster | Success: ${mam_response.type}`)

                if (pageType === 'details') {
                    // Update the page button to show success
                    let ratio_box = document.getElementById('ratio')
                    ratio_box.getElementsByClassName('torDetInnerBottomSpan')[0].innerText = 'This torrent is a Personal freeleech!'

                    document.getElementById('WedgeWasterButton').textContent = '✔️ WedgeWaster ✔️'
                } else if (pageType === 'table') {
                    // Update the page button to show success
                    document.getElementById(`MAM-WW-${torrentID}`).textContent = '✔️'
                }

                // Download .torrent file if enabled
                if ( performDownload == true ) {
                    window.location = torrentFileURL
                }


            } else {
                // Freeleech purchase was unsuccessfull
                console.log(`WedgeWaster | Error: ${mam_response.error}`)


                if ( pageType == 'details' ) {
                    document.getElementById('WedgeWasterButton').textContent = '❌ WedgeWaster ❌'

                } else if ( pageType == 'table' ) {
                    document.getElementById(`MAM-WW-${torrentID}`).textContent = '❌'

                }

                if ( downloadTorrentFileOnErrors == true ) {
                    // Even on error, download the .torrent file, as specified in the settings above

                    if ( performDownload == true ) {
                        window.location = torrentFileURL
                    }

                } else {
                    alert(`WedgeWaster\n\nThe Freeleech purchase was unsuccessfull\n\n${mam_response.error}`)
                }
            }

        }
    }

    // Send the request
    xhr.send()
}
