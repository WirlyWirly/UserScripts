// ==UserScript==
// @name        UNIT3D: ExternalHyperlinks
// @author      WirlyWirly
// @version     1.0
// @description Add additional external links alongside the sites defaults
// @namespace   https://github.com/WirlyWirly
// @icon        https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/monkey.png?raw=true
// @grant        none

// @include     /http?s://.*/torrents/\d+$/
// @include     /http?s://.*/torrents/similar/[\d\.]+$/

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Other/UNIT3D%20-%20ExternalHyperlinks.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/UNIT3D%20-%20ExternalHyperlinks.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/UNIT3D%20-%20ExternalHyperlinks.user.js?raw=true

// ==/UserScript==

let externalLinksList, imdbId, mediaTitle

try {
    externalLinksList = document.querySelector('ul.meta__ids')
    imdbId = externalLinksList.querySelector('li.meta__imdb > a').href.match(/\/(tt\d+)/)[1]
    mediaTitle = encodeURIComponent(document.querySelector('h1.meta__title').innerText.match(/(.*) \(\d+\)/)[1])

} catch(error) {
    throw new Error('ExternalLinks: Unable to parse the IMDB number needed for generating external links, aborting further script execution')
}

let externalLinks = [
    // An array of objects, each object containing the required info to generate and present a external link

    {
        name: 'PassThePopcorn',
        searchURL: `https://passthepopcorn.me/torrents.php?action=advanced&searchstr=${imdbId}`,
        base64: `data:image/x-icon;base64,AAABAAEAEBAAAAAAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAABmfP9mtP9m6/9o/fMAAAB3342I0mep2mbW7WYAAADmtGbLhma8aGbBZpEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ6cAAD//wAA//8AAI/mAAD//wAA//8AAP8/AACcngAA/z8AAP//AAD/PwAA//8AANtfAACWlwAAuLwAAP8/`,
    },

    {
        name: 'BroadcasTheNet',
        searchURL: `https://broadcasthe.net/torrents.php?action=advanced&imdb=${imdbId}`,
        base64: `data:image/png;base64,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`,
    },

    {
        name: 'HDBits',
        searchURL: `https://hdbits.org/film/info?id=${imdbId.match(/(\d+)/)[1]}`,
        base64: `data:image/png;base64,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`,
    },

    {
        name: 'AnimeBytes',
        searchURL: `https://animebytes.tv/series.php?action=search&seriesname=${mediaTitle}`,
        base64: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD8klEQVR42r1XXWgcVRS+Z2azs2kSMjObpC21Bk2hLRRq/EEwYGsf2r40CPqmD4UShM1G2zRSKipE/Ccksbvrgwh56VNKBBGRvNSIWuwPjeJDDbTZqNiEkJ2dxKTJZnfmeO5mN93Mzt+u2vuwy86eOec73z3nu+cC87mw6Uy9bmSPMEBJ0RKX+LNFNbrfQHOUMWhkyKaBsSkG8LUsB8chOZjx4xe8DNLqqw8jGq8jY6fI+KYiBo/DwtDy0q7ecO5eZhIRd5c7BZ1sR5kgvqdoF/6oCgC2D9SkZ5L9lFkfMqwhw0klID3Lg/P/U2r0HWaab7mnB6v03oeKLH3kxIgtgMXmyB4jy0Yp6/aiowDAE41a/FbRJqVEfiJwT/ukeTIkSie2pYb+8gTA9zVn4mXiYEfxmcCE04oe/6TUTlMivyKyA34AbOQAfwoCdMqp+M+OAHjmuSx8XxqcDKZV/dM2q0NN6b5I+/+SXwAFb3O1YvDJUiY2AeT3PDl9dZN2l+zzYMM9T+UM41plAPIRr6py6FCxJjYBUEbvU0bnt9qCrgSCu4uFZ11pOfqayczhijEAfKCmE29sAsi3mmnc5tVuMfyKDDvdnHEmDN4NyI5b33dBsBoShba6hdgsFLKPUfbRcjvhnJqOf+zH50pTz86MYXYRkDf9ABEYfKboiVeAK5xmrM8zxNoyIxA7lHTsSiX0ppWeZ0w0x0oL2Z4E9rcih5ohrUQ76YUvbVEKgVYvJbNb+W0xzB+9mBAF4Rg40c+XGpAanArQa/lRSqqxOLgpmhQMba+fH5yvBgCvibWccdcVAIPvQJMjd6j3H7WlSBTarcpVEQtecg1sirYgskSS2mBrIEBXWEt8XjUAuXuEivGkY3wqRHcADMbCeuLFagH4kWteA78RTXvtGYKsFBBauWBUCeAHAtDhCkCTuyeoXQ45GjAYUvVEb6XB8wPLSmbWqxVd27DIAini4UoFydfAwv3ravQoafm4h9mcFJQO+m1JPRx9zDDxip26lnneOIaT80SV7GpIAwUp1wuNqdh1z+AGfuMlxfcZZs6HUbkxZOljQBKFmLUwC0PqWdKU034y3wJguaW3ZT27dtu5He2A4BQiTFEvrxF7ewDhcd/HsRVAgYW3iYX+Sh3827V1JJtJfuvVt/8bAL42tiJzw+6y8UAA8LVx3cLxBwXC9mJSYOKL/2w7aAZ06gyvqxlNydjntzvKnefb9l3qlFumiaMVAbCwwafel73EqiSwTl8jIIjDfKTDR3olTV/7xe7Q8wRQysji7zPPmYgnaGv2UVY7GMJDhX81onmWAlwjxZyQxZrL1lGOC1V2JTNAAZ+nn3XF5/8Arw/vm0KgPqUAAAAASUVORK5CYII=`,
    },

    {
        name: 'Simkl',
        searchURL: `https://api.simkl.com/redirect?to=Simkl&imdb=${imdbId}`,
        base64: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACN0lEQVR42p2Tz08TURDHv/urlNIGtB6QnuQqkQPam9QrniTxB2o1RA8iiaKxtAZNtP5IKKiIGBQviuhZ0cgJId407UEa/B+antva7nZ3fTPbhW7kopO8zHtv33zeznznScH2XT8ARPF/9l0SAFNMZHfHtm2Pd02SJI9vmEkA2w2gj6FQCH6/H6qqiLUMOm7ZFgzdQKlcRqVS4XMNkM0ACg6Hd2Ps6hXE+vsRCgahahpkASCCZVmo1WooFotY/vQZb5feoVqtEsQBmKaJ0csjmM5MMpmAFETDvU1RFP7nUqmEoTNxrK2v0569lcL88zmci5/lmyanppHN5hppgYNPnjiOwWODvL4xnsTrN4siTdUB0A0LL+ZxeugUA2afzSGby/G8VtPZh/eEsbezE4VCAT838uw9KUzcTOH2rQk0q0H77tB1nYu4ufkLd9Jp9rIsOwDKNdLVhWQygYN9fayEz+fjoYliqiIFUobWZC8XXiGRTG3/gSDhSCyG7u59UGQFq2tfWa6WFr8YPgFQ0dt7AI+mMgz/srKC+Plh1Ot1ByCKgfdLizg6MCACf+PxzAw28nnKA24/9fTsR2o8gUAggA8flzF84SKptN0H99N3cf3amKcGbjc2NQ7bvQcPkRFKbdWADkYiEYyOXEI0eggd7R0iX40OgBBUI8MwuAdI3idPZ70qNPd+sK0N/tZWaCItSXaeCAHMeh1VIWdZKOE2mNvKOz8mZ/HXA9rpMa2KyWFw1/+TEf3bH+Z0GEFGcmpoAAAAAElFTkSuQmCC`,
    },

    {
        name: 'Trakt',
        searchURL: `https://trakt.tv/search/imdb/${imdbId}`,
        base64: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAzFBMVEVHcEzjzu2gQcT////BKX/1AxL8AAC0J5OuK5/CHHe0Mpq0Mpns2u+kPbuoN7GdNMDkrcbsq7rWnsnx4fHo0evavOXAJX/LDmDZstvFFm67ec2uMqOyKJe6fdOnLKuhQsS8LYnWs+HOb6S0FIufGa7tABHbaYyzIZK4FYXZAD+iOLvlx+KhMLm+d8WZILvQAFDly+irF5rOlMrRbp+pRbrVbJjXqdPLcKvAc77Ib67qm6rXj7fjACntiJS2R6bGJ3TLfrf+/f6zV7iqW8pWRlinAAAADHRSTlMAycYtxsYrK/39xsbNoycUAAAA30lEQVQYlSXP2XaCMBSF4dNWRdskQECSQASKzEMZXM7a8f3fqUm7777/4qx1AIznZRi2bWuaUfRoABhxMXH+qrb+iczNE8xKh566zvf9jbLzAKsrHYOQ1HVtKqM1COssAxJijP88qHCU7w1Pcesru2/ArKRo0MDTf0c6lNRFw4S0MYbe3nlb6h60U3UJKnvvxVv61XA3JYTokAtd0GEk5LsjcLNz9qHKpwyC4MRDyO6XngnPKwspRzotYZ45lzzf75LkeKZO8QKLLLvbapbatYzVu4t5dquqnjEhVjMDfgGG0BwicSWbxgAAAABJRU5ErkJggg==`,
    },

    {
        name: 'TvDB',
        searchURL: `https://thetvdb.com/redirect/imdb/${imdbId}`,
        base64: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAkFBMVEUbJSVr1ZH///+MkZGusrI2Pz/3+PiJjo5iwoVnzIszWkUhMS1MVFRka2s1XkgyWEQsSzw7a1AdKiglOjJkx4hctX1Snm9Hh2E9cFMoQjdZrXhOl2pDfVsqRjlfu4EkLi5ASUlLkGYvODgvUkGhpaVbbGV6gICYnZ1IUFBWp3RAclbNz8/DxsZscnJfZmZRm22q8P4tAAAA60lEQVQ4je2R63KCMBCFd1csCUmUWwCBioi1Kr28/9t15VZmZNoX8PzYZHK+bM5kAZ4aFaq//ShGaZM02+7CZcDDSSIvysd2r+zs8wlKASpz0OYXUHy6URNQA6xp5bzMWkiMt0oIwW4sMFtrcwe0Po6ARa9ba5SqqU/EWjldHYCk7xD5WEDyRqeqf6Jy6ADDzS5DCdbfxWfSYwZDQ9KyBwQ0zBo6j8A7XXogQMzAu3ISJfHWUtveM3y05AwZGkRZBlfMg4J33qfrutpw+Zr+GueqH/86nPt7f2Ealg1pv9OgiZbHpTb+PxN/6ge00QyWHXgbEAAAAABJRU5ErkJggg==`,
    },
]

for ( let external of externalLinks ) {
    // Generate the external link for each defined array item

    // Create and append the elements that will contain the new search link
    let listElement = document.createElement('li')
    let hyperlinkElement = document.createElement('a')
    let imageElement = document.createElement('img')

    listElement.appendChild(hyperlinkElement)
    hyperlinkElement.appendChild(imageElement)
    externalLinksList.appendChild(listElement)

    // Populate the <li> and child elements with the required data
    listElement.classList.add('meta__externalLink')

    hyperlinkElement.classList.add('meta-id-tag')
    hyperlinkElement.href = external.searchURL
    hyperlinkElement.target = '_blank'
    hyperlinkElement.title = external.name

    imageElement.src = external.base64

}
