// Various helper functions useful in other scripts

function waitForElement(cssTarget, observeTarget = document.body, observeSubTree = true) {
    // Wait until the cssTarget exists within the observeTarget and then resolve the promise
    // Source: https://stackoverflow.com/a/61511955

    return new Promise(resolve => {

        if ( observeTarget.querySelector(cssTarget) ) {
            // The cssTarget already exists within the observeTarget, so immediately resolve the promise
            return resolve(observeTarget.querySelector(cssTarget))
        }

        const observer = new MutationObserver(mutations => {
            // The actions to take when there are new mutations to the observeTarget

            if ( observeTarget.querySelector(cssTarget) ) {
                // The cssTarget has been found within the observeTarget
                observer.disconnect()
                resolve(observeTarget.querySelector(cssTarget))
            }
        })

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(observeTarget, { childList: true, subtree: observeSubTree })

    })

}


function saveToFile(fileData, filename) {
    // Save the provided fileData to a local file
    
    mimeTypes = {
        // The different MIME types this function is setup to handl. 
        // MIME Types: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types
            
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'json': 'application/json;charset=utf-8;',
        'png': 'image/png',
        'text': 'text/plain;charset=utf-8;',
        'torrent': 'application/x-bittorrent',

    }

    let filetype

    try {
        // Parse the provided filename to determine the filetype
        filetype = filename.match(/.*\.(\w+)$/)[1]

    } catch {
        // No file extension was provided, so assume it to be a text type
        filetype = 'txt'

    }

    let blobType 

    if ( Object.keys(mimeTypes).includes(filetype) ) {
        // The filetype has a registered mime type
        blobType = mimeTypes[filetype]

    } else {
        // The filetype is not registerd, so assume it to be a text type
        blobType = 'text/plain;charset=utf-8;' 
    }

    // Create the blob object that will contain the data to be written
    let blobData = new Blob([fileData], { type: blobType });
    let fileURL = URL.createObjectURL(blobData);

    // Create the HTML element that will be automatically clicked on to download the file
    let fileElement = document.createElement("a");
    fileElement.href = fileURL;
    fileElement.download = filename;

    document.body.appendChild(fileElement);
    fileElement.click();
    document.body.removeChild(fileElement);

    URL.revokeObjectURL(fileURL);

}
