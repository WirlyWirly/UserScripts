/*
ℹ️ These function will allow you to Import\Export settings when using GM_config. Simply add this file as a '@require' and call the functions with the required arguments...


// @require     https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/gmcSettingsImportExport.js?raw=true
...

GM_config.init({
    ...

    'fields': {
        // ------------------ Settings Import\Export ------------------

        'settingsImport' : {
            'label': 'Import Settings',
            'type': 'button',
            'click': () => { importGMConfigSettings(GM_config.id, GM_info.script.version) },
        },

        'settingsExport' : {
            'label': 'Export Settings',
            'type': 'button',
            'click': () => { exportGMConfigSettings('ScriptName', GM_config.id, GM_info.script.version) },
        },
    }
    
    ...
})

*/

function importGMConfigSettings(gmcId) {
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
                window.alert('❌ Import Failed ❌\n\nThe selected settings file failed to import, likely because it is not valid JSON\n\nThe full error has been printed in the console')
            }
       }

    }

    inputElement.click()

}


function exportGMConfigSettings(fileTitle, gmcId, scriptVersion) {
        // Export the currently saved GM_config settings to a .json file

        // Pretty-print the settings string to make it easier to read
        let jsonParsed = JSON.parse(GM_getValue(gmcId))

        let jsonString = JSON.stringify(jsonParsed, null, 4)

        // Save the quiCKIE settings to a local file
        saveToFile(jsonString, `${fileTitle}-v${scriptVersion}-${new Date().toISOString().split('T')[0]}.json`)

}


function saveToFile(fileData, filename) {
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
