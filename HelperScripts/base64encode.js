function base64encode(inputData) {
    // Encode the inputData (blob, string, etc) to a base64 string

    return new Promise( function(resolve) {

        const reader = new FileReader()
        reader.onloadend = function() {
            // After the file has been read\loaded, clean the base64 string and resolve the promise
            resolve(reader.result.replace(/^data:.+;base64,/, ''))
        }

        reader.readAsDataURL(inputData)
    })

}
