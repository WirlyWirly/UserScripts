/*
This script is a collection of functions that will extend the capabilities of the GM_config library: https://github.com/sizzlemctwizzle/GM_config

Usage: Add this file as a '@require', create the object within the 'open' event, and then call the desired methods...

----------- Example -----------

// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/gmcExtendedInjections.js

...

GM_config.init({
    ...
    'events': {
        
        'open': function() {

            let gmcExtened = new gmcExtendedInjections(this, GM_info)

            gmcExtended.importExportButtons('exportFilename')

            gmcExtended.scriptVersionLink('github')

            gmcExtended.frameCleanup()

        }

    }
    ...
})

*/

class gmcExtendedInjections {

    constructor(gmcObject, gmInfo) {
        this.gmcId = gmcObject.id
        this.gmcFrame = gmcObject.frame

        this.scriptName = gmInfo.script.name
        this.scriptHomepage = gmInfo.script.homepage
        this.scriptVersion = gmInfo.script.version

        this.gmcResetLink = this.gmcFrame.querySelector('div.reset_holder:has(a[id$="_resetLink"])')

        this.exportButton = null
        this.importButton = null
    }


importExportButtons(filename = this.scriptName) {
    // Create and insert Import\Export buttons after the 'Close' button

    let closeButton = this.gmcObject.frame.querySelector('button[id$="_closeBtn"]')

    let importButton = document.createElement('button')
    let exportButton = document.createElement('button')

    this.importButton = importButton
    this.exportButton = exportButton

    importButton.id = 'gmc_importBtn'
    exportButton.id = 'gmc_exportBtn'

    importButton.classList.add('saveclose_buttons')
    exportButton.classList.add('saveclose_buttons')

    importButton.title = 'Import settings'
    exportButton.title = 'Export settings'

    importButton.innerText = 'Import'
    exportButton.innerText = 'Export'

    importButton.addEventListener('click', function(event) {
        this.importGMCSettings()
    })

    exportButton.addEventListener('click', function(event) {
        this.exportGMCSettings(filename)
    })

    // Insert the Import\Export buttons after the Save\Close buttons
    closeButton.insertAdjacentElement('afterend', exportButton)
    closeButton.insertAdjacentElement('afterend', importButton)

}


importGMCSettings() {
    // Prompt the user to select a .json file from which to import GM_config settings

    let inputElement = document.createElement('input');
    inputElement.type = 'file';

    inputElement.onchange = (event) => {

        // Getting a hold of the file reference
        let file = event.target.files[0]

        // Setting up the reader
        let reader = new FileReader()
        reader.readAsText(file,'UTF-8')

        // Here we tell the reader what to do when it's done reading...
        reader.onload = (readerEvent) => {

            let textContent = readerEvent.target.result // this is the content!

            try {

                // Parse the content of the selected file, making sure it is valid JSON
                let settingsJSON = JSON.stringify(JSON.parse(textContent))

                GM_setValue(gmcId, settingsJSON)

                window.alert('⭐ Settings Imported ⭐\n\nThe selected settings file has been succesfully imported\n\nThe page will now refresh')

                window.location.reload()

            } catch (error) {
                // The JSON parse has failed, so abort the import
                console.log('------ ❌ Import Failed ❌------\n')
                console.log(error)
                window.alert('❌ Import Failed ❌\n\nThe selected settings file was not imported, likely because it is not valid JSON\n\nThe full error has been printed in the console')
            }
       }

    }

    inputElement.click()

}


exportGMCSettings(filename) {
        // Export the currently saved GM_config settings to a .json file

        // Pretty-print the settings string to make it easier to read
        let jsonParsed = JSON.parse(GM_getValue(this.gmcId))

        let jsonString = JSON.stringify(jsonParsed, null, 4)

        // Save the quiCKIE settings to a local file
        this.saveToFile(jsonString, `${filename}-v${this.scriptVersion}-${new Date().toISOString().split('T')[0]}.json`)

        // Update the Export button text
        this.exportButton.innerText = 'Exported'
        
}


saveToFile(fileData, filename) {
    // Save the provided fileData to a local file
    
    let blobType = 'application/json;charset=utf-8;'

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


scriptVersionLink(svgStyle = 'github') {
    // Add the version SVG before the Reset link

    let svgElement = null

    if ( svgStyle == 'github' ) {

        svgElement = '<svg width="16" height="16" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_730_27136)"><path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" fill="#FFFFFFF6"/></g><defs><clipPath id="clip0_730_27136"><rect width="98" height="96" fill="white"/></clipPath></defs></svg>'

    }

    let element = document.createElement('a')
    element.classList = 'script_version reset'
    element.title = 'Go to Homepage'
    element.target = '_blank'
    element.href = this.scriptHomepage
    element.innerHTML = `${svgElement} Version ${this.scriptVersion}`

    // Insert the version link before the reset link
    resetLink.insertAdjacentElement('beforebegin', element)

}



frameCleanup() {
    // Move the Import\Export buttons into the button container, add the version element before the reset link, apply the fadeOut Close button animation, and remove any empty elements

    // The element holding the Save\Close buttons
    const buttonsHolderElement = this.gmcFrame.querySelector('div[id$="_wrapper"] > div[id$="_buttons_holder"]')

    // Replace the default GM_config close button with one that has a fadeOut animation
    let defaultClosedButton = buttonsHolderElement.querySelector('button[id$="_closeBtn"]')
    let newCloseButton = defaultClosedButton.cloneNode()
    newCloseButton.innerText = 'Close'
    defaultClosedButton.insertAdjacentElement('afterend', newCloseButton)

    newCloseButton.addEventListener('click', () => {

        this.gmcFrame.style.animation = 'fadeOut 500ms'

        setTimeout(() => {
            GM_config.close()
            this.gmcFrame.style.animation = 'fadeIn 750ms'
        }, 475)

    })
     
    defaultClosedButton.remove()

    // Clicked button animation event for Save\Close\Import\Export buttons
    let saveButtons = buttonsHolderElement.querySelectorAll('.saveclose_buttons')
    for ( let button of saveButtons) {
        button.addEventListener('click', () => {
            button.classList.add('clicked')
            setTimeout(() => button.classList.remove('clicked'), 800)
        })
    }

    // If there is a welcomeMessage element, remove it so that it's not creating a gap
    let welcomeMessage = this.gmcFrame.querySelector('div[id*=welcomeMessage]')
    welcomeMessage != null ? welcomeMessage.remove() : null

    this.removeEmptyDiv()

}

removeEmptyDiv() {
    // Remove any empty field <div> elements

    for ( let emptyElement of this.gmcFrame.querySelectorAll('div.config_var:empty') ) {
        emptyElement.remove()
    }

}

}





