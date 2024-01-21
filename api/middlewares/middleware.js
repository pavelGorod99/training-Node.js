const ROLES_FILE = __dirname + '/roles.txt';
const fs = require("fs");

const _checkRole = function (mapper, localScope, action, role) {
    for (let i of mapper) {
        if (role === i.role) {
            const {scopes} = i;
            if (scopes[localScope]) {
                return scopes[localScope].includes(action);
            }
        }
    }
}

module.exports = (scope) => (req, res, next) => {
    const role = req.headers['x-role'];
    if (role) {
        fs.readFile(ROLES_FILE, "utf-8", (err, data) => {
            if (err) {
                res.status(403).json({});
            }

            const [localScope, action] = scope.split(".");
            const mapper = JSON.parse(data.toString("utf-8").replace(/^\uFEFF/, ""));
            const isAllowed = _checkRole(mapper, localScope, action, role);

            if (isAllowed) {
                next();
            } else {
                res.status(403).json({});
            }
        });
    } else {
        res.status(403).json({});
    }
}