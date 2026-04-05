// ==UserScript==
// @name 		HDB - FilmFancy
// @author 		WirlyWirly
// @namespace 		https://github.com/WirlyWirly
// @version 		2.4

// @match   https://hdbits.org/film/info?id=*
// @match   https://hdbits.org/browse.php*
// @match   https://hdbits.org/details.php*

// @icon    https://hdbits.org/favicon.ico

// @homepage    https://gist.github.com/WirlyWirly/e2ff763385188b4a2d7fd3bbc51851ce/
// @updateURL   https://gist.github.com/WirlyWirly/e2ff763385188b4a2d7fd3bbc51851ce/raw/HDB%2520-%2520FilmFancy.user.js
// @downloadURL https://gist.github.com/WirlyWirly/e2ff763385188b4a2d7fd3bbc51851ce/raw/HDB%2520-%2520FilmFancy.user.js

// @resource    HDB-FF-CSS https://gist.github.com/WirlyWirly/e2ff763385188b4a2d7fd3bbc51851ce/raw/HDB%2520-%2520FilmFancy.css
// @grant 		GM_getResourceText
// @grant 		GM_addStyle

// @grant       GM_setValue
// @grant       GM_getValue

// @description     Film, details, and even the browse page, but done all fancy-like

// @run-at 		document-end
// ==/UserScript==
// ----------------------------------- CODE --------------------------------------

// FilmFancy version number
const versionNumber = GM_info.script.version

// Apply custom CSS
GM_addStyle(GM_getResourceText('HDB-FF-CSS'))

// The settings to be saved as a cache item in the browser
const filmFancySettings = {'resolution': true, 'banners': true, 'alternative': true, 'details': true, 'browse': true, 'browsePageGrouping': true, 'browsePageTitleSorting': true}

if (GM_getValue('HDB-FilmFancy') === undefined) {
    // Create cache item for new installs
    GM_setValue('HDB-FilmFancy', filmFancySettings)
} else {
    // Check and add missing settings for updaters
    let gmCache = GM_getValue('HDB-FilmFancy')
    let keyArray = Object.keys(filmFancySettings)
    for (let key of keyArray) {
        if (gmCache[key] === undefined) {
            gmCache[key] = filmFancySettings[key]
        }
    }

    GM_setValue('HDB-FilmFancy', gmCache)
}

// Load saved settings
const gmCache = GM_getValue('HDB-FilmFancy')


function filmConfigMenu(torrentListTitle) {
    // --- Build and append the toggable FilmFancy options ---

    // Create menu elements
    let hdbffMenu = document.createElement('div')
    hdbffMenu.id = 'HDB-FF-Menu'
    hdbffMenu.innerHTML = `<a href="https://hdbits.org/forums/viewtopic?topicid=79065" target="_blank">🎟️ FilmFancy (v${versionNumber})</a> ⚙️  <label title='Resolution groups displayed in descending order'>2160pTop <input type="checkbox" id="HDB-FF-Resolution"></label> | <label title='Banners designating torrent groups'>Banners <input type="checkbox" id="HDB-FF-Banners"></label> | <label title='Replace the main title with the English/Alternative title when available'>AltTitle <input type="checkbox" id="HDB-FF-Alternative"></label> | <label title='Enable FilmFancy features on torrent details page'>DetailsPage <input type="checkbox" id="HDB-FF-DetailsPage"></label> | <label title='Enable FilmFancy features on the browse page'>BrowsePage <input type="checkbox" id="HDB-FF-BrowsePage"></label>`

    // Replace torrent list header with FilmFancy
    let torrentsTitle = document.getElementById('torrent-list').previousElementSibling
    torrentsTitle.style = null
    torrentsTitle.innerText = '🎟️ FilmFancy'
    torrentsTitle.classList.add('torrentListHeader')

    // Append configuration menu
    torrentListTitle.parentElement.insertBefore(hdbffMenu, torrentListTitle)

    // set current checkbox status
    let hdbffMenuResolution = document.getElementById('HDB-FF-Resolution')
    hdbffMenuResolution.checked = gmCache.resolution

    let hdbffMenuBanners = document.getElementById('HDB-FF-Banners')
    hdbffMenuBanners.checked = gmCache.banners

    let hdbffMenuAlternative = document.getElementById('HDB-FF-Alternative')
    hdbffMenuAlternative.checked = gmCache.alternative

    let hdbffMenuDetailsPage = document.getElementById('HDB-FF-DetailsPage')
    hdbffMenuDetailsPage.checked = gmCache.details

    let hdbffMenuBrowsePage = document.getElementById('HDB-FF-BrowsePage')
    hdbffMenuBrowsePage.checked = gmCache.browse

    // Resolution: Toggle
    hdbffMenuResolution.addEventListener('click', function() {
        gmCache.resolution = hdbffMenuResolution.checked
        GM_setValue('HDB-FilmFancy', gmCache)
    })

    // Banners: Toggle
    hdbffMenuBanners.addEventListener('click', function() {
        gmCache.banners = hdbffMenuBanners.checked
        GM_setValue('HDB-FilmFancy', gmCache)
    })

    // Alternative: Toggle
    hdbffMenuAlternative.addEventListener('click', function() {
        gmCache.alternative = hdbffMenuAlternative.checked
        GM_setValue('HDB-FilmFancy', gmCache)
    })

    // Details: Toggle
    hdbffMenuDetailsPage.addEventListener('click', function() {
        gmCache.details = hdbffMenuDetailsPage.checked
        GM_setValue('HDB-FilmFancy', gmCache)
    })

    // Browse: Toggle
    hdbffMenuBrowsePage.addEventListener('click', function() {
        gmCache.browse = hdbffMenuBrowsePage.checked
        GM_setValue('HDB-FilmFancy', gmCache)
    })

}

function browseConfigMenu (torrentList) {
    // Create menu element
    let browseMenuElement = document.createElement('div')
    browseMenuElement.style = `width: ${torrentList.offsetWidth}px`

    // Create FilmFancy text header
    let browseHeader = document.createElement('div')
    browseHeader.innerHTML = '🎟️ FilmFancy'
    browseHeader.classList.add('torrentListHeader')

    // Create browse menu toggles
    let browseMenu = document.createElement('div')
    browseMenu.id = 'HDB-FF-Menu'
    browseMenu.innerHTML = `<a href="https://hdbits.org/forums/viewtopic?topicid=79065" target="_blank">🎟️ FilmFancy (v${versionNumber})</a> ⚙️  <label title='Enable resolution grouping'>Grouping <input type="checkbox" id="HDB-FF-Grouping"></label> | <label title='Sort torrents in resolution groups by title ascending'>TitleSorting <input type="checkbox" id="HDB-FF-TitleSorting">`

    // Append configuration menu above torrentList
    browseMenuElement.appendChild(browseMenu)
    browseMenuElement.appendChild(browseHeader)
    torrentList.parentElement.insertBefore(browseMenuElement, torrentList)

    // Set current checkbox status
    let menuResolutionGrouping = document.getElementById('HDB-FF-Grouping')
    menuResolutionGrouping.checked = gmCache.browsePageGrouping


    let menuTitleSorting = document.getElementById('HDB-FF-TitleSorting')
    menuTitleSorting.checked = gmCache.browsePageTitleSorting

    // Grouping: Toggle
    menuResolutionGrouping.addEventListener('click', function() {
        gmCache.browsePageGrouping = menuResolutionGrouping.checked
        GM_setValue('HDB-FilmFancy', gmCache)
    })

    // TitleSorting: Toggle
    menuTitleSorting.addEventListener('click', function() {
        gmCache.browsePageTitleSorting = menuTitleSorting.checked
        GM_setValue('HDB-FilmFancy', gmCache)
    })

    // Hide options when resolution grouping is disabled
    if (gmCache.browsePageGrouping === false) {
        menuTitleSorting.parentElement.style = 'display: none'
    }


}


function updateFilmInfo(filmInfoElement, pageType) {
    // --- Modify the contents of the filmInfo box ---

    // The header containing the movie title
    let titleHeader = filmInfoElement.getElementsByTagName('h1')[0]

    // Fix default header margins
    if (pageType === 'film') {
        titleHeader.setAttribute('style', 'margin-bottom: 10px;')
        try {
            titleHeader.nextElementSibling.setAttribute('style', 'margin-top: 0px; margin-bottom: 5px; padding: 0px')
        } catch(e) {
            // No sub-header
        }
    } else if (pageType === 'details') {
        titleHeader.setAttribute('style', 'margin-bottom: 10px;')
        try {
            titleHeader.nextElementSibling.setAttribute('style', 'margin-top: -5px !important; margin-bottom: 5px !important; margin-left: 15px !important; padding: 0px')
        } catch(e) {
            // No sub-header
        }

    }

    // Alternative: Change main title to alternative
    if (gmCache.alternative == true) {
        try {
            // The alternative title element
            let alternativeTitleHeader = titleHeader.nextSibling

            let originalTitle = titleHeader.children[0].innerText
            let alternativeTitle = alternativeTitleHeader.innerText

            // Swap the current and alternative titles
            titleHeader.children[0].innerText = alternativeTitle
            alternativeTitleHeader.innerText = originalTitle

        } catch(e) {
            // No alternative title
        }
    }

    // Movie info for search links
    let movieIMDB = titleHeader.children[0].href.match(/(tt\d+)$/)[1]
    let movieSearchTitle = encodeURIComponent(titleHeader.innerText)

    // Generate search link elements
    let searchLinks = document.createElement('div')
    searchLinks.classList.add('HDB-FF-SearchLinks')
    searchLinks.innerHTML = `
        <a href="https://passthepopcorn.me/torrents.php?action=advanced&searchstr=${movieIMDB}" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/x-icon;base64,AAABAAEAEBAAAAAAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ6cAAD//wAA//8AAI/mAAD//wAA//8AAP8/AACcngAA/z8AAP//AAD/PwAA//8AANtfAACWlwAAuLwAAP8/">PassThePopcorn</a>
        <a href="https://www.themoviedb.org/redirect?external_source=imdb_id&external_id=${movieIMDB}" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABXElEQVR42qWTXUoDMRSFT2yTSbFaCwV/QHwVRFF8EAVRoVZ8ForgPlyESxEqRYrgMtQdKKIiUtpJO3+dxGQ67VhQLJ3A4SYP5+Pek4SsHlVPPpr2lR+E6wAIxluK0czTfHHmkhQ3Tx/aHXdjTOPImp3mj2R6rRK6fjA1CYAzKjXgWLl+bxK/BmRhOtCAIBlOqaj+GQYhPwA0ARhjlmbAcgxK2/sywLias95I1wF6vQg0BDiej7lSHofVHRRWFtGRTIuOqBtLPL/Ca9wAzS9wi/UBXddH+WwLB+e7aIUMtlbbSFrR3tZAoavQ1VYWnNsa5H0dOW4lgEp1G/u6g1ZAtdmKTINqx2ahO7DB4TTqkHe1BOBoQGmpgPLFHvLLC9EIIqSxiQ1HMFW8vMGtXwOf78kIgxAZp+D5XBSYjEOUiiRnE2JHQHneaIi/XePw1v6/xvQPKd1TTv2Z0n7nb6xy2pHNiRQwAAAAAElFTkSuQmCC">TheMovieDB</a>
        <a href="https://letterboxd.com/imdb/${movieIMDB}/" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTElEQVR42mNkQAPukdna///+Sfn3n8ENyJWDCj9iYmTYxcjMMmfn8qlXkdUzwhihoQ1sHxif9wGZmf///2diwAIYGRn/AanpAv8li1avbvgFNwCsmeH59v8M/50YiACMDIz7BBgkPUGGgA1wDUufArQ1mxjNSK6ZunvVzBxGkJ///f1zCZez8Rjwj4mZRY/RLSy9/9///wWWvA8YjHieMjz+KcCw7YMGwydBRoZnZj/BiqVOsTNwfWBl+KdhycAgIMrA8PQ2A9ODKwxMjIwTGF1C06+GiZzXShU/BTd9h5ATg4+7MMNf9v9gPvNPRoaAW/kMbzkN4GqYTmxmYLp44BrIgM8r1BfzCLN8g0teTNnGEMW4i+Ha7ydgvharDEMnZx5D7zkxhB++fWZgWdzwhSoGUOYFigOR4mikOCGBOBQnZbgh5GYmZEBqdgYAWa/VMb4fg70AAAAASUVORK5CYII=">Letterboxd</a>
        <a href="https://duckduckgo.com/?q=\\${movieSearchTitle}+${movieIMDB}+site%3Arottentomatoes.com" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNBRTM0NDlCMTQ3ODExRThCM0VFQjlDNTlERjBCNDFFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNBRTM0NDlDMTQ3ODExRThCM0VFQjlDNTlERjBCNDFFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0FFMzQ0OTkxNDc4MTFFOEIzRUVCOUM1OURGMEI0MUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0FFMzQ0OUExNDc4MTFFOEIzRUVCOUM1OURGMEI0MUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz76UXYgAAAJYUlEQVR42uxdC3BU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">RottenTomatoes</a>
        <a href="https://duckduckgo.com/?q=\\${movieSearchTitle}+${movieIMDB}+site%3Ametacritic.com" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/png;base64,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">Metacritic</a>
        <br>
        <a href="https://broadcasthe.net/torrents.php?action=advanced&imdb=${movieIMDB}" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/png;base64,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">BroadcasTheNet</a>
        <a href="https://thetvdb.com/redirect/imdb/${movieIMDB}" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAkFBMVEUbJSVr1ZH///+MkZGusrI2Pz/3+PiJjo5iwoVnzIszWkUhMS1MVFRka2s1XkgyWEQsSzw7a1AdKiglOjJkx4hctX1Snm9Hh2E9cFMoQjdZrXhOl2pDfVsqRjlfu4EkLi5ASUlLkGYvODgvUkGhpaVbbGV6gICYnZ1IUFBWp3RAclbNz8/DxsZscnJfZmZRm22q8P4tAAAA60lEQVQ4je2R63KCMBCFd1csCUmUWwCBioi1Kr28/9t15VZmZNoX8PzYZHK+bM5kAZ4aFaq//ShGaZM02+7CZcDDSSIvysd2r+zs8wlKASpz0OYXUHy6URNQA6xp5bzMWkiMt0oIwW4sMFtrcwe0Po6ARa9ba5SqqU/EWjldHYCk7xD5WEDyRqeqf6Jy6ADDzS5DCdbfxWfSYwZDQ9KyBwQ0zBo6j8A7XXogQMzAu3ISJfHWUtveM3y05AwZGkRZBlfMg4J33qfrutpw+Zr+GueqH/86nPt7f2Ealg1pv9OgiZbHpTb+PxN/6ge00QyWHXgbEAAAAABJRU5ErkJggg==">TheTvDB</a>
        <a href="https://api.simkl.com/redirect?to=Simkl&imdb=${movieIMDB}" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACN0lEQVR42p2Tz08TURDHv/urlNIGtB6QnuQqkQPam9QrniTxB2o1RA8iiaKxtAZNtP5IKKiIGBQviuhZ0cgJId407UEa/B+antva7nZ3fTPbhW7kopO8zHtv33zeznznScH2XT8ARPF/9l0SAFNMZHfHtm2Pd02SJI9vmEkA2w2gj6FQCH6/H6qqiLUMOm7ZFgzdQKlcRqVS4XMNkM0ACg6Hd2Ps6hXE+vsRCgahahpkASCCZVmo1WooFotY/vQZb5feoVqtEsQBmKaJ0csjmM5MMpmAFETDvU1RFP7nUqmEoTNxrK2v0569lcL88zmci5/lmyanppHN5hppgYNPnjiOwWODvL4xnsTrN4siTdUB0A0LL+ZxeugUA2afzSGby/G8VtPZh/eEsbezE4VCAT838uw9KUzcTOH2rQk0q0H77tB1nYu4ufkLd9Jp9rIsOwDKNdLVhWQygYN9fayEz+fjoYliqiIFUobWZC8XXiGRTG3/gSDhSCyG7u59UGQFq2tfWa6WFr8YPgFQ0dt7AI+mMgz/srKC+Plh1Ot1ByCKgfdLizg6MCACf+PxzAw28nnKA24/9fTsR2o8gUAggA8flzF84SKptN0H99N3cf3amKcGbjc2NQ7bvQcPkRFKbdWADkYiEYyOXEI0eggd7R0iX40OgBBUI8MwuAdI3idPZ70qNPd+sK0N/tZWaCItSXaeCAHMeh1VIWdZKOE2mNvKOz8mZ/HXA9rpMa2KyWFw1/+TEf3bH+Z0GEFGcmpoAAAAAElFTkSuQmCC">Simkl</a>
        <a href="https://trakt.tv/search/imdb/${movieIMDB}" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAzFBMVEVHcEzjzu2gQcT////BKX/1AxL8AAC0J5OuK5/CHHe0Mpq0Mpns2u+kPbuoN7GdNMDkrcbsq7rWnsnx4fHo0evavOXAJX/LDmDZstvFFm67ec2uMqOyKJe6fdOnLKuhQsS8LYnWs+HOb6S0FIufGa7tABHbaYyzIZK4FYXZAD+iOLvlx+KhMLm+d8WZILvQAFDly+irF5rOlMrRbp+pRbrVbJjXqdPLcKvAc77Ib67qm6rXj7fjACntiJS2R6bGJ3TLfrf+/f6zV7iqW8pWRlinAAAADHRSTlMAycYtxsYrK/39xsbNoycUAAAA30lEQVQYlSXP2XaCMBSF4dNWRdskQECSQASKzEMZXM7a8f3fqUm7777/4qx1AIznZRi2bWuaUfRoABhxMXH+qrb+iczNE8xKh566zvf9jbLzAKsrHYOQ1HVtKqM1COssAxJijP88qHCU7w1Pcesru2/ArKRo0MDTf0c6lNRFw4S0MYbe3nlb6h60U3UJKnvvxVv61XA3JYTokAtd0GEk5LsjcLNz9qHKpwyC4MRDyO6XngnPKwspRzotYZ45lzzf75LkeKZO8QKLLLvbapbatYzVu4t5dquqnjEhVjMDfgGG0BwicSWbxgAAAABJRU5ErkJggg==">Trakt</a>
        <a href="https://www.imdb.com/title/${movieIMDB}/" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAahJREFUWMNj+HpU4v9AYoZRB4w6YNQBow4YdQC6wKIm/v+u5mz/w1w5/h+aIwxmg3CiH+f/pzvE4HwQvrJaBIXvZsH2vyqJ5//nw+L/c8K5wGLdBbykOaAxg+c/AwPDfwlhpv9ruwXBbBDmZGf4f2SuMJwPwicWIviCvIxw9vI2gf9mOqxgdhLQ4VRxAAh35vHidMD2yYL/WZgh7AnFfHAHgEJudacAGH85Ik6eA9hYIQaDghQUEtgcsGuq0H8uDkYMB7CzIdQ3Z/KQ5wB1eWYwzQE0TEuRhSgHmGpDHBDjxfnf34EdzPa1YyfPAYYaLP8lRZjAbG9bdpJCIMmfE4xBbB9bMh1gBHSArSEbmA1K3bgcAIsemjgAlJhA7L4iXqwOqE3lgbMnliCiIBYYBaEuHJRFAcgBrdkQi9f3CmJ1AAwzMTH8PzpfGB4CrCwIucpEbsIOOLlI+P/0Kr7/Cxv5/99aLwpmr+4S+H9llQiY/Xi7GJgG4SfbReFsEJ4BxCD9IHPWdAuAxQ4DC7OpFXz/p5Tz/f9wUHy0Lhh1wKgDRh0w6oDB5wAAnyEaXz1l5ZIAAAAASUVORK5CYII=">IMDB</a>
        <a href="https://www.youtube.com/results?search_query=${movieSearchTitle}+trailer" target="_blank" class="HDB-FF-SearchLink"><img src="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AAAD/EAAA/0AAAP9AAAD/cAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/QAAA/0AAAP8Q////AP///wD///8AAAD/YAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA/2D///8AAAD/MAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD/MAAA/1AAAP//AAD//wAA//8AAP//AAD//wAA//8QEP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA/2AAAP+AAAD//wAA//8AAP//AAD//wAA//8AAP//4OD//1BQ//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP+AAAD/gAAA//8AAP//AAD//wAA//8AAP//AAD/////////////wMD//yAg//8AAP//AAD//wAA//8AAP//AAD/gAAA/4AAAP//AAD//wAA//8AAP//AAD//wAA/////////////7Cw//8gIP//AAD//wAA//8AAP//AAD//wAA/4AAAP+AAAD//wAA//8AAP//AAD//wAA//8AAP//4OD//0BA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP+AAAD/UAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD/YAAA/zAAAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA/zD///8AAAD/YAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA/2D///8A////AP///wAAAP8QAAD/QAAA/0AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP9AAAD/QAAA/xD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//8AAP//AADAAwAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAEAAMADAAD//wAA//8AAA==">YouTube</a>
    `

    // Append search links after title(s)
    titleHeader.parentElement.appendChild(searchLinks)

}

function deadTorrents(torrent, pageType) {
    // --- Apply visual changes to dead torrents ---

    if (pageType === 'details') {
        if (torrent.children[4].innerText == '0') {
            torrent.classList.add('HDB-FF-Seederless')
        }

    } else {
        if (torrent.children[7].children[0].innerText == '0') {
            torrent.classList.add('HDB-FF-Seederless')
        }
    }
}

function organizeTorrents(torrentBody, pageType) {
    // --- Group and sort torrents on a movie page ---

    // Get all torrent rows
    let torrentRows = torrentBody.getElementsByTagName('tr')

    // Group torrent rows into resolutions
    if (gmCache.resolution === true) {
        var resGroups = {'Featured': [], '2160p': [], '1080p': [], '1080i': [], '720p': [], 'Extras': [], 'Audio': [], 'Unknown': []}
    } else {
        var resGroups = {'Featured': [], '720p': [], '1080i': [], '1080p': [], '2160p': [], 'Extras': [], 'Audio': [], 'Unknown': []}
    }

    for (torrent of torrentRows) {
        // - Parse and group every torrent in list -

        // Skip row if not a torrent
        // if (torrent.id.length < 0) {
        //     continue
        // }

        // The torrent title to be parsed for resolution
        if (pageType === 'details') {
            // Applies to torrent details page
            var title = torrent.getElementsByTagName('a')[0].innerText

        } else {
            // Applies to Film and Browse pages
            var title = torrent.getElementsByTagName('b')[0].getElementsByTagName('a')[0].innerText
        }

        try {
            if (torrent.getElementsByClassName('category6')[0]) {
                // Filter out audio torrents
                resGroups.Audio.push(torrent)
                continue

            } else {
                // Parse resolutin group from title
                var resolution = title.match(/(Extras|720p|1080i|1080p|2160p)/)[1]
            }

            // Filter out featured torrents
            if (pageType == 'browse') {
                if (torrent.className === 'featured' )
                resolution = 'Featured'
            }

            // Put torrent into appropriate resolution group
            resGroups[resolution].push(torrent)
        } catch(e) {
            // Not featured, audio, extra, or resolution
            resGroups.Unknown.push(torrent)
        }

    }

    // Sort each resolution group
    let keys = Object.keys(resGroups)

    keys.forEach((key) => {
        if (pageType === 'film') {
            // Sort by file-size ascending
            resGroups[key].sort((a, b) => a.children[5].childNodes[0].textContent.localeCompare(b.children[5].childNodes[0].textContent, undefined, {numeric: true}) )

            // Sort by snatch count descending
            // resGroups[key].sort((a, b) => b.children[6].children[0].innerHTML.localeCompare(a.children[6].children[0].innerHTML, undefined, {numeric: true}) )

        } else if (pageType === 'browse') {
            if (gmCache.browsePageTitleSorting) {
                // Sort by title ascending
                resGroups[key].sort((a, b) => a.children[2].getElementsByTagName('a')[0].innerText.localeCompare(b.children[2].getElementsByTagName('a')[0].innerText, 'en', {sensitivity: 'base', ignorePunctuation: true, caseFirst: false, numeric: false}) )
            }

        } else if (pageType === 'details') {
            // Sort by file-size ascending
            resGroups[key].sort((a, b) => a.children[2].textContent.localeCompare(b.children[2].textContent, undefined, {numeric: true}) )
        }

    })

    // Remove all torrents from torrent list
    while (torrentBody.lastChild) {
        torrentBody.removeChild(torrentBody.lastChild)
    }

    // Boolean to move the table header below the first group banner
    let moveTableHeaderOrigin = true

    // Add each group of torrents to torrent list
    keys.forEach((resolution) => {
        if (resGroups[resolution].length > 0) {
            // If the group is not empty then add those torrents to the page

            // Define text for the group banner
            if ( resolution == 'Unknown' && pageType === 'film' ) {
                var bannerTitle = document.getElementsByClassName('film-info')[0].getElementsByTagName('h1')[0].children[0].innerText
            } else if (resolution == 'Unknown' && pageType === 'browse') {
                var bannerTitle = 'FilmFancy'
            } else if (resolution === 'Unknown' && pageType === 'details') {
                try {
                    var bannerTitle = document.getElementsByClassName('contentlayout')[0].getElementsByTagName('h1')[0].children[0].innerText
                } catch(e) {
                    var bannerTitle = 'FilmFancy'
                }
            } else {
                var bannerTitle = resolution
            }

            // The images to use in the banner, depending on the current resolution group
            if (resolution == '720p') {
                var bannerImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAeCAYAAACc7RhZAAAEr2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMzAiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iNjQiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjEyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjEyLzEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjMwIgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDEt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`
            } else if (['1080i', '1080p'].includes(resolution)) {
                var bannerImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAeCAYAAACc7RhZAAAEr2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMzAiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iNjQiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjEyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjEyLzEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjMwIgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDEt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`
            } else if (resolution == '2160p') {
                var bannerImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAeCAYAAACc7RhZAAAEr2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMzAiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iNjQiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjEyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjEyLzEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjMwIgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDEt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`
            } else if (resolution == 'Featured') {
                var bannerImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATbSURBVFiFrZdrbFNlGICf97TdunWM3RSVsc05BkExRPCG6Iw/RFmcXAQylbiAY27tJGgURRMwIYIBA4pjbIMEgly9EiOLEfyBGn+gQkwwskXoNheXrbAbrN269vUHW2lZt7Wb76/mvO/3Pc/53nO+r0f4n0LryxOx+M6islPurNgxbJ3T/iHok3hNc2Tqzl4jKojdnqkOxx/qcJQNSZp92UA2onlDxulGM4A2lMwAXQPcSk6qDyAqAUQWAzOBCrXb10UkfalsLQ2t3dpgX4aaNwIm0A9ENvaPRSAv6PeW0SS0vjwRkXcBK6oHQZcA/2KyVg7WRCygqmZNSZ55k9BmdTjWAGA2fAOVvkDe4n8VNAX4NcAT2SJTtrujFvB0uOb1lhZn+9MnhygAO9RuX0d62nmQCgw+goG7h7WAF9HlqDwHUkGfURU8gTlSATF4Rq1W+opeJGbfpxj/NAclZQuONqSiwnFjZl8+kALslczKi8BF4PjN80a0AqoqqhQAMCBx00qEeSZiahHdgOgbANpQmq3OV5YE5nSWzdVL9mclEgF3h+sJ0FMhFz2eoSsB9LT0brZ9XrM+5AYaSmagph+ASYi+BfIzykmgIyIBT0frF4osHpoIlehu8uD81kVidnxtVt2hBQDaVJaDj5+ASYB/YGQXkIRoyagt6Ll8eYoiBWGTQe0YhPv7lY66a087c58/AYCPhQPwT4ClAyOTUD6WzMrqUVfA3dF2CCgcqcbb3k5L3nv0NF4NuZ4yPf6rKd+kFWLxzSZz1y8iqDrLVoFOI9P1tshnvhEF3Fda52HIaa6/bmGjz+Oh0+UCVyfuF6pxN18LySfl2gLtCBfDtkC1PlYNqYgErqpoaiJxB1cTN9kWUhPSjmgEPJ3JuwTujQQekB6DRFgBT3vrGtCV0cBDJA4UY709fohE4/TCL0cV6D92LF9h21jgAYlbJhJ/cPUQiSsXeha1zFlxT/C1kP5qefmjqNb6HnrA4s1/KgYJbX8k8JDJ2zpxF1b5PG1ukzU1pis22fxjZt3hArmxH9wQUIfjEVRrEZkA4Lt/Nt6CfAYlooWbTaZ+w2L5SxovH/G/uavqjt8Ou8JKBt35CSAhOOl7+EG8C+bT19sbGVyEmNjYOkuMZVNa5tQDkYiKlpXlYBhngKRwBd3p0+hYMBeV4bcMwxCNsVpPYrGVTsrI+DsS8GCYMYwNw8KbPDh3nyLhxAVMO4vAGPrSxFqtzebY2EVpGXediQYckAfmDwsf2Nu7Tjfhe+0A+APPDmIYaptge+e2qTPSxwofFEgcCT4YXaec+F+/LmEyW3ptCfHz07KmvT9WcLDAn6PBB6PzpJPebcevGn4jNzUz9/vxwq8LiAT+oY4EB/BnWdkkLQlrt+5YzwhnRDQhCoLDcbi7ybN8JLhmWNmeN4HAp4xI1dF9NaVAZBvDMGEIKH19K9p+72ocFp4Vx/bHEwn5jlItWf7Sy1vHA4egZTx/99IYW6/pu64GT57fqwJgWET9ufH12+bE5XiRcAdXz8RYI6m6uto7boHBaJ+1MKlHExap+vw2w308+dzXHcuKiotFdTehh5dfYPWR/Xv2jhUeVmC4WFa0aqWo1AxIKGA/un9P5SjDRg1TpIXnz509O3PWfc3AYyrqOLZ/b8144QD/AUPqR7oCt9qbAAAAAElFTkSuQmCC`
            } else if (resolution == 'Extras') {
                var bannerImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEr2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMzAiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iMzAiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjYvMSIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNi8xIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMzAiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIzMCIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTAxLTI5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`
            } else if (resolution == 'Audio') {
                var bannerImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAwCAYAAAChS3wfAAAEsWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iNDgiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iNjQiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjEyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjEyLzEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjQ4IgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDEt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`
            } else if (resolution == 'Unknown') {
                var bannerImage = `data:image/png;base64,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`
            }

            // Generate group banner element
            let banner = document.createElement('tr')
            if (['Featured', 'Extras', 'Audio', 'Unknown'].includes(resolution)) {
                banner.innerHTML = `<td colspan="10" class="HDB-FF-Banner"><div class="HDB-FF-BannerText"><img src="${bannerImage}" style="transform: scaleX(-1);"> ${bannerTitle} <img src="${bannerImage}"></div></td>`
            } else {
                banner.innerHTML = `<td colspan="10" class="HDB-FF-Banner"><div class="HDB-FF-BannerText"><img src="${bannerImage}"> ${bannerTitle} <img src="${bannerImage}"></div></td>`
            }


            // Append group banner to torrent list
            if (gmCache.banners === true) {
                torrentBody.appendChild(banner)

                // Clone the table header below the first group banner and hide the original
                if (moveTableHeaderOrigin === true) {
                    // Fix padding of first group banner to account for table header
                    banner.getElementsByTagName('div')[0].setAttribute('style', 'margin-bottom: 0em;')

                    let tableHeaderOrigin = torrentBody.previousElementSibling.children[0]
                    torrentBody.appendChild(tableHeaderOrigin.cloneNode(true))
                    tableHeaderOrigin.setAttribute('style', 'display: none')

                    moveTableHeaderOrigin = false
                }
            }


            // Append each torrent of the group to the list
            // resGroups[resolution].forEach((torrent) => {
            for (let torrent of resGroups[resolution]) {

                // Set class for dead torrents
                deadTorrents(torrent, pageType)

                // Append torrent to list
                torrentBody.appendChild(torrent)
            }

        }

    })

}


// Parse the page URL to determine how to run the script
if (document.URL.match(/^.*film\/info\?id=\d+/)){
    // -- Film page --

    // Get and update the FilmInfo box
    updateFilmInfo(document.getElementsByClassName('film-info')[0], 'film')

    // Create and float the FilmFancy toggles
    filmConfigMenu(document.getElementById('torrent-list').previousElementSibling)

    // The main torrent body to be organized
    var torrentBody = document.getElementById('torrent-list').getElementsByTagName('tbody')[0]
    var pageType = 'film'

} else if ( document.URL.match(/^.*browse.php.*/) && gmCache.browse === true ) {
    // -- Browse page --

    // Create and float the browsePage toggles
    browseConfigMenu(document.getElementById('torrent-list'))

    // The main torrent body to be organized
    if (gmCache.browsePageGrouping === true) {
        var torrentBody = document.getElementById('torrent-list').getElementsByTagName('tbody')[0]
        var pageType = 'browse'
    } else {
        // Apply visual changes to dead torrents
        let torrentBody = document.getElementById('torrent-list').getElementsByTagName('tbody')[0]
        for (let torrent of torrentBody.getElementsByTagName('tr')) { deadTorrents(torrent, 'browse') }

        torrentBody = false
    }

} else if ( document.URL.match(/^.*details.php.*/) && gmCache.details === true ) {
    // -- Details page --

    // Update the FilmInfo box if available
    try {
        let filmInfoBox = document.getElementsByClassName('hideablecontent')[0].getElementsByClassName('contentlayout')[0]
        updateFilmInfo(filmInfoBox)
    } catch(e) {
        // No film info box
        // console.log('HDB - FilmFancy: No filmInfo Box')
    }

    // Organize the tableBody, if available
    try {
        // The main tableBody to be organized
        var torrentBody = document.getElementsByClassName('table_other_copies')[0].getElementsByTagName('tbody')[0]
        var pageType = 'details'
    } catch(e) {
        // No torrent table, skipping
        // console.log('HDB - FilmFancy: No torrent tableBody')
        var torrentBody = false

    }
}

// Call the main function to organize the provided torrent table
if (torrentBody) {
    organizeTorrents(torrentBody, pageType)
}
