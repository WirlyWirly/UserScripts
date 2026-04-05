// ==UserScript==
// @name 		RED - OriginGenerator
// @author 		WirlyWirly
// @namespace 	https://github.com/WirlyWirly
// @version 	1.0

// @match       https://redacted.sh/artist.php?id=*
// @match       https://redacted.sh/collages.php*
// @match       https://redacted.sh/top10.php*
// @match       https://redacted.sh/torrents.php*

// @icon        https://redacted.sh/favicon.ico

// @homepage    https://redacted.sh/forums.php?action=viewthread&threadid=72242
// @updateURL   https://gist.github.com/WirlyWirly/3699dbada2689e6c80a0f4035658bea9/raw/RED%2520-%2520OriginGenerator.user.js
// @downloadURL https://gist.github.com/WirlyWirly/3699dbada2689e6c80a0f4035658bea9/raw/RED%2520-%2520OriginGenerator.user.js

// @description Generate and download origin.yaml files

// @run-at 		document-end
// ==/UserScript==

// =================================== CODE ======================================

// OrginGenerator version number
const versionNumber = GM_info.script.version


// ----------------------------------- FUNCTIONS --------------------------------------

const parsers = {
    // Various helper functions to parse text

    decodeHtml: function(html) {
        // Parse a string as HTML to decode any ASCII characters
        let txt = document.createElement('textarea')
        txt.innerHTML = html
        return txt.value
    },

    existence: function(string) {
        // Check a string to make sure it has a value
        if (null || string == '' || string == 'undefined') {
            string = '~'
        }
        return string
    },

    percentile: function(number) {
        // Format an integer into a percentile
        if (number > 0) {
            return `${number}%`
        } else {
            return '~'
        }
    },

    arrayJoined: function(array, key=false, seperator) {
        // Format an array into a single string
        let items = []
        for (item of array) {
            if (key) { items.push(item[key]) } else { items.push(item) }
        }

        let string = items.join(seperator)
        return string
    },

    fileList: function(string) {
        // Format the API torrent['files'] string so it's readable
        let fileList = ''
        let files = string.split(/\|{3}/)
        for (file of files) {
            let pretty = file.replace(/^(.+)\{{3}(\d+)\}{3}/, `- Name: $1\n  Size: $2 bytes\n`)
            fileList = fileList + pretty
        }

        return fileList
    }


}

function generateOrginFile(json) {
    // Parse then download the API metadata as origin.yaml

    let group = json['group']
    let torrent = json['torrent']

    // Stop generating origin.yaml for non-music torrents
    if (group['categoryName'] != 'Music') {
        console.log(`RED - OriginGenerator: Skipping, #${torrent['id']} is not a music torrent`)
        return
    }

    let directoryName = parsers.decodeHtml(torrent['filePath'])

    let releaseCodes = {
        1: "Album",
        3: "Soundtrack",
        5: "EP",
        6: "Anthology",
        7: "Compilation",
        9: "Single",
        11: "Live album",
        13: "Remix",
        14: "Bootleg",
        15: "Interview",
        16: "Mixtape",
        17: "Demo",
        18: "Concert Recording",
        19: "DJ Mix",
        21: "Unknown"
    }


    let originTemplate = `Artist:                  ${parsers.arrayJoined(group['musicInfo']['artists'], 'name', ' & ')}
Name:                    ${parsers.existence(group['name'])}
Release type:            ${parsers.existence(releaseCodes[group['releaseType']])}
Record label:            ${parsers.existence(torrent['remasterRecordLabel'])}
Catalog number:          ${parsers.existence(torrent['remasterCatalogueNumber'])}
Edition year:            ${parsers.existence(torrent['remasterYear'])}
Edition:                 ${parsers.existence(torrent['remasterTitle'])}
Tags:                    ${parsers.existence(parsers.arrayJoined(group['tags'], false,', '))}
Main artists:            ${parsers.existence(parsers.arrayJoined(group['musicInfo']['artists'], 'name', ' & '))}
Featured artists:        ${parsers.existence(parsers.arrayJoined(group['musicInfo']['with'], 'name', ' & '))}
Producers:               ${parsers.existence(parsers.arrayJoined(group['musicInfo']['producer'], 'name', ', '))}
Remix artists:           ${parsers.existence(parsers.arrayJoined(group['musicInfo']['remixedBy'], false, ', '))}
DJs:                     ${parsers.existence(parsers.arrayJoined(group['musicInfo']['dj'], false, ', '))}
Composers:               ${parsers.existence(parsers.arrayJoined(group['musicInfo']['composers'], ['name'], ', '))}
Conductors:              ${parsers.existence(parsers.arrayJoined(group['musicInfo']['conductor'], ['name'], ', '))}
Original year:           ${parsers.existence(group['year'])}
Original release label:  ${parsers.existence(group['recordLabel'])}
Original catalog number: ${parsers.existence(group['catalogueNumber'])}
Media:                   ${parsers.existence(torrent['media'])}
Log:                     ${parsers.percentile(torrent['logScore'])}
Format:                  ${parsers.existence(torrent['format'])}
Encoding:                ${parsers.existence(torrent['encoding'])}
Directory:               ${parsers.existence(directoryName)}
Size:                    ${parsers.existence(torrent['size'])}
File count:              ${parsers.existence(torrent['fileCount'])}
Info hash:               ${parsers.existence(torrent['infoHash'])}
Uploaded:                ${parsers.existence(torrent['time'])}
Cover:                   ${parsers.existence(group['wikiImage'])}
Permalink:               ${window.location.origin + `/torrents.php?torrentid=${torrent['id']}`}

Comment:
${parsers.existence(torrent['description'])}

Files:
${parsers.fileList(torrent['fileList'])}

Description:
${parsers.existence(parsers.decodeHtml(group['bbBody']))}
`

    // Parse the text to make sure there are no HTML encoded characters
    originTemplate = parsers.decodeHtml(originTemplate)

    // Download the origin.yaml file
    let file = new File(['\ufeff' + originTemplate], `${directoryName}.yaml`, {type: 'text/plain:charset=UTF-8'})
    fileURL = window.URL.createObjectURL(file)

    let downloadElement = document.createElement('a')
    downloadElement.href = fileURL
    downloadElement.download = file.name
    downloadElement.click()
    window.URL.revokeObjectURL(fileURL)

    // Update origin button to show success
    originButton = document.getElementById(`RED-OG-YAML-${torrent['id']}`)
    originButton.children[0].src = "data:image/webp;base64,UklGRh4BAABXRUJQVlA4WAoAAAAQAAAADwAADwAAQUxQSH0AAAABgGNt2/HojW27cjobVbbBOitIlwVozBXYZjk7mPSDbjrrGf7YQURMAPEsSrOwHS8zq9ytyJkIOx8zImJo3kdXQAx9I7Tpd8T8K3qNFv1exEuNKHSPPv3ZAx78uisci/8SbQKXW3hx07+qEQBMEMMqgGcXE1rCRZ4Ya2LEJwBWUDggegAAALADAJ0BKhAAEAAAAAAlsAJ0ugH4ANVAywD0APK09gD9ovSHCxwAAP7/E0tnjNpxR9ng3bdIcVdJaQ9X1ddybFzNOk7uFMueEhrt/um/md8ePjJheqLb7pbO7YixiTQixe2/Raa2t/3sBeeDFAQ7XV7n/r/pYYgAAAAA"

}

function getApiMetadata(torrentId) {
    // Generate origin.yaml file for the provided torrentId

    let request = new XMLHttpRequest()
    request.open('GET', `https://redacted.sh/ajax.php?action=torrent&id=${torrentId}`)
    // request.setRequestHeader('Authorization', apiKey)
    request.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
    request.setRequestHeader('Accept-Encoding', 'gzip, deflate, br, zstd')
    request.setRequestHeader('Accept-Charset', 'ISO-8859-1,utf-8;q=0.7,*;q=0.3')
    request.setRequestHeader('Accept-Language', 'en-US,en;q=0.8')
    request.setRequestHeader('User-Agent', 'gazelle-origin')

    request.responseType = 'json'

    request.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            // Format and save metadata as origin.yaml file
            generateOrginFile(request.response.response)
        }

    }

    request.send()

}

// ----------------------------------- MAIN --------------------------------------

let allDownloadButtons = document.querySelectorAll('a.button_dl')

for (dLButton of allDownloadButtons) {
    // Create a new DL button and Origin button

    let torrentId = dLButton.href.match(/action=download&id=(\d+)/)[1]

    // Create the origin.yaml only button
    let originButton = document.createElement('a')
    originButton.href = 'javascript:void(0)'
    originButton.id = `RED-OG-YAML-${torrentId}`
    originButton.innerHTML = `<img style="max-width: 16px; vertical-align: sub" src="data:image/webp;base64,UklGRs4AAABXRUJQVlA4TMIAAAAvD8ADEPegqJEkpRdfhxbIv6yTcTYURZLUzJCDADQgBTH4fx6DtpEc+Xq/f/54ntZLBIIQ7bPMIvcEAC7wsXnftLdlqlYO3mlyNyKIGCBCQAIRAgISQkBAwmrkrZDM/Z8yEjVQfqBw2EaSItX8PMPh3HNP/oEupBDR/wkAUgmgpJqClGgREs1//awlpe/uYF7KlHQaIlYvAHbZIiLeVrJrFIfaWpq6htqzsJ29hH+We8Ts1N3sMY/7BsCON2vDXj04AA==">`

    originButton.addEventListener('click', function() {
        getApiMetadata(torrentId)
    })

    // Create the .torrent + origin.yaml button
    let comboButton = document.createElement('a')
    comboButton.href = 'javascript:void(0)'
    comboButton.id = `RED-OG-COMBO-${torrentId}`
    comboButton.text = 'Origin'
    comboButton.addEventListener('click', function() {
        // Change the DL button to download the .torrent and origin.yaml
        document.location = dLButton.href
        getApiMetadata(torrentId)
    })

    // Append the buttons alongside the DL button
    dLButton.parentElement.appendChild(document.createTextNode(" | "))
    dLButton.parentElement.appendChild(originButton)
    dLButton.parentElement.appendChild(document.createTextNode(" | "))
    dLButton.parentElement.appendChild(comboButton)
}
