// ==UserScript==
// @name 		EMP - StashSeeker
// @author 		WirlyWirly
// @namespace 	https://github.com/WirlyWirly
// @version 	1.2

// @description Seek content to add to the Stash!

// @match   http://192.168.1.105:32750/*
// @match   https://stashdb.org/*

// @icon    https://www.empornium.sx/favicon.ico

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/Empornium/StashSeeker.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/Empornium/StashSeeker.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/Empornium/StashSeeker.user.js?raw=true

// @require https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.3/waitForKeyElements.js

// @run-at 		document-end
// ==/UserScript==

// -------------------------------------------------------------------------------------------------------------

function createSearchIcon(searchTerm, searchDelimiter) {
    // --- Create and return the EMP search icon ---

    // Create the EMP search element
    let searchIcon = document.createElement('a')

    // Parse searchTerm into EMP tag
    if (searchDelimiter == 'titleSearch') {
        searchIcon.setAttribute('href', `https://emparadise.rs/torrents.php?title=${encodeURIComponent(searchTerm)}`)
    } else {
        let empTag = searchTerm.toLowerCase().replace(/[^\w.]/g, searchDelimiter)
        searchIcon.setAttribute('href', `https://emparadise.rs/torrents.php?taglist=${encodeURIComponent(empTag)}`)
    }

    searchIcon.setAttribute('target', '_blank')
    searchIcon.setAttribute('class', 'EMP-SS-Icon')
    searchIcon.innerHTML = `<button type="button" class="minimal btn btn-primary">
                <img src="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAABrPxj/az8Y/2s/GP9rPxj/cUMV/3tKFf+DUBP/gk8S/4BOEf9/TA//dkcR/29CE/9rPxj/az8Y/2s/GP9rPxj/az8Y/2s/GP9rPxf/gU8U/5FbF/+OWRf/jFcX/3FGEv9FKwv/RCoK/0MpCf9iPAz/eEcQ/2s/F/9rPxj/az8Y/2s/GP9rPxf/iFUU/5dgFv+UXhb/iVYW/zYoF/+BgYH/wMDA///////AwMD/gYGB/yshFP96ShD/az8X/2s/GP9rPxj/hlMU/5xkFv+aYxb/j1sV/y4kFv/Q0ND//////+Dg3//Q0ND///////////+RkZD/ZD0O/3hIEf9rPxj/dEUV/6JpF/+gZxb/nmYW/08zDP/AwMD///////////80LiT/HhQG////////////wMDA/2Y/EP+GUhP/cEIU/4dUFf+mbBj/pGoX/6FoFv9GPzT////////////g4N//QysL/0tIQ////////////5GRkP9pQRH/iVQV/3lJE/+dZRj/qm8b/6dtGf+HWBT/cXFx////////////kZGQ/0UtC/9iYmH/wMDA/8DAwP9SUlH/hlQW/4xXF/+EURT/oGga/65yHf+rcBz/YEAQ/8DAwP///////////1JSUf8WDwT/AwMC/wMDAv8fFAb/SzAM/5JcF/+QWhf/hlMU/6NqHP+ydiH/sHQf/0g1Gv//////////////////////////////////////4ODf/00yDP+WXxb/k10X/4lVFP+mbR//tnkk/7N3Iv9SUlH///////////+hoaD/oaGg/////////////////6GhoP9iPw7/mWIW/5dgFv+MVxP/j1sc/7p9J/+LXR3/gYGB////////////KCEV/1JSUf////////////////9SUlH/lWAV/51lFv+bYxb/gE8U/3dIF/++gCv/jl8f/8DAwP///////////xkRBv+hoaD////////////AwMD/QCoK/6NpF/+gaBb/nmYW/3NFFf9rPxj/l2Ef/5xqJP+BgYH///////////+hoaD////////////Q0ND/KCAV/55oGf+mbBj/pGoX/4dVFP9rPxj/az8Y/2s/F/+iayP/PysQ/4GBgf/Q0ND/7+/v/8DAwP9xcXH/PzAa/6VtHf+tcR3/qm8b/5JcFv9rPxf/az8Y/2s/GP9rPxj/az8X/5ljIP+HXCH/YkMY/2FCFv9fQRb/l2Ug/7Z5JP+zdyL/sXUg/41ZF/9rPxf/az8Y/2s/GP9rPxj/az8Y/2s/GP9rPxj/d0gY/5NeH/+tciT/q3Ej/6lvIf+nbiD/jVka/3ZHFv9rPxj/az8Y/2s/GP9rPxj/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAD//w==" style="vertical-align:sub">
            </button>`

    return searchIcon

}

// -------------------------------------------------------------------------------------------------------------

let stashDbObserver = new MutationObserver(function(mutations) {
    // ========== StashDB Pages ==========

    if (document.URL.match(/stashdb\.org\/scenes\/[\w-]+/)) {
        // ========== Scene Page ==========

        if (!document.querySelector('a.EMP-SS-Icon')) {

            // Create EMP search icon
            let sceneName = document.querySelector('div.card-header h3 span').textContent
            let searchIcon = createSearchIcon(sceneName, 'titleSearch')

            // Insert EMP search icon
            let sceneHeader = document.querySelector('div.card-header h6')
            sceneHeader.appendChild(searchIcon)
        }

    } else if (document.URL.match(/stashdb\.org\/performers\/[\w-]+/)) {
        // ========== Performer Page ==========

        if (!document.querySelector('a.EMP-SS-Icon')) {

            // Create EMP search icon
            let performerName = document.querySelector('div.card-header h3 span').textContent
            let searchIcon = createSearchIcon(performerName, '.')

            // Insert EMP search icon
            let performerHeader = document.querySelector('div.card-header h3')
            performerHeader.appendChild(searchIcon)
        }

    } else if (document.URL.match(/stashdb\.org\/studios\/[\w-]+/)) {
        // ========== Studio Page ==========

        if (!document.querySelector('a.EMP-SS-Icon')) {

            // Create EMP search icon
            let studioName = document.querySelector('div.studio-title h3 span').textContent
            let searchIcon = createSearchIcon(studioName, '.')

            // Insert EMP search icon
            let studioHeader = document.querySelector('div.studio-title h3')
            studioHeader.appendChild(searchIcon)

        }
    }

})


let stashAppObserver = new MutationObserver(function(mutations) {
    // ========== StashApp Pages ==========

    if (document.URL.match(/.+performers\/\d+\//)) {
        // ========== Performer Page ==========

        if (!document.querySelector('a.EMP-SS-Icon')) {

            // Create EMP search icon
            let performerName = document.getElementsByClassName('performer-name')[0].textContent
            let searchIcon = createSearchIcon(performerName, '.')

            // Insert EMP search icon
            let nameIcons = document.getElementsByClassName('name-icons')[0]
            nameIcons.insertBefore(searchIcon, nameIcons.children[0].nextSibling)
        }

    } else if (document.URL.match(/.+\/studios\/\d+/)) {
        // ========== Studio Page ==========

        if (!document.querySelector('a.EMP-SS-Icon')) {

            // Create EMP search icon
            let studioName = document.getElementsByClassName('studio-name')[0].textContent
            let searchIcon = createSearchIcon(studioName, '')

            // Insert EMP search icon
            let nameIcons = document.getElementsByClassName('name-icons')[0]
            nameIcons.insertBefore(searchIcon, nameIcons.children[0].nextSibling)
        }

    } else if (document.URL.match(/.+\/tags\/\d+/)) {
        // ========== Tag Page ==========

        if (!document.querySelector('a.EMP-SS-Icon')) {

            // Create EMP search icon
            let tagName = document.getElementsByClassName('tag-name')[0].textContent
            let searchIcon = createSearchIcon(tagName, '.')

            // Insert EMP search icon
            let nameIcons = document.getElementsByClassName('name-icons')[0]
            nameIcons.insertBefore(searchIcon, nameIcons.children[0].nextSibling)
        }

    }

})

// -------------------------------------------------------------------------------------------------------------

if (document.URL.match(/https:\/\/stashdb\.org/)) {
    // ========== StashDB ==========

    waitForKeyElements('div.NarrowPage', (element) => {
        let target = document.querySelector('div.NarrowPage')
        let config = { childList: true, subTree: true }
        stashDbObserver.observe(target, config)

    })

} else {
    // ========== StashApp ==========

    waitForKeyElements('div.container-fluid', (element) => {
        let target = document.querySelector('div.container-fluid')
        let config = { childList: true, subTree: true }
        stashAppObserver.observe(target, config)

    })
}
