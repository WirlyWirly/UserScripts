function saveToFile(fileData, filename) {
    // Save the provided fileData to a local file
    
    mimeTypes = {
        // The different MIME types this function is setup to handl. 
        // MIME Types: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types
            
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'json': 'application/json;charset=utf-8;',
        'png': 'image/png',
        'text': 'text/plain;charset=utf-8;',
        'torrent': 'application/x-bittorrent',
        'txt': 'text/plain;charset=utf-8;',

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
