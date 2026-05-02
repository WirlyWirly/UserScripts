// ==UserScript==

// ----------------------------------- MetaData --------------------------------------

// @name        🇯🇵 JAVScout
// @author      WirlyWirly
// @version     1.1
// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Other/JAVScout.user.js
// @description Scout for JAV across various sites
//              Written on LibreWolf via Violentmonkey

// @namespace   WirlyWirly
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAq1BMVEUAAADu7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7+/u8vHu9PPu9PTu9fTu8vLu3+Duur/unqbukZrukJnu8PDu3d7tlp7tYW7tPk/tIjbtFSrtFCnu7Ozuub7tXGrtJzrtGC3tGi7tGy/u6ertl5/tO0ztMELtGS7tFSnuhY7u7e3u7+7uj5gMDmmvAAAAFXRSTlMABBMhJA5Sq+v6+BiN8f+K/U/usPX1jlc9AAABMUlEQVR4Ae3WBWLDIBSAYerext3doC73v9jcVyF58+U7wB8FHnpQqzWarXYFrWYD3el0e/3BsLRBv9ftoBuj8WRa0WQ8QqgzY6aVMbMOYrkpAMcinpkCMDwSpiACmgL97IAoyYqqKrIkVgqImm6Ylm1bpqFrYvmA43p+EEZxHIWB77lO2UCSZnlUYHIDF1GepUm5wHyxxJg8wXi5mJcJJIvVmryyXi0S+oCTLtfkjfUydWgDopth8g7OXJEyoHn5sUDuaXQBUfcjckTk6yJVQDKCghxRBIZEFZDNEJMjcGjKVAHFishRkaVQBVQ7Jkdttrs9KBAfvugRwC8R+BnhPxL8V4YvJvByhm8o8C0NvqnCt3X4wQI/2n7N8Q4eccBDFnjMgw+a4FEXPmzDx31Uq10D1+fkudO84EYAAAAASUVORK5CYII=

// ----------------------------------- Matches --------------------------------------

// @match     https://clearjav.com/movies/*
// @match     https://clearjav.com/torrents/*

// @match     https://javdb.com/v/*

// @match     https://www.javdatabase.com/movies/*

// @match     https://www.javlibrary.com/*

// @match     https://javstash.org/scenes/*

// @match     https://r18.dev/videos/vod/movies/detail/-/id=*

// @match     https://stashdb.org/scenes/*

// ----------------------------------- Permissions --------------------------------------

// @grant       GM_addStyle

// ----------------------------------- Dependencies --------------------------------------

// @require   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/waitForElement.js

// ----------------------------------- Script Links --------------------------------------

// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/JAVScout.user.js
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Other/JAVScout.user.js

// ==/UserScript==

// The URL to your personal StashApp instance
let stashAppURL = 'http://192.168.1.105:32750'

// =================================== CODE ======================================

pageURL = document.URL

if ( pageURL.match(/clearjav/) ) {
    // --- ClearJAV ---

    metaElements = document.querySelector(`div.meta__chips > section.meta__chip-container[title="About this release"]`) // The parentElement of the meta <article> elements

    dvdId = metaElements.querySelector('article.meta__language .meta-chip__value').innerText // The dvdId, used to generate hyperlinks
    javScout(dvdId)

    let searchTemplatesArray = searchTemplates(dvdId)
    for ( let template of searchTemplatesArray ) {
        // Using each searchTemplate, generate and insert the hyperlink elements

        // Skip the 'ClearJAV' template item
        if ( template.name.toLowerCase() == 'clearjav' || template.name == '--divider--' ) { continue }

        let clearElement = document.createElement('article')
        clearElement.classList.add('meta__searchlink')
        clearElement.title = `Search ${template.name}`
        clearElement.innerHTML = `
            <a class="meta-chip" href="${template.searchURL}" target="_blank">
                <i class="fas meta-chip__icon" style="background: none;">
                    <img src="${template.base64}" style="border-radius: 5px; vertical-align: center; width: 32px">
                </i>
                <h2 class="meta-chip__name">${template.name}</h2>
                <h3 class="meta-chip__value">search</h3>
            </a>
        `

        metaElements.appendChild(clearElement)

    }


} else if ( pageURL.match(/javdb/) ) {
    // --- javDB ---

    dvdId = document.querySelector('nav.movie-panel-info a[href^="/video_codes/"]').parentElement.innerText
    javScout(dvdId)


} else if ( pageURL.match(/javdatabase/) ) {
    // --- JAVDatabase ---

    dvdId = pageURL.match(/movies\/(.+)\/$/)[1]
    javScout(dvdId)


} else if ( pageURL.match(/javlibrary/) ) {
    // --- JAVLibrary ---

    let dvdId = document.querySelector('#video_id td.text').innerText
    javScout(dvdId)

    let metaElements = document.querySelector('#video_info')

    // The element where the searchLinks will be appended
    let javlibraryElement = document.createElement('div')
    javlibraryElement.id = 'video_searchlinks'
    javlibraryElement.classList = 'item'
    javlibraryElement.innerHTML = `
    <table>
        <tbody>
            <tr>
            <td class="header">Search:</td>
                <td class="text">
                </td>
            <td class="icon"></td>
            </tr>
        </tbody>
    </table>
    `

    metaElements.appendChild(javlibraryElement)

    searchElements = javlibraryElement.querySelector('td.text')

    let searchTemplatesArray = searchTemplates(dvdId)
    for ( let template of searchTemplatesArray ) {
        // Using each searchTemplate, generate and insert the hyperlink element

        // Skip the 'JAVLibrary' template item
        if ( template.name.toLowerCase() == 'javlibrary' || template.name == '--divider--') { continue }

        let spanElement = document.createElement('span')
        spanElement.innerHTML = `<a href="${template.searchURL}" class="genre" target="_blank" title="Search ${template.name}" style="font-weight: bold;"><img src="${template.base64}" style="vertical-align: center; width: 12px;">  ${template.name}</a>`
        searchElements.appendChild(spanElement)

    }

    GM_addStyle(`#video_searchlinks a:hover {
        text-shadow: 0px 0px 1px black, 0px 0px 5px #B6D3E7 !important;
    }`)


} else if ( pageURL.match(/javstash/) ) {
    // --- JAVStash ---

    waitForElement('div.scene-performers + div strong').then(function(element) {
        // Wait until the element containing the dvdId is available

        dvdId = element.innerText
        javScout(dvdId)
    })


} else if ( pageURL.match(/r18\.dev/) ) {
    // --- R18 ---

    dvdId = document.querySelector('#dvd-id').innerText // The dvdId, used to generate hyperlinks
    javScout(dvdId)


    // The parentElement of the meta <article> elements
    metaElements = document.querySelector(`#details tbody`)

    let searchTemplatesArray = searchTemplates(dvdId)
    for ( let template of searchTemplatesArray ) {
        // Using each searchTemplate, generate and insert the hyperlink elements

        // Skip the 'ClearJAV' template item
        if ( template.name.toLowerCase() == 'r18' || template.name == '--divider--' ) { continue }

        let tableRowElement = document.createElement('tr')
        tableRowElement.innerHTML = `
            <th>Search</th>
            <td>
                <a href="${template.searchURL}" target="_blank" title="Search ${template.name}" style="text-decoration: none;">
                    <img src="${template.base64}" style="border-radius: 3px; max-height: 16px; max-width: 16px;"> ${template.name}
                </a>
            </td
        `

        metaElements.appendChild(tableRowElement)

    }

} else if ( pageURL.match(/stashdb/) ) {
    // --- StashDB ---

    waitForElement('div.scene-performers + div strong').then(function(element) {
        // Wait until the element containing the dvdId is available

        dvdId = element.innerText
        javScout(dvdId)
    })

}



function javScout(dvdId) {
    // Using the provided dvdId, create the floating JAVScout element

    // The filled in searchTemplatesArray
    let searchTemplatesArray = searchTemplates(dvdId)

    // The main element holding all the other div elements
    let javScoutElement = document.createElement('div')
    javScoutElement.id = 'javScout'

    // The 'JAVScout' div element
    let titleElement = document.createElement('div')
    titleElement.classList.add('js_title')
    titleElement.innerHTML = `
    <span style="font-size: 14px; font-weight: bold; color: #ededed">🇯🇵 JAVScout 🇯🇵</a>
    `

    javScoutElement.appendChild(titleElement)
    for ( template of searchTemplatesArray ) {
        // For each searchTemplate, create a <div> and append it to the main <div> element

        if ( template.name == '--divider--' ) {
            // This template item is a divider

            let dividerElement = document.createElement('div')
            dividerElement.classList.add('js_divider')
            javScoutElement.appendChild(dividerElement)
            continue

        }

        // If this template belongs to the current site, skip the <div> creation so that it is not included in the panel
        if ( template.searchURL.match(/https?:\/\/(\w+\.)?(\w+)\./)[2].toLowerCase() == pageURL.match(/https?:\/\/(\w+\.)?(\w+)\./)[2].toLowerCase() ) { continue }

        // Create the <div> for this searchTemplate
        let searchElement = document.createElement('div')
        searchElement.classList.add('js_item')
        searchElement.innerHTML = `
        <a href="${template.searchURL}" target="_blank" title="Search ${template.name}" class="js_a">
            <img src="${template.base64}" style="width: 16px; border-radius: 3px;">
            ${template.name}
        </a>
        `

        // Append the searchTemplate to the main <div> element
        javScoutElement.appendChild(searchElement)

    }

    document.body.appendChild(javScoutElement)

    GM_addStyle(`

        #javScout {
            background: rgba(25, 29, 42, 0.74);
            backdrop-filter: blur(4px);
            border-radius: 5px;
            border: 1px solid rgb(44, 62, 80);
            box-shadow: 0px 0px 15px #2C3E50;
            color: #ededed;
            max-height: unset;
            max-width: 165px;
            overflow: auto auto;
            padding: 10px 0px;
            position: fixed;
            width: 165px;
            z-index: 3333;
            font-size: 16px;
            bottom: 1rem;
            left: 1rem;
            line-height: 1.5;
        }

        div.js_title {
            cursor: default;
            display: flex;
            justify-content: center;
        }

        div.js_divider {
            border-bottom: 1px solid;
            border-bottom-color: #2C3E50;
            margin: 4px 0px;
            display: none;
        }

        div.js_item {
            padding: 2px 0px;
            display: none;
        }

        a.js_a {
            color: #ededed;
            text-decoration: none;
        }

        div.js_item:hover a.js_a {
            color: #2ca5ca;
        }

        #javScout:hover {
            padding: 15px;
        }

        #javScout:hover .js_title {
            border-bottom: 1px solid #2C3E50;
            margin-bottom:4px;
            padding-bottom: 8px;
        }

        #javScout:hover .js_item, #javScout:hover .js_divider {
            display: block;
        }


    `)

}


function searchTemplates(dvdId) {
    // Use the provided 'dvdId' to populate and return the searchTemplates

    dvdId = dvdId.toLowerCase()

    let r18dvdId = dvdId.replace(/-/, '00')

    let stashIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEqWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjMyIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMzIiCiAgIGV4aWY6Q29sb3JTcGFjZT0iMSIKICAgdGlmZjpJbWFnZVdpZHRoPSIzMiIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMzIiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjYtMDQt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`

    let searchTemplatesArray = [
        // An array of objects, each object containing the required info to generate and present a external link

        {
            name: 'Stash',
            searchURL: `${stashAppURL.match(/(.+)\/?$/)[1]}/scenes?sortby=title&perPage=120&q=${dvdId}`,
            color: '#685142',
            base64: stashIcon,
        },

        {
            name: 'ClearJAV',
            searchURL: `https://clearjav.com/torrents?imdbId=${dvdId}`,
            color: '#92CBFF',
            base64: 'data:image/png;base64,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',
        },

        {
            name: 'Nyaa',
            searchURL: `https://sukebei.nyaa.si/?s=size&o=asc&q=${dvdId}`,
            color: '#116ce2',
            base64: 'data:image/png;base64,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',
        },

        {
            name: 'Empornium',
            searchURL: `https://emparadise.rs/torrents.php?searchtext=${dvdId}`,
            color: '#6D88F8',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACxklEQVR42nWTW0gUURjH/7Mze3HXa26r2dqG2YO1thSJPhQLhWj5sKIhRWiFFWEYCFEPwWZP9ZKVvURkXiKh0HDJkKLIBXuoKNwuVBjppmu1m7aie9Odmc45tqM+dODMnDnM9zv/7/v+h8u2n5SxfCQlQ2syQ23MgSxLkCSJvecDk4hP/4IqGlrxO5cA0EdS/hZwsWlEfoxAkskOCdTnl0AwWghIZLDIxFdg8hu45QAanGwtxtRgG5pqdsHhcMBiscDj8cDlcuHe87fgdx4HBB0DLUz9BDf+hUEYQJtnhTpJjdosH5xOJyN3dnXhUF0dW1NQaeV+COVnIBOITJSIgXEI/glwWeVnZWNJGeZGh9F5ZBvsdjsL0q7Kwc2rlxSI2+3G3oZmpNjrSU1EgNZm9CM488ErsiFvM8JjHhzNDysKTHkF2LF1Ex709ioFq6quxlDqbnBqHQNIv33gLI3dsjo5neVmG2lXAmgKdCQUJPZO3XZDt6GYAcRIiChouEMAaazCC+4b8L0awP/GmNeLwqpG6Av3gCMHitEwuJwTHTKvTyWFETE3/Ah9zYeVOlDJD58NQZqbYt9ChhkasxUGa9mighgBZB9rI4CUxfYExlC7xo+WlhYWcK21Fedu9aOmKFdJhe69UG0Hx2sgzkfBrd53UeazLaw1VMW6T3fxevCxItlaUY+SXB2eDvQrgAt9nyFkrocUChJA6WlZRRxIAdR54Tcu9F9uUtLYaCvC90k/YgGv0s7K893gCYAL+heNFDeuhSrDxAAy8Tr3sh1Perpgs9mYiplgkK0TCpw978EbjNBGZpesLJpyoTKkkeIQk1DIu140HKhgSuikJ9N5veM+4gUOaEMzS1ZOXCYx3QSeeIJBaFv/+BDzfSDOk9nkMy0QDCZoo7MrL9PyXouChvhYD0mj+xdIr7QM1UKEzBjUYnyFN/4ChwdYKVTfJS4AAAAASUVORK5CYII=',
        },

        {
            name: '--divider--'
        },

        {
            name: 'JAVDatabase',
            searchURL: `https://www.javdatabase.com/movies/${dvdId}/`,
            color: '#ED008D',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAt1BMVEXsAIzsAIvtEJPvKp/vK5/uGpjsAIryV7P96vb+7vf3k83sAYzzX7f////4oNPzaLr3ntL1gcX2j8ztDZD6u+D0cr/tD5LuFpXsB4/sBY7tFZX1fMP+9/v+9frxRKrzZrn81ev6ud/5tN370ur/+fz7yubtFJT2jsv++PzzZLjsBI35rdn++Pv2i8rtCY/tCpD5tNz//P3//v7+8fj6xOTzYLbsAY3uIpvxSq30cb/0b77zXLXwOKUrHqeUAAAAAWJLR0QN9rRh9QAAAAd0SU1FB+UGDwkUGoFj0McAAACSSURBVDjLY2CgO2AEATzyTMzMzCysuOXZ2Dk4ODi5uHEr4OEFAr5RBUNCAT9IgQADbgWCIAVC2FMMUJRRWASkQJQNm7yYuISklLQMUF5WDpsCNnkFRSVlFZABqmrYrGBU54UCDU2sTtDShsrr6OphdaK+gSFQ1sjYxFQPux/MzC3kLa2sbZhwZgpGNhDAl2doBgAUng5jj+HfbAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0xNVQwOToyMDoyNiswMDowMIWbnhoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMTVUMDk6MjA6MjYrMDA6MDD0xiamAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC',
        },

        {
            name: 'JavDB',
            searchURL: `https://javdb.com/search?q=${dvdId}&f=all`,
            color: '#E50075',
            base64: 'data:image/png;base64,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',
        },

        {
            name: 'JavLibrary',
            searchURL: `https://www.javlibrary.com/en/vl_searchbyid.php?keyword=${dvdId}`,
            color: '#f908bb',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACvUlEQVR42u3XX0gUQRwH8O/M7F7XFWj5F8o/kWRRGUJ/qCiISKgIih566UVITUytqCh66CEIkrB/EFQU/THqoYLoD0RBQaVBSmWZh3VEoFlmKUeGerszzd7pQe16t3fHGoHDLgsze7efnfnd7zdHBtwPBP5hI2OAmAAeBromFSTdBd78E+JZD5Ag3zaA5Hmg3C4EyR0f7uM3u6AVvwUGucMAAqgP54MsSTYN6XvfQz/+yVmAMeWqbxmgENOYeNKDQFGTw4CMIQCzADztRWBVo7OA4BI8WgCyKMk0pO+XS1Dr8BIEb8yfEArCLHe4j9/5Bm3zG2DA6SAcbskK2KZMIEmFaPKDP/4hpyCx36G9GJg9EWxnDsiKySApKrSt78CvfknowbYBdG0alLq5gJuG+7TSFvDLnaMAkJlP9S4FSXP90a2VyRm49Nl5AC1KgXKr0NSvlUvAhdgAtDob4kYXRHu/fQArngJ2apYZsK0V/FyH/ae7KNTmxdDWv4Lw9sUA2DIV7ORMM6DKC3623f7br04F3Z0LbWWjqXhFBpRIwAkLQLUEnLEPUK4VgN/rtoybyICyLLBj+WbAdgk4bROQOQ5qw0IE5jUAfi1GQLkE1CYGYDtyAFnK9YpWy/HIgIpssCMzLAHi/newi3PAaz6C3+22/gKjhryUwVfSAvHCHwegUgJqLACHfKAbMkCme6BtfA1iJKl+DmGkZXkQeRUBHqyedF069H1tI+6cIgOqJOCwGSCM4qMS6JVyKc53gO2ZBrp8UihbqmTopMEZMGqGkbhGanEBgogPv8Cv/JWOje2CsWmRGRRdg9CPRi/TcQOiNQMYKKiPuml1DKDL4NQP+EZ5Bvp06HWdEM97wa9/ldFqY7MVEVAqM+HBPJlLjTvl2sqlBSWhk8uPGRuh4asQ0Ha1xVwl/7N/RmMAB9pvMpBLkHtigIQAAAAASUVORK5CYII=',
        },

        {
            name: 'JAVStash',
            searchURL: `https://javstash.org/search/${dvdId}`,
            color: '#685142',
            base64: stashIcon,
        },

        {
            name: 'R18',
            searchURL: `https://r18.dev/videos/vod/movies/detail/-/id=${r18dvdId}/`,
            color: '#FF5555',
            base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWklEQVR42mNkoBAwUt2A/0AAlwQCsgwA6QOZMwQNgPkfZgBJgYisGcpnQHcATAyFxuF0FBrZVSQbQDUXwP2MrgYt4ZBnADYn4/ICeiyhuIBUwEhMQiE6HZALAGPMkvWSBic/AAAAAElFTkSuQmCC',
        },

        {
            name: 'StashDB',
            searchURL: `https://stashdb.org/search/${dvdId}`,
            color: '#685142',
            base64: stashIcon,
        },

    ]

    return searchTemplatesArray

}
