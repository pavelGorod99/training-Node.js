const jwt = require("jsonwebtoken");
const util = require("util");
const responseHandler = require("./response.handler");

const permit = function(...permittedRoles) {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'];
        if (userRole && permittedRoles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden!" });
        }
    }
}

const authorization = function(req, res, next) {
    const response = {
        status: 403,
        message: "No token provided!"
    };

    const headerExists = req.headers.authorization;
    if (headerExists) {
        const token = req.headers.authorization.split(" ")[1];
        const verify = util.promisify(jwt.verify);
        verify(token, "ElectricCar")
            .then(() => next())
            .catch(() => responseHandler.sendResponse(res, response));
    } else {
        responseHandler.sendResponse(res, response);
    }
}

module.exports = {
    authorization,
    permit
}