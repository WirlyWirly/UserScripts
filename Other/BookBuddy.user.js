// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        BookBuddy
// @author      WirlyWirly
// @version     0.1
// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Other/BookBuddy.user.js
// @description Your buddy when searching for books across different sites
//              Written on LibreWolf via Violentmonkey

// @namespace   https://github.com/WirlyWirly
// @icon        data:image/png;base64,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
// @run-at      document-end

// ----------------------------------- Matches --------------------------------------

// Audible
// @include /^https://www.audible.com/\w+/.+/

// AudioBookBay
// @match   https://audiobookbay.lu/abss/*

// AudiobookDB
// @match   https://audiobookdb.org/*

// Audiobookshelf
// @include /^.+/audiobookshelf/item/.+/

// Barnes & Noble
// @match https://www.barnesandnoble.com/w/*

// Bibliotik
// @match https://bibliotik.me/torrents/*

// Goodreads
// @match   https://www.goodreads.com/book/show/*

// Hardcover
// @match   https://hardcover.app/books/*

// Libby
// @match https://libbyapp.com/*

// MyAnonaMouse
// @include /^https://www.myanonamouse.net/t/\d+.*/

// Simurg
// @match https://simurg.world/torrents.php?action=publication&id=*

// ----------------------------------- Permissions --------------------------------------

// @grant       GM_addStyle

// ----------------------------------- Dependencies --------------------------------------

// @require     https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/waitForElement.js

// ----------------------------------- Script Links --------------------------------------

// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/BookBuddy.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/BookBuddy.user.js?raw=true

// ==/UserScript==

// The URL to your personal StashApp instance

// =================================== Configurations ======================================

// The URL of a Libby library
let libbyLibraryURL = 'https://libbyapp.com/library/__YOURLIBRARY__'

// The URL of an Audiobookshelf library
let audiobookshelfURL = 'http://192.168.1.105:32060/audiobookshelf/library/465c95ac-e562-4ac0-b82a-66a2c3c2df86'


// =================================== Site Specific Handling ======================================
// Based on the URL of the current page, parse the necessary bookData to generate the floating BookBuddy panel

// The object that will be used to fill in search templates
let bookData = {
    title: null,
    author: null,
    series: null,
    narrator: null,
    year: null,
    publisher: null
}

// The URL of the current page
pageURL = document.URL

if ( pageURL.match(/audible/) ) {
    // --- Audible ---

    // The title of the book
    bookData.title = document.querySelector('h1').innerText

    createSearchPanel(bookData)

} else if ( pageURL.match(/audiobookbay/) ) {
    // --- AudioBookBay ---

    // The title of the book
    dirtyTitle = document.querySelector('div.postTitle h1').innerText
    bookData.title = dirtyTitle.match(/^(.+?)( - .+)?$/)[1]

    createSearchPanel(bookData)

} else if ( pageURL.match(/audiobookdb/) ) {
    // --- AudiobookDB ---

    // pagination

    // The title of the book
    bookData.title = document.querySelector('div.book-detail h1').innerText

    createSearchPanel(bookData)

} else if ( pageURL.match(/audiobookshelf/) ) {
    // --- AudioBookShelf ---

    // pagination

    // The title of the book
    bookData.title = document.querySelector('#itemTitle').innerText

    createSearchPanel(bookData)

} else if ( pageURL.match(/barnesandnoble/) ) {
    // --- Barnes & Noble ---

    // The title of the book
    bookData.title = document.querySelector('h1.product__title').innerText

    createSearchPanel(bookData)

} else if ( pageURL.match(/bibliotik/) ) {
    // --- Bibliotik ---

    // pagination

    // The title of the book
    bookData.title = document.querySelector('#title').innerText

    createSearchPanel(bookData)

} else if ( pageURL.match(/goodreads/) ) {
    // --- Goodreads ---

    // The title of the book
    bookData.title = document.querySelector('h1[data-testid="bookTitle"]').innerText

    createSearchPanel(bookData)

} else if ( pageURL.match(/hardcover/) ) {
    // --- Hardcover ---

    // pagination

    // The title of the book
    bookData.title = document.querySelector('h1').innerText

    createSearchPanel(bookData)

} else if ( pageURL.match(/libby/) ) {
    // --- Libby ---

    // pagination

    // The title of the book
    bookData.title = document.querySelector('h1.screen-title-details-title').innerText

    createSearchPanel(bookData)

} else if ( pageURL.match(/myanonamouse/) ) {
    // --- Myanonamouse ---

    // The title of the book
    bookData.title = document.querySelector('span.TorrentTitle').innerText

    createSearchPanel(bookData)

} else if ( pageURL.match(/simurg/) ) {
    // --- Simurg ---

    // The title of the book
    dirtyTitle = document.querySelector('header.publication-heading h2').innerText
    bookData.title = dirtyTitle.match(/^(.+?)( \[\d+\])?$/)[1]

    createSearchPanel(bookData)

}


function searchTemplates({
    title,
    author = null,
    series = null,
    narrator = null,
    year = null,
    publisher = null,

}) {
    // Using the provided bookData, fill in the searchURL template for each site

    // Convert null to empty strings for search templates
    title = encodeURIComponent(title)
    author == null ? author = '' : null
    series == null ? series = '' : null
    narrator == null ? narrator = '' : null
    year == null ? year = '' : null
    publisher == null ? publisher = '' : null

    // Convert a libbyLibraryURL to searchURL
    let libbyData = libbyLibraryURL.match(/(http.+)\/library\/(.+)\/?$/)
    libbySearchURL = `${libbyData[1]}/search/${libbyData[2]}`
    
    let searchTemplatesArray = [
        // Each object in this array is a search template, for which a entry in the bookBuddy panel will be generated in this order

        {
            name: 'AudioBookBay',
            searchURL: `https://audiobookbay.lu/?s=${title}`,
            color: '#D90102',
            base64: 'data:image/png;base64,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',
        },

        {
            name: 'Bibliotik',
            searchURL: `https://bibliotik.me/torrents/?search=${title}`,
            color: '#ABB1B7',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACDklEQVR42rWTW28SQRiG39ldWA67S5ZFW2gXIdDekJhy5Z38Ar3wz/BPtNZ4IYmpF/4CTWoasYTQVktMLBctIodyEIVClbCF8euapniI0TROMplkvskz8z4zw3DJxv47IJPJcEEA3G4vFEXB3FwQKyvX2V8BVlfvcUkUoahXIMscuq5jNBrD0H0YjE5xVKv8HrC29oDbdKoGAgbGYwvz81cxHJ5gMtXg1xmKxbeIxeM/Ap692OTFQh4erwKHQ4LfCNDRZaiqBlGUCMhp3oH9/RJMcxGCIF4A1tef8ErlkBbI8Pl8kCQJLpcLoYUg+r1jAogIhUK0cxHRaITqDvAeB8vv7vGnjx/BvBahBQtwyk6IZK3TacPplKkHSZwETdOwXShAIFAikUC1WkE4HAFLp9O82TwCp9QejweGYSCVStGoo/y+Cj61EI8vI5t9aUOWlpZRr9dxJjccDoOVGx1ePjhAIfcKe292IE4sKP4AYrEobt+6g+GXAdqtFuUXoKkqRQqh3+/bsWu1Gthhrc3PPXy1xtjeymJz4zlUB8ONm3FyEkUul7flWXQbbrcLi6aJZDJJLqIXEmdBZw5KpXd4eP8uppNTMm5iMBjYNT6dwO834CbBIkF/eQezICYwfOx0cTI8RqP6Ad1uC693vseUvap9qj++xFnYeZMkEZ97fbSbDXwi4D9/pp+hl/6N3wCp7b3V2XjkAwAAAABJRU5ErkJggg==',
        },

        {
            name: 'MyAnonaMouse',
            searchURL: `https://www.myanonamouse.net/tor/browse.php?tor%5Btext%5D=${title} ${author}`,
            color: '#F1C91B',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABL1BMVEXqwRfQrBSDbA2cgQ8vJwWtjhE1LAWOdQ5dTAk3LQXTrhULCQGwkRHdthbVsBV5ZAwfGgPfuBbkvBZRQwgHBgEBAQAyKgW4mBLCoBOfgxCHbw1wXAtsWQuXfQ/FoxPjuxYcFwNcTAlmVAoAAAAaFQPXsRVXSAkXEwJANQbOqhSWfA/LpxSEbQ2ReA4NCwGrjRHpwBcrJAREOAeWew+Qdw4VEQKihhACAgB6ZQwmHwRbSwlQQgjPqxRrWQswJwUIBwEJCAHnvxfcthahhBCihRC+nRO0lBJCNgYhGwO/nRN0XwsDAgBvXAvUrxUbFgM/NAaBaw0EAwAFBADIpRTiuhYxKAWtjxE2LQWTeQ44LgYnIARWRwgUEQKbgA8SDwJTRAjZsxWLcg6MdA67mhL///9Z0gVVAAAAAWJLR0Rkwtq4CQAAAAlwSFlzAAAAuQAAALkB4qdB6AAAAAd0SU1FB+IBHQAcLNzkh2UAAAD/SURBVDjLY2AY4oCRgDwTMwEFLKwEFLCxE1DAwUlAARc3Dwqflw9dBb+AIIIjJCwiKiYOYklISknLyMoBWfIKiggFSspAoKIqoaauDAEamgwMWspwj2iLgkV1dJXhQE+fwcDQCKbAGCJoooVQoGyqymBmrg1VYAEWshSyQlKgbM1go2wLVSAFErATl7BHVuDg6KSsAFWg6ezsos0grqKMAlzFlU0h8m5MQCDtLooqr8ysqOwBlvfkVsYKvLyVfUDyvn7+AfbYFAQqBwUD5UNClcMYwrGbEQEMT+ZIZeUoNVGs8hZA/dHKOEFMLMgBcTjl4xPAPjBLxA6SkhmGDgAA431BkUg7tDIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDEtMjlUMDA6Mjg6NDQrMDE6MDCendM3AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAxLTI5VDAwOjI4OjQ0KzAxOjAw78BriwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=',
        },

        {
            name: 'Simurg',
            searchURL: `https://simurg.world/torrents.php?publicationsearch=${title}`,
            color: '#FCD57F',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAAEhklEQVRIDb1VTW8bRRiemf2y12s7ce3EcbAdxSWJkjZqUSmqWuDEoZWg6gFOfFVC4szv4S/ApRfOSJEoBQkKpDRtE5zYsWNSf+16P7yzM8Pr2tjUJIoVEeawmhm/8zzP+2mEMDrDdabgZ6j7aGgjRKT/wiMAiWhkyCH1d3Bz5/psRMXluj/87XSbN9filwqxZ2WbiR6A3EdZng9fLhgr2che1dm32Omg4dXCtHzzagoh8eu2uVX14Gbgi6FiTSXLi7GPbmaToVNGKq2TT27lCtmIjIU+UP43gSQTRSYciUuriU9vvbKYUEZRnMAdMF5KqZ/dzq0vxxkXmowxGagcEDUt2qUioIJzeu21mdy88eXXO48rXToBOkCszoc+/6Awlwy5ts8CHghsOYM4DwgqDb/6p21EJFkiFJbbvXI+dqGANh7WSybvs4CkiIKgMW0fvchf7zo/JV27mFAECpyuYHLgB16XVWpOrT3QNqiigKGZqJSdDfcqlTHLDsoV+/ULU+9cT4Yl9GTPBZIQQV98WHhjbfrBb02oEBWj999O3n0vm4qqxb1OZkYLyYT63HXZg8ftRxWvL2IQairQo5LT6dAgAAuuyFiVMDw72HXv3s5eWdJBbFTFmZiSjslR8AOhq0v6x+9mSzud4q6lSr1kdiyf0qBjB1tlt1+jYDbK5ZNq9/5m07J8LGFDl1PJUBCIWt0DiBtrUQhlPqViwRHjuZQGxxvr8XLRBgMa8PQ5LRaRAcx22Pe/m9uHo2YahAioIAilmpeeUhbSOtQAcGCMbZd2PZafDecS0nLOMJtdy/QX58MX89pK1tguQk75bDKUSYcliSCBf9wy7/3Q8IcpQmhEABwQKNOiCzOh6agC9uD4VFTdq9g0ENkZHfrctBnkdyYuzyXCu2W33vbPL0QjGlbkHn6x6t67X3/ey9dovUQA1y2X/7FvGwpKxZSAMixQRFfKB06j0bVd7jPcDUSrRUtV1/VZLqPHIPUCHMYPn5pfbRyW2uNTYJwAONoe36k6tBvEwrKh9aRlZnU9RGyPt2zmekxTcDYdymd0aCgo66bpf/tL65ufWgfOS9r7Xhw7FYA5E5PW8/pqNhLTJcT585bftDlnfDoiJac1kG15fKts/1x0yiY7AvsFw7EEQ35oLkMjMG7fWjKmDEVw0ezQjafgD3Qct+mo6fpPxr6DTh67HR6hHDoUeUzIQhCZpBIqZ8L0WK3DKcbHyh6+H47rf9yMb8HHlbmw8Om5mKqHIaUiYSivphSuKJv7zrj1v85HJHnMBghgUl7O66oqNdp+vR3IhKQMxfJYuXXyMDwhRH0ySKaqEs4RkYgkCUqRohLLHa/IMWX948kegB3EGguRjishFWGMKEObJXenTh16XO2MuCYiACDORUInqox9Kg5NtllxDzrBCOb43WjYHW/T+6VmsWqbEYIVFT+3glpnovjAw4k8ADsYvx2HpeOy1+XfPXNM/+Tg9HRNUqZ9O/g2PFZpQrBQfbL09h9OVEV9U2i6UjMQAv4TzmypEtHkSdN2Zir+Z+C/AAQdCiiaLYwNAAAAAElFTkSuQmCC',
        },

        {
            name: '--divider--'
        },

        {
            name: 'Audible',
            searchURL: `https://www.audible.com/search?keywords=${title}`,
            color: '#F7991C',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYmZjMzg5NS1iOTJlLTQ4M2YtOGExNy1jYmE2MWM3NjBhYTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDBBNkJGN0VGM0NBMTFFNDg2NDVCM0U3OEMxQUFFQjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDBBNkJGN0RGM0NBMTFFNDg2NDVCM0U3OEMxQUFFQjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZkZmVjYjYtNmRmOS00OGE1LThmNGYtYzIyNGUwYzJlZmU5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjNiZmMzODk1LWI5MmUtNDgzZi04YTE3LWNiYTYxYzc2MGFhNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlyjWMMAAAKoSURBVEjH7ZVLTxNRFMf5IKIYjaDGROPbxMS4UcTEaFyIr8TnwscHcKOpcePGfd8K1FdosQrFNtSFhNbgA9tKoqIWLa8W0MBU5z5nPHdmWse2ghVk1cldzOTeOb97//9zzq2SrYv+66iqACqAhQbYlogxvwD8YB+NWfnYcwVPqfqDp3n6FY3ZsH+/bK3+dwDuPM4zMVXhytQgH47woac8/VKRJ1XTw8cT+PGJ8gGuWvbBD0FJ1znkXlUwi+5sIz1XlG8DeQz7+Eh21f0tADWvY+9bcdve2dSrJuHzSnZEZyhf36Hm9bMDYL8kfEG215gD4cAxQCrTKZUhGPAidhA4ClPo1hr+5YnBmHxbfNwiwO2tBZ98tFfFEk/3CQ/GE4KRNyDdh+7vhLxiA22GVp8CpQCuWvrs2u+71kzuaGT9TSJVzKnpWEZCZyC0ASFZ3HEEFvChbnAFPzwo1thraPQqhM0B3CvFASf6zbqjprXY1zBDQdCoRWVYMOgP3LpLiGNfKrblaxAHVVUImwM4lytSSlORszdu2V0iH3B7Ix8MKd/HYMALbj+kHfGwygkkG7q7XVOijiWcEEREklIQ1uSBcwVUk8qpmMuOktBZc3QSvkh7r5PuSzRuV+QJ3VH64oY46L0deq2R4Gn4UXOG0rhN16fQZOzdzTOvDQMHQ8izWc8isz3o5mr+uQsAkEi6JsiziSeDxl+ZGPbWz1gHtsWk57JKJN1AGrEUmw9xsf+A7gRUHCzTFkvwXtypSlcyatnAkp25ZhDHvj0lXPHWw5SxJhlELRvL70XBk4o0rAnOWMKRl1WkddyeM2yEBE/NoZtCU0o4AKDHAiS0NhPV+acWVN59YFbjVxMtpdscLhwozohF+AnOR0s5Py83GmQk8mypXPoVwAIDfgK8BG7kFF2MiQAAAABJRU5ErkJggg==',
        },

        {
            name: 'AudiobookDB',
            searchURL: `https://audiobookdb.org/search?q=${title}`,
            color: '#B516A5',
            base64: 'data:image/png;base64,UklGRpABAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSJQAAAABgFrb1vLohlFRA4xVsCMbxSi5gzSRFRfHMA1MBahIjRzFDE99ENQRMQEAkK1LrYVVYF4T0f07iQ+VXPYTCf9FLstaAo03tj6+zpY/GzqF43FTMDd/NwT4JpuCInO9IQCDDSn6r5tJXP3TJpwjYksx5N5oI6EH4pbw8UEbEj7+JlzWEwn/Da67VwlzFaPSk9pM6gEAVlA4INYAAABwBwCdASogACAAAAAAJagCdMuN4T4B+AH7Af4DoENAuy2GBfMPyK/pO8AZ4B/AOkg9ADrAP0R9GD2AP2x9FD//hHLBwAD+/xNLf+0+pOFrhZvUnC3ehdnCXOFq23w0L/8nzXDG0pKSeXWsM+IObZzkeC3hYQz2f//mdGGBZ8Yof7AwT3f//M6MLxz//4eWubFoRfiQX45Vnifo//4eWuQk1kJ2qUuoX9gDIpBw9EhH9BLz1NIYxGyDhTFSiYLQJNm37RjdPE3rjP0n0RigHK9l+TN7NbAA',
        },

        {
            name: 'AudioBookshelf',
            searchURL: `${audiobookshelfURL.match(/(.+)\/?$/)[1]}/search?q=${title}`,
            color: '#CD9D49',
            base64: 'data:image/png;base64,UklGRgoFAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSLUAAAABcFtbW9t8rZzwEqBaHkesJDZQmIiOLTi0Ss4J/d8GETEByFS29el+T76zZwiaYXxmTkO5Zeeuz41Xt8vS4SkYdMYlPkVj9UfHp3DUP3bhKR52X+5JdADKK+NqgOFJ7aEmzqjsk2w7VutZPrHSnXXjJVbyLN+yWsuq1cgZFXpOD5iVsRoADaMBgF2QC8UXdJSKGr+rKBMr/NdBImjkFu66ZW122Gj6MWccDARV3fp0uyXfWoVMAFZQOCAuBAAAMBgAnQEqIAAgAAAAACWwAnTKEcDeLfhf+x3+O5wzS8wChAfbN6j39m9QHOA3QD+q/1DrAPQA8zj/S/rn8Df64f9D/Kez7dtHyj8Ruo37GepH7kZd757+LH5VbwB6mf5f+TuWR/Ef7L+RX5VeIBzDX9H/E/2A/pP8z5B3+Kf3L8pv539F35F/gP5n+03+K9qHyR/dPyl+gL+MfyH+t/1z+2/5T+8/+//n+Ob0Nf0ZPLbUyPvpR4d4rKozFN/+7xaI4GbMOTEtWaEdAAD+//8b/pGk1/kVOCP81Oq8np2f/EHX5Vu91x6HnbWh3YbFv21wzNd0h9HsKusQk8ULRS2+lVIyY1uosMRXmo626uqMHicPeXNFUFXg63w9Nlit1yEEvNKGGrq4PSoNe9JFuELg6hGVA/FsOwQAFdJ8j57dDEcya9HJ6BxD86/8cZRXyru+HdTxCKF0WYy6+4qJk61EvZpb5INN5imySfyYw7XGzD+ipGsV1odEs//tCP8/6AeqMZSRlIQJkhLyGZIY7WQtKiAdf8rF+/fFr8Nkv//Lk3EjyuYa4qeCsQemSJwT8xT0vtSNIp7DhL7Q0pp5ay7OjKE3/dDi3Lz5dNuRNJJ/nTs35xhTfIaqk17Dfd7Gl0XQ2BvStT4GcSvpxjtsBgz6fi+XrJnAJUnKNm01c/4A/uzLP/++G7sPz9R5WLBi5NB6r42//+FjBWa+DSRxv/n4wcPXaWxHIPrFBlXPFuuc+Fcyi3LP+bnhPkoRrFhOasabpsH0oBCBOiAzagJBvyzXCfzwbNc4TfN8PJf//SWWb7si7ERAun273dHSn9RqA3LRuoCdCH6XLLhpYWOnUACl8jbU+OX0ZKTD1XWrf8t3vbj/U8DRg7P0TIMk75l7/SXcR+pofwcc7eaUKhtWoBBjBe/zWlrEXoHuTyZydAxVnlUJyFXUiaWBvmm3JS75gUAzr9TasvWz/l//zb6Hvg8aU+vFi2IXUh7dgnP1NYcnzUcDKff5AHhzBnWQYSg4d/FtZ/+E5nxwv9rep32/+Y7+l8oUXdjVwMRgX//27c6L0RPS6usSQtl/vPAx4pi6enQb0naGnUF3yqtMi1JgMaknd72XLiexrNb8aicNjIfehcCpfxAcdtw2zofVuz6bz4OI0GqGpZWG+JC2Q5DmznLJM5xO5zNp/O02mjHyfM8OW0wPkzMtkfPV/SGw9i9B/4Vj0mu3fHMWLnnw9wu1S9XglGBEJxtyWnQWWg2xeRo4mH/XnNx/xvuvOo0tBpYKzFtIpoMeRTIxn6pxa1Id55gq+nFwFrqOQmplpZRb4CRLL2P7p+gbnngqDlNLdbCYR/Xgps206OnMpto6YJ6Lurfa7B7Vg481wWJZj9/GgfCr+Jz9krPwhxpnCvw7kOpU8n5mAwb5sH0BgP2FhxxAAAA=',
        },

        {
            name: 'Barnes & Noble',
            searchURL: `https://www.barnesandnoble.com/search?q=${title}`,
            color: '#D0B447',
            base64: 'data:image/png;base64,UklGRkoCAABXRUJQVlA4ID4CAABQDgCdASogACAAAAAAJZAC7L22kF4A0IDrAOeS9gv9c/2j9l2jI/iT+s2WgeY/h5+u3920rX4n/jlnAXzP+m/kB+Euuq/jNrl/6r+N3ue5m3nf/Oe4P/Fv5V/c/yf/f/lAP1yOzXOmJyngUQ3Lu3mos0kYm3hvPoL2YAAA/v/+RbxPN4LnQj2t2HbCyBSkS4EMGiGqxxj3gRD40FJoKn+gHKpD9OOiLaOJlEBln8Zf/gSUgtmoAv4Oj//cKKW/PlbNU/9OmN/37rkLcxECVZjhfvc8KSITp0+/MXw97rf+CY47/4mPwL+OFZL+qKaTV1nPAdso1J+SD0g6A8hjPnqFgz97sOK1oQ6ryk/5YP7sp211DYf4y+F1GpR3yb6p+YWxr/5jnlXl+mNTneB0W7AOngCxdI6/bWVErW6LvEKP35+dHbu4wFplGj3BNKB4O+S/9Kscu0ujfERy4d1/bBnmYp3//8UtTvXWfKpC4W3j4ySmGHTUfTPzmLM9pCOLD/6rH/ELUXgHYssBD9pf+r62GrU7/3pKPkmF/Tt8/CtvQxVAZw5uC59W35m4p//sL3NoZjgMbgACO/9af/QD+zH24jZrIeFkk4Fr1Ro5Rbwb//fUuDakU6GyqqRTBY6s4q/+6rOLMn2xxmtNW3FpdiU1c3DeLGTfwNDeG32ajNIb6v8pmi7/jFCP9D1M3eJxvPGdm0fp3kV+gYoB1TgMAOacVf/a++/4iJKDYsz3riS3uDj4fHcjsFgXlVVapAAA',
        },

        {
            name: 'Goodreads',
            searchURL: `https://www.goodreads.com/search?q=${title}`,
            color: '#685142',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAM1BMVEXr4tceGRU3Mi0rJiGEfXa3r6be1ctRS0Welo7Ryb5eWFFrZF3FvbJEPjl4cWqRioKro5qfHZf1AAABR0lEQVRIid1Vy7aDMAiUvBNj9P+/tkD1NI09YJb3zkZbByEzgMvy/1Hj5mb42QBAmghwyId1IoGFRxlC9TXQzUr8prEd1Q0Q05Lpuiv8natgGIw0VeE3ptq2u8IxWeGzKtD4ACRpUfiJ+ZdTASO8HGB6/rJ4rClI/IP42+d3sH34D7Ds/TExY5QCIgwE+kOq6dZp5IlkhBmes9OSTmWogFWWMrj7mcEKfC6hq4ATyF6Xflp42hSrc98MRU+AM49Fv4UN8VG3stlx96nxWFhtGs72uxDV97Ow23rO6KHSuV2poYM/t4ACFlIv44MdlP4fsZFRIedcvc/5QU1fEqGoqzLR587ooW29t124wcyVTF3EeIDzLviiN9+A+KCoL6xzHwfefHKG3GJpLh2ecDh9gMpNVnmPjcZR58qdVbfLBQ61ceb7+YfwAuBRBwiCAUZUAAAAAElFTkSuQmCC',
        },

        {
            name: 'Hardcover',
            searchURL: `https://hardcover.app/search?q=${title}`,
            color: '#6D88F8',
            base64: 'data:image/png;base64,UklGRsoDAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSL0AAAABgGLb2rLl+R1I7kmjuzQyi+bQYAI0d4jeiA7JdQ7uLsktuT7ofS8ziIgJEGZ2Q7Dw7eXXqnrEiurRPzMZufOKzpp41N+pqUHOuZoHQaHXSmyFapQKzf1bFacUcePsIMJRaJCTgcRzRhHhKLTM8UKKOC2IcF6gZ4pCzZxixJOzgghHoRFOApLOGUKEo9A25d4NKaEceyJidrvVHSnwB/R+slQeIqZVf90dTuUJ0334x/VmV5Kw3bI6R8p8xRgAVlA4IOYCAAAQFACdASogACAAAAAAJbACdMoRwN4x+Gf6wf2Dn6dp+42TN8x/5z8Sd0w+2btAeYD9QP1V3wDgAP1G9L79Vfg6/ZL/VfyD4AP45/Mbti+S/Sr2A3fI9f+dfkPntvxE/Yz/R5hv+H/khqi/9u/JXXX/7n7QPiC/l/sd9qfzp/oPcC/kn8r/tP5S/vr4YPQi/XY6Z45DtK659JYXoRFWRkyH4T/jKs1mKekAAP7+t1swAuuAVUa0VxeSUJxaHb5J9Eno8P9fzGR7VLpv3gFCGPw0ITnV4/57NXs3KY5LQ/GjuCp7cRXmpSfj9///5nZ+vLCgTlYT2Pvw523n0C+5/0xFJsBMQPWouFU+KcZ0vsI/mP5L9asFrg4BYdaMoH7vhbkTI775z/biA17HtzQWwDxtMvfSrKL//4UH/4eBbaO7f/px+mv8+TBsAM7416vK/PDl1N48q6luAjXHktlxorGc0Q95oSOF/5M3YGfq+OAtFfLuZrockPgi35CrMyxHSGogZqoW5s/b7CFgwb4nJefT4zsxoNQR+66fYtZK1eW2giKooie///wWpqmoBaopdXJHoo6i1mb1flmWC340sc5BEbou8YU7KzixEA3NnDPJF+Q7Yn/w2SVlTrjj0fqLdNfXrEK582SUIhewzYZ4brqZxilxE9syee/N4yCCkBBiRcYXXp/vM37UPgP58S1w4dCtU09CoxO0DkjJX5yQo38r1dKtxnhWo+Yr+VA4nX+pP9/KjoDmHXLtmUD8crUQ5JEFzWmoaUTbgYfEwMwf84CnQF8bcV7ij0EMynyXOnm0kIJ8FqsaQALv5L9pLXXJaWyN39CeBlqhF2Lj8Odj0OYe5ap0TNxYHpT/Ja//qzHYCoLTjvUT90f/W1dSgCVAUM0q7/o5DuaQB839jnoR0vldqeTuW3ISNSf/VCJH/1MxOlVgsk3L4AB16W5/nvoPaBzaRc+nmwUpYSoATO3S+cC1sHoiIcAA',
        },

        {
            name: 'Libby',
            searchURL: `${libbySearchURL}/search/query-${title}/page-1`,
            color: '#A81C49',
            base64: 'data:image/png;base64,UklGRgIEAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSAUBAAABgGRbmyHpj2rbNma27Z7adq/P5iLKNqcVMYhiR8a/g4iYABBNrWwbmZ4eaatMBanp23dqb5jzsFd9t52urGBDHRFWbxQoaHmlEYX0tUVENWaPSLSPqf4bc0SkOsb+aXVEJDtakxS8RaS/FSRsUXl0CwAyNBFETQbAfgR1H9IecR7TqjU4muoOP46/Y4Li0IkFjsMX8CYpDp3sCuAEumq0ONqa9Gec53Q4xTkFyDVgGHIB4JjJY8cAACU/8n5KEqDDI8vTAUnJkkeOZ4kkg9QVrwzvSir8T7r/mBL2101AlJRdmMRMF2UEFJKi23djiHHOQsb32yICEklWw8Dy6uryQEMWAUEAVlA4INYCAACwEwCdASogACAAAAAAJbACuVQA00nkH0Ac4hqJ2Y/Zn+Z5bvyT/Zvxy/oHaA8RH+ufjlwAP07/zPAAf5L+V9YB6AHlQfp38Gf7UfrB8AH6h3an2O2MH9i/Hb8btI9+Gf5VZi3+vflVqJ/4q66L/Y+nX/Y+VD6M/vX41/QB/C/5Z/T/xy/n//c8I3ob/q6dqdRZp3bLydbDftPfk/j6NRNygIzFkyIwAP7//11AT5dFzWVxileTdps9zMXKR/yJzw/F0c5v5xc7P9KVS3Tfa3V67/U8hhYPCOkhEz3trD1CpF8YYvtrjOVuvcLT/x/J1ZbCup5PKJDFDWxqtb+tkt+bUXo3e6Oj/6FIHJtrUmU/J6F8fGpSxO/5n3KCtJaLw92s3Qie956okSUAqKZJItg6/Z1NPsN5xblcJOXEn9PENGUj3WE2Sqp6i+gNEukjhAMxlB7CV8zv/5v/C2mZs06VOWhP/NqZUw9H738AbiM9xt9l/rLCjrzXmoLYEkki73GLs3MwKYdLB4q0H95XW2WPe59ZnAc3UpUZP/9ecu/9ckkaGjVjv8G1vpPaoPIS/+Fo0SEoDOeNmNzTUzg3135GsS0fvwNMBjSrdqj5IsAwHd0hnNeUQPBwvYjNfWsyFbjxnP7x4S77rJCOzN06vaMx4qjEm/K6yhKKVwvA0t7+zCpTE47BeZ2bCupnU3jKW51ScppncvYd7qa/qGjSprXJwO1KxX2421aPEAkz89P+n0zwPqCQdaE4pGJwsVQjQ+ZszsiyKm6T/fH/X8OxBRYL3IR660p0UWNVc9gjOcMd7mSvjh9BwlckXFeeOY99mZhvs2jRU//uFEWQ//7h3lt3WdCyLbn/7Ef/8YF/+k0CtDz5GHmrwo6DYEjx9/Ewpq7N2bN06yvn6O8Yrf1OFZ6/dOIB5jPgz+St8F9+Fs00Y7egPUob61gcGlPBM9mn8Sdr6JcswAA=',
        }

    ]

    return searchTemplatesArray

}


function createSearchPanel(templateData) {
    // Using the provided templateData, create the floating BookBuddy panel

    // The templateData.title is null, so abort the BookBuddy panel creation
    if ( templateData.title == null ) { return }

    // There is already a bookBuddy panel, likely from a previous pagination, so remove it
    let existingSearchPanel = document.querySelector('#bookBuddy')
    existingSearchPanel ? existingSearchPanel.remove() : null

    // The filled in searchTemplatesArray
    let searchTemplatesArray = searchTemplates(bookData)

    // The main element holding all the other div elements
    let searchPanelElement = document.createElement('div')
    searchPanelElement.id = 'bookBuddy'

    // The 'BookBuddy' title element
    let titleElement = document.createElement('div')
    searchPanelElement.appendChild(titleElement)
    titleElement.outerHTML = `<div class="sp_title"><span>📖 BookBuddy 📖</a></div>`

    for ( template of searchTemplatesArray ) {
        // For each searchTemplate, create a <div> and append it to the main <div> element

        if ( template.name == '--divider--' ) {
            // This template item is a divider

            let dividerElement = document.createElement('div')
            dividerElement.classList.add('sp_divider')
            searchPanelElement.appendChild(dividerElement)
            continue

        } else if ( template.searchURL.match(/https?:\/\/(\w+\.)?(\w+)\./)[2].toLowerCase() == pageURL.match(/https?:\/\/(\w+\.)?(\w+)\./)[2].toLowerCase() ) {
            // This template belongs to the current site, so don't add it to the floating searchPanel
            continue
        }

        // Create and populate the <a> element for this searchTemplate
        let searchElement = document.createElement('a')
        searchPanelElement.appendChild(searchElement)

        searchElement.outerHTML = `
        <a href="${template.searchURL}" target="_blank" title="Search ${template.name}" class="sp_link">
            <div class="sp_item">
                <img src="${template.base64}" style="width: 16px; border-radius: 3px; vertical-align: center; display: unset;">
                ${template.name}
            </div>
        </a>`

    }

    document.body.appendChild(searchPanelElement)

}


// The CSS styles of the floating searchPanel
GM_addStyle(`

#bookBuddy {
    background: rgba(25, 29, 42, 0.74);
    backdrop-filter: blur(4px);
    border-radius: 5px;
    border: 1px solid rgb(44, 62, 80);
    box-shadow: 0px 0px 15px #2C3E50;
    color: #ededed;
    max-height: unset;
    max-width: 190px;
    overflow: auto auto;
    padding: 10px 0px;
    position: fixed;
    width: 190px;
    z-index: 3333;
    font-size: 16px;
    bottom: 1rem;
    left: 1rem;
    line-height: 1.75;
}

div.sp_title {
    color: #ededed;
    font-weight: bold;
    font-size: 14px;
    cursor: default;
    display: flex;
    justify-content: center;
}

div.sp_divider {
    border-bottom: 1px solid;
    border-bottom-color: #2C3E50;
    margin: 4px 0px;
    display: none;
}

div.sp_item {
    border-radius: 3px;
    display: none;
    padding-left: 4px;
    text-decoration: none;
    text-align: left;
}

a.sp_link {
    color: #ededed;
    text-decoration: none;
    background: none;
    padding: unset;
}

div.sp_item:hover {
    background: #2C3E50B5;
}

#bookBuddy:hover {
    padding: 15px;
}

#bookBuddy:hover .sp_item, #bookBuddy:hover .sp_divider {
    display: block;
}

#bookBuddy:hover .sp_title {
    border-bottom: 1px solid #2C3E50;
    margin-bottom:4px;
    padding-bottom: 8px;
}

`)
