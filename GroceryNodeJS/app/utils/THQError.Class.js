class THQError {
    constructor(message, code = 999) {
        this.message = message
        this.code = code
    }
}

export default THQError