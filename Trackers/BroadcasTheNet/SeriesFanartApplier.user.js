// ==UserScript==
// @name    BTN - Series Fanart Applier
// @author  WIRLYWIRLY
// @namespace   https://github.com/WirlyWirlyPool
// @version     0.5

// @match   https://broadcasthe.net/series.php?id=*
// @match   https://broadcasthe.net/torrents.php?id=*
// @icon    https://broadcasthe.net/favicon.ico

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/BroadcasTheNet/SeriesFanartApplier.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/BroadcasTheNet/SeriesFanartApplier.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/BroadcasTheNet/SeriesFanartApplier.user.js?raw=true

// @description Apply Fanart on Series page and Torrent group page for a unique experience.
// @grant       none
// ==/UserScript==

function apply_fanart(image_url){
try {
    // Apply Fanart
    document.body.setAttribute('style', 'background-image: url(' + image_url + ') !important; background-size: cover !important; background-position: top center !important; background-repeat: no-repeat !important; background-attachment: fixed !important')
    document.getElementById('wrapper').setAttribute('style', 'box-shadow: 0px 0px 5px 2px rgba(0, 0, 0) !important; padding: 0px 0px !important; background: rgba(0, 0, 0, 0.5) !important; background-position: center top !important')

    // Adjust Searchbars
    var searchbars = document.getElementById('searchbars')
    searchbars.className = 'head'
    searchbars.setAttribute('style', 'width: -moz-fit-content; padding: 10px !important; margin-top: -2.6px !important; box-shadow: none !important')
    var center = document.createElement('center')
    searchbars.parentNode.insertBefore(center, searchbars)
    center.appendChild(searchbars)

    // Adjust Linkbox
    var linkbox = document.getElementsByClassName('linkbox')[0]
    linkbox.className = 'linkbox head'
    linkbox.setAttribute('style', 'text-align: center; padding: 5px !important; width: -moz-fit-content')
    var center = document.createElement('center')
    linkbox.parentNode.insertBefore(center, linkbox)
    center.appendChild(linkbox)
    var br = document.createElement('br')
    center.parentNode.insertBefore(br, center)
} catch {}
}


// --------------- Series Page ---------------
if (document.URL.substring(0,38) == 'https://broadcasthe.net/series.php?id=') {
    try {
        // Get Fanart
        var image_url = document.getElementsByClassName('body')[0].getElementsByTagName('img')[0].getAttribute('src')
        if (image_url !== '//cdn2.broadcasthe.net/https/i.imgur.com/55K4Dww.png') {
            apply_fanart(image_url)
        }
    } catch {}

    // --------------- Toggle Seasons ---------------
    var seasons = document.getElementsByClassName('torrent_table')
    for (var i = 2, l = seasons.length; i < seasons.length; i++) {
        try {
            seasons[i].getElementsByTagName('tbody')[1].setAttribute('style', 'display: none')
            seasons[i].getElementsByTagName('a')[0].innerHTML = 'show'
        } catch {}
    }
}


// --------------- Torrent Group Page ---------------
if (document.URL.substring(0,40) == 'https://broadcasthe.net/torrents.php?id=') {
    try {
        // Get Fanart
        var series_url = document.getElementsByClassName('thin')[0].getElementsByTagName('a')[0].getAttribute('href')
        this.$ = this.jQuery = jQuery.noConflict(true)
        $.get('https://broadcasthe.net/' + series_url, function(series_page) {
            var image_url = series_page.match(/src=\"(.+?)\".+?alt=\"No Fan Art/)[1]
            if (image_url !== '//cdn2.broadcasthe.net/https/i.imgur.com/55K4Dww.png') {
                apply_fanart(image_url)
            }
        })
    } catch {}
}
