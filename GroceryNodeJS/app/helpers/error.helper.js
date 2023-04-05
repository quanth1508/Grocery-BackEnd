import THQError from "../utils/THQError.Class.js"
import Response from "../utils/Response.Class.js"

function genError(message) {
    return new THQError(message)
}

function logError(name, error) {
    if (error instanceof THQError) { return }
    console.error(` ==== Start ${name} ====`)
    console.error(error)
    console.error(` ==== End   ${name} ====`)
}

function sendError(res, functionName, error) {
    logError(functionName.name, error)
    if (error instanceof THQError) {
        res.send(new Response(
            false,
            error.message,
            null
        ))
        return
    }
    res.send(Response.defaultFailure())
}

export default {
    genError,
    logError,
    sendError
}