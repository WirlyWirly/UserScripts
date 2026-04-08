// ==UserScript==
// @name 		PTP - KodiKollections
// @author 		WirlyWirly
// @namespace 		https://github.com/WirlyWirly
// @version 		1.0

// @match   https://passthepopcorn.me/collages.php?id=*

// @icon    https://passthepopcorn.me/favicon.ico

// @homepage
// @updateURL
// @downloadURL

// @description     Spit out a PTP collection as a Kodi playlist

// @run-at 		document-end
// ==/UserScript==

// KodiKollections version number
let versionNumber = '1.0'

// List info
let collectionName = document.getElementsByClassName('page__title')[0].innerText
let movieList = document.getElementById('collection_movielist').getElementsByTagName('ol')[0]

// Generate and append download button
let downloadButton = document.createElement('a')
downloadButton.download = `${collectionName}.xsp`
downloadButton.style = 'font-size: 1.2em'
downloadButton.innerHTML = `<img style="max-width: 12px" src="data:image/webp;base64,UklGRr4CAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSCcBAAABkFtre6JHjyyNmdm5UxfgjlwIZcwQMTMzLTPEW4PdwPoNRtLo7yAiJoCC9uMhJXU/pUtTgpa/knRWm6z9u7x7dYmqfyh4UJ7mWZGnaV5j/teXaoykLxETFC4rMAmQdbkIc2eiplzu09tJKPuiCuDVNwVQ+1HSqfU0fVLUFEDTlfL7NUDjg6TK0DRAw7n8G7Vkj4qaA3APCu/Zc0XNu9y5YhcPo+bwbkYN116GXmbxu6OIZUfNu0AfgDFAdhbYdkDlP6kCvz27toB757m15Cu/h8x76bMBqj5KOnT4axbKPLWPkvSxDnAXWnUUbTyW97IZsL2WorVHCp7Xk/RWkc8mRfdbjHpSsBSzbpK45dBGRlq34zvKSG0fcp8s6e2+dOoopesfyigIAFZQOCBwAQAAEA0AnQEqIAAgAAAAACWwAsSVBfgH4AcoowjoH4AfpX/K+cM0C7gfqr/K8u94A/nP4ufzP6/8oB/Hfyg4AH6Af7f/AcIB+gHAAfq16EX9a9wn9Vf13+AX+M/x774dEA/gFH+lGZ+9/TesakZP+HbbKrgA/v/xTUj/9wkjXE+SzNZoAhTx4yuZcE0lTksiBkpSZt/dQynaQ/YrjEYp+lt62A7adLWS8VB4rZCP5C0e2v5b7R2//joWj9Q+bGmtYvHg5PXxDnbZ0tjh9aMmmJZXGQFzxWVktyLteBsnGFlqpDyFXesruYxkMPoNfYRMTh//IP807UjcHKvUosmBAiJf/WzlOv46G8ELGYI4Wn9e6OcL53uyh2nMh2/XVOFfQSk3PRLUowIR5NkDxNja1K47MCvEgUN//KGm6yyhzttF3WzdczrW51q9DBuuZ1rc63sKI0dhDyFXbCFpmd83i23ujB2l5sEGW+/2L0QCeI4gAAA="> KodiKollections`

let listTextElement = document.getElementById('collection_movielist').previousElementSibling
listTextElement.insertBefore(downloadButton, listTextElement.firstChild)
listTextElement.children[1].style = 'display: none'

function generatePlaylist(collectionName, listItems) {
    // Create the text content of the playlist file from the list of movies

    let fileContents = `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<smartplaylist type="movies">
    <name>${collectionName}</name>
    <match>one</match>
    <group>none</group>
    <rule field="title" operator="is">`

    for (let item of listItems.getElementsByTagName('li')) {
        let rawTitle = item.getElementsByTagName('a')[0].innerText
        console.log(rawTitle)
        rawTitle = rawTitle.match(/((^.+) AKA )?(.+)/)
        console.log(rawTitle[2])

        if (rawTitle[2] !== undefined) {
            let newRule = `
            <value>${rawTitle[2]}</value>`

            fileContents += newRule
        }

        if (rawTitle[3] !== undefined) {
            let newRule = `
            <value>${rawTitle[3]}</value>`

            fileContents += newRule
        }
    }

    fileContents += `
    </rule>
<smartplaylist>`

    return fileContents
}


downloadButton.addEventListener('click', function() {

    // Generate the Kodi playlist file for the provided data
    let playlistData = generatePlaylist(collectionName, movieList)

    // File object to be downloaded
    let fileObject = new Blob([playlistData], {type: 'text/plain' })
    // URL.createObjectURL(fileObject)

    downloadButton.href = URL.createObjectURL(fileObject)
})
