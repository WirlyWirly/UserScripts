// ==UserScript==
// @name 		PTP - Groupies
// @author 		WirlyWirly
// @version     1.3
// @namespace   https://github.com/WirlyWirly
// @icon        https://passthepopcorn.me/favicon.ico
// @description Group torrents on film pages by resolution

// @match       https://passthepopcorn.me/torrents.php?id=*

// @homepage    https://gist.github.com/WirlyWirly/f77854d92fdc6a37171299b59865aab8/
// @updateURL   https://gist.github.com/WirlyWirly/f77854d92fdc6a37171299b59865aab8/raw/PTP%2520-%2520Groupies.user.js
// @downloadURL https://gist.github.com/WirlyWirly/f77854d92fdc6a37171299b59865aab8/raw/PTP%2520-%2520Groupies.user.js

// @grant       GM_setValue
// @grant       GM_getValue
// @run-at 		document-end

// ==/UserScript==

// Opacity for the BannerIcons, a lower percentile makes them appear less bright
let iconOpacity = '95%'

// ----------- Configurations -----------
function gmCacheCreation(configName, defaultSettings) {
    // Create\Update the grease-monkey config object

    if (GM_getValue(configName) === undefined) {
        // Create cache item for new installs
        GM_setValue(configName, defaultSettings)
    } else {
        // Check and add missing settings for updaters
        let gmCache = GM_getValue(configName)
        let keyArray = Object.keys(defaultSettings)
        for (let key of keyArray) {
            if (gmCache[key] === undefined) {
                gmCache[key] = defaultSettings[key]
            }
        }

        GM_setValue(configName, gmCache)
    }

    // Load saved settings
    let gmCache = GM_getValue(configName)

    return gmCache
}

const gmCache = gmCacheCreation('PTP-Groupies', { 'resolution': true, 'bannerIcons': true} )

// gmCache Menu Elements
let ptpGroupiesMenu = document.createElement('div')
ptpGroupiesMenu.id = 'PTP-Groupies-Menu'
ptpGroupiesMenu.setAttribute('style', 'margin: 1em 0 0 0')
ptpGroupiesMenu.innerHTML = `<a href="https://passthepopcorn.me/forums.php?action=viewthread&threadid=45244" target="_blank">🎟️ Groupies (v${GM_info.script.version})</a> ⚙️
<label title='Resolution groups displayed in descending order'>2160pTop <input type="checkbox" id="PTP-Groupies-Resolution"></label>
|
<label title='Custom Icons for group banners'>BannerIcons <input type="checkbox" id="PTP-Groupies-BannerIcons"></label>`

document.querySelector('#torrent-table').appendChild(ptpGroupiesMenu)

// 2160pTop: Toggle
let ptpMenuResolution = document.querySelector('#PTP-Groupies-Resolution')
ptpMenuResolution.checked = gmCache.resolution
ptpMenuResolution.addEventListener ('click', function() {
    gmCache.resolution = ptpMenuResolution.checked
    GM_setValue('PTP-Groupies', gmCache)
})


// BannerIcons: Toggle
let ptpMenuBannerIcons = document.querySelector('#PTP-Groupies-BannerIcons')
ptpMenuBannerIcons.checked = gmCache.bannerIcons
ptpMenuBannerIcons.addEventListener ('click', function() {
    gmCache.bannerIcons = ptpMenuBannerIcons.checked
    GM_setValue('PTP-Groupies', gmCache)
})

// ----------- Torrent Grouping -----------

// The object to hold torrent rows
if (gmCache.resolution) {
    var resGroups = { '4K': [], '2160p': [], '1080p': [], '1080i': [], '720p': [], 'Standard': [], 'Extras': [], 'Disks': [], 'Other': [] }
} else {
    var resGroups = { 'Standard': [], '720p': [], '1080i': [], '1080p': [], '2160p': [], '4K': [], 'Extras': [], 'Disks': [], 'Other': [] }
}

// The main table element holding the torrent rows
let torrentTable = document.querySelector('#torrent-table tbody')

// Remove default group-headers from table
for (header of torrentTable.querySelectorAll('td.basic-movie-list__torrent-edition')) {
    header.parentNode.remove()
}

// Parse torrent rows into respective resolution groups
for (torrent of torrentTable.querySelectorAll('tr.group_torrent')) {
    // Parse each torrent row for the resolution group it belongs to

    // The line of text displayed in the torrent row
    let torrentData = torrent.querySelector('a.torrent-info-link')

    // The PTP id number of the torrent
    let torrentId = torrentData.getAttribute('onclick').match(/#torrent_(\d+)/)[1]

    // The corresponding torrent details element, normally hidden until clicked
    let torrentInfo = torrentTable.querySelector(`#torrent_${torrentId}`)

    // Clean torrent row text before parsing for resolution
    let torrentTitle = torrentData.innerText.replace(/\dK Remaster/i, '')

    // Parse the resolution group from the torrent row text
    let torrentResolution = torrentTitle.match(/Extras|ISO|VOB IFO|m2ts|IMG|\d+x\d+|\d+p|\d{3,4}i|\dK/g)

    if (!torrentResolution) {
        // No resolution/Disk Type
        torrentResolution = 'Other'

    } else if (torrentResolution.includes('Extras')) {
        // Torrent has Extras
        torrentResolution = 'Extras'

    } else if ( ['ISO', 'VOB IFO', 'm2ts', 'IMG'].some(diskType => torrentResolution.includes(diskType)) ) {
        // Torrent is a Disk Rip
        torrentResolution = 'Disks'

    } else {

        let resolution = torrentResolution[0].match(/\d+x(\d+)|(\d+)p|(\d+)i|(\dK)/)

        if (resolution[1] <= 576 || resolution[2] <= 576) {
            // Standard Definition
            torrentResolution = 'Standard'

        } else if ( ['720p', '1080p', '1080i', '2160p', '4K'].some(resType => resolution.includes(resType)) ) {
            // High Definition
            torrentResolution = torrentResolution[0]
        } else {
            // Uncommon Definition
            torrentResolution = 'Other'
        }

    }

    // Move the torrent and corresponding info row into the resolution group
    resGroups[torrentResolution].push(torrent)
    resGroups[torrentResolution].push(torrentInfo)

}

// base64 banner images
let bannerIcons = {
    'Standard': `data:image/webp;base64,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`,
    '720p': `data:image/webp;base64,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`,
    '1080p': `data:image/webp;base64,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`,
    '2160p': `data:image/webp;base64,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`,
    'Extras': `data:image/webp;base64,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`,
    'Other': `data:image/webp;base64,UklGRpwBAABXRUJQVlA4TI8BAAAvH8AHEIfioI0kR/LlY3D8oTysOEVDQds2jLvxZ/wct43kSNTMe03+ke7ZdhtJkiLlgUoOnSFn8EtsAzMzTsBr7iABeXxJSEIyQkIgIflZAvkL8QRhMQcvyTam/tkCCYH8LSGQkZHw3NPs/QrGfRXzCx1ohWdkyFb/yZL/APe0xwjBBNKF/15PIEUHR8zxo1mfsYLGC5jLkt97AQM5yvndvvfoGiBJtq22kfQiNDMzO8wcc5j2vxzx0MN7I/rPwG3bRuze7d0vlH0oLBcvEWFB/10W9BysviUy4JgQjYK/fwWbHwljOQAodRrFKor8uFSw/vWYeQpp9ydjTPpWika+giLfrwLU7IRqmKQnT3nzMxO5zrybS5hi2QAoFURw+jOSHDhGoQKgwBQjMD10jTJi5CslVIsxsDUHWvRJqqJVK1H0zrTHtu6nCaMzs5I1sjD9jaIpYRsF/ovu7zeK1TIKxq7ZMIrVWvH19sL7r59GSNiS5O7m8OhrS+7uzq8VACdPjxHh/tR3l+eHM2UPCgAA`,
    'Disks': `data:image/webp;base64,UklGRgwDAABXRUJQVlA4TAADAAAvH8AHEE/kJpIkR8pT/9bzR/YopC2naMCOZFtV1bjlnxY5UPw6z+WegRxJkiLJl1F/Eem1x3wVcGvbVq3M/d3d/8dSUovI6YhBCQwqoD1Sxo9wvwGv01MJjeBpRovKjHGs1nePy+utmMZM/8L1ePH++fJ6PdzPi2rx/nn/qwWR4Blf+MAepZyRCqlM1dVPWNijzJh50qiS/iuhssiMUamglJBAgqqK9LcuVpYcLbNFZ5ktTpDqCtcIZttmDk6rnfMBFpYZfZ1PqxPszJDj6uF2vT+mgmoWav4bo/Kb/oT/9KeSEC1MoyAiqaCgiiBoY4SgjaCJYIVggAFGCAYIgksEQwRTBHUEVTTRREqTmDFTLofzzWm9s63nfgEgCABbSMp6z87Zds62bTNze17bOr97Zzr3hIj+TwCIPlkdbp/P7bA+wX9aXl2BWEpillKxwPf0mKpnT0Ri5fu9xbkpMYstJLHo+QgNLMwWCzw64yx+TET9LVuNCg/OBItfTxBRG5ZvdsjZ46zyhIg6axErNmRegqzyfpeotw4RsWonw8tqz4aorwFlt/cB3sKqjqi/CeUr1wFcLPzx9XUzQe0oW1bf8wNPAZE0/66tLg121SJiKTaPnt75n6xRgfRlYa7JlFNQglha13V4wZ8ctTqSAlxo1Oh0GkN+TfPkye0HM3PS4ZaUPv5yNXqzWa/NXr7iD5aV3D5W/loz6cwAZp1p5YuVfUIrSmtCbknug6+Ws7R6s1mvyfv9UJLcjmTGx+3JcHNNvkGj02mMhSyYdFij/MlXh911pYglBTkmU27hZVogan0K3J2ONmMpItZ2DS6trv1ymgX9T/DTU1+Gsu00cfP19cHCLoD1SpRv6qcjVht+AzjYlmvoo6EzVR4AgJ3qjLpeot17NcGXDNioQKztJKITVhm3g2zHZjm2EdHEtYqE80EOGrda+4nomMXjzkdQLpqZH6CRcyEpZLOA8NTc4t69gBTxvoDa8envQCwlMUupWMD1ZoH/fHp3uH0+t8P6BKI=`
}

// Clear the table of all torrent rows
while (torrentTable.lastChild) {
    torrentTable.removeChild(torrentTable.lastChild)
}

// Insert all torrent rows back into the table
let resKeys = Object.keys(resGroups)

resKeys.forEach((resolution) => {
    if (resGroups[resolution].length > 1) {

        // Create the banner element to use for the group
        let bannerColor = getComputedStyle(document.querySelector('#movieinfo div.panel__heading')).backgroundColor
        let resBanner = document.createElement('tr')
        resBanner.setAttribute('class', 'group_torrent PTP-ResHeader')
        resBanner.setAttribute('style', `background-color: ${bannerColor}`)

        if (gmCache.bannerIcons) {
            // The icon used in the group banner
            if ( ['Extras', 'Disks', 'Other'].includes(resolution) ) {
                let bannerIcon = bannerIcons[resolution]
                var bannerIconLeft = `<img src="${bannerIcon}" style="vertical-align: text-bottom; opacity: ${iconOpacity};">`
                var bannerIconRight = `<img src="${bannerIcon}" style="vertical-align: text-bottom; transform: scaleX(-1); opacity: ${iconOpacity};">`

            } else {
                if (resolution == '4K') {
                    var bannerIcon = bannerIcons['2160p']
                } else if (resolution == '1080i') {
                    var bannerIcon = bannerIcons['1080p']
                } else {
                    var bannerIcon = bannerIcons[resolution]
                }
                var bannerIconLeft = `<img src="${bannerIcon}" style="vertical-align: text-bottom; opacity: ${iconOpacity};">`
                var bannerIconRight = `<img src="${bannerIcon}" style="vertical-align: text-bottom; opacity: ${iconOpacity};">`
            }

            resBanner.innerHTML = `<td colspan="5"><h2 style="text-align: center; margin: auto">${bannerIconLeft} ${resolution} ${bannerIconRight}</h2></td>`
            resGroups[resolution].unshift(resBanner)

        } else {
            resBanner.innerHTML = `<td colspan="5"><h2 style="text-align: center; margin: auto">${resolution}</h2></td>`
            resGroups[resolution].unshift(resBanner)
        }

    // Append all torrent rows back into the table
    for (torrent of resGroups[resolution]) {
        torrentTable.appendChild(torrent)
    }
    }
})
