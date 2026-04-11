// A simple console logger, which will only display messages in the console when it has been enabled

// let logger = new simpleLogger({ enabled: true, scriptName: 'myScriptName' })
// logger.debug('A console message')

class simpleLogger {

    constructor({ enabled = false, scriptName = 'UserScript', enabledLevels = ['log', 'info', 'debug', 'error', 'nodes']}) {
        this.enabled = enabled
        this.levels = enabledLevels
        this.scriptName = scriptName
    }

    log(message) {
        if ( this.enabled == true && this.levels.includes('log') ) {
            console.log(`---------- [LOG] ${this.scriptName} ----------\n\n${message}`)
        }
    }

    info(message) {
        if ( this.enabled == true && this.levels.includes('info') ) {
            console.log(`---------- ${this.scriptName} ----------\n\n${message}`)
        }
    }

    debug(message) {
        if ( this.enabled == true && this.levels.includes('debug') ) {
            console.log(`---------- [DEBUG] ${this.scriptName} ----------\n\n${message}`)
        }
    }

    error(message) {
        if ( this.enabled == true && this.levels.includes('error') ) {
            console.error(`---------- ⚠️ ${this.scriptName} ⚠️ ----------\n\n${message}`)
        }
    }

    nodes(message) {
        if ( this.enabled == true && this.levels.includes('nodes') ) {
            console.log(message)
        }
    }

}
