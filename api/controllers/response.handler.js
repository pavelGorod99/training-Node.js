const createResponseObject = function() {
    const response = {
        status: 200,
        message: {}
    };
    return response;
}

const setResponse = function(statusCode, message, response) {
    response.status = statusCode;
    response.message = message;
    return response;
}

const sendResponse = function(res, response) {
    return res.status(response.status).json(response.message);
}

module.exports = {
    createResponseObject,
    setResponse,
    sendResponse
}