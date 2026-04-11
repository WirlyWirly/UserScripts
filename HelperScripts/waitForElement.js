function waitForElement(cssTarget, observeTarget = document.body, observeSubTree = true) {
    // Wait until the cssTarget exists within the observeTarget and then resolve the promise
    // Source: https://stackoverflow.com/a/61511955

    return new Promise( function(resolve) {

        if ( observeTarget.querySelector(cssTarget) ) {
            // The cssTarget already exists within the observeTarget, so immediately resolve the promise
            return resolve(observeTarget.querySelector(cssTarget))
        }

        const observer = new MutationObserver( mutations => {
            // The actions to take when there are new mutations to the observeTarget

            if ( observeTarget.querySelector(cssTarget) ) {
                // The cssTarget has been found within the observeTarget
                observer.disconnect()
                resolve(observeTarget.querySelector(cssTarget))
            }
        })

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        try {
            observer.observe(observeTarget, { childList: true, subtree: observeSubTree })
        } catch (error) {
            // console.log(error)
        }

    })

}
