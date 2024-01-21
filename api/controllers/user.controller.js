const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const User = mongoose.model("User");
const responseHandler = require("./response.handler");

const loginUser = function(req, res) {
    const response = responseHandler.createResponseObject();

    if (req.body && req.body.username && req.body.password) {
        User.findOne({ "username": req.body.username })
            .then((user) => _checkIfUserExists(user))
            .then((user) => _checkPassword(req.body.password, user))
            .then((name) => _generateToken(name))
            .then((token) => responseHandler.setResponse(200, { token: token }, response))
            .catch((error) => {
                if (error.status && error.status === 401) {
                    responseHandler.setResponse(error.status, error.message, response);
                } else {
                    responseHandler.setResponse(500, { "err": error }, response);
                }
            })
            .finally(() => responseHandler.sendResponse(res, response));
    } else {
        responseHandler.setResponse(400, "Login failed!", response);
        responseHandler.sendResponse(res, response);
    }
}

const _checkIfUserExists = function(user) {
    const response = responseHandler.createResponseObject();
    return new Promise((resolve, reject) => {
        if (user) {
            resolve(user);
        } else {
            response.status = 401;
            response.message = "Login failed!";
            reject(response);
        }
    });
}

const _checkPassword = function(requestPassword, user) {
    const databasePassword = user.password;
    const response = responseHandler.createResponseObject();
    return new Promise((resolve, reject) => {
        bcrypt.compare(requestPassword, databasePassword)
            .then((passwordMatch) => {
                if (passwordMatch) {
                    resolve(user.name);
                } else {
                    response.status = 401;
                    response.message = "Login failed!";
                    reject(response);
                }
            });
    });
}

const _generateToken = function(name) {
    const sign = util.promisify(jwt.sign);
    const payload = { "name": name };
    const secretKey = "ElectricCar";
    const duration = { expiresIn: 3600 };
    return sign(payload, secretKey, duration);
}
 
const createUser = function(req, res) {
    const response = responseHandler.createResponseObject();

    _checkIfUserWithUsernameAlreadyExists(req)
        .then(() => _generateTheSaltForPassword())
        .then((salt) => _generateHash(req.body.password, salt))
        .then((hashPassword) => _buildNewUser(req, hashPassword))
        .then((builtUser) => _validateUser(builtUser))
        .then((validatedUser) => _createUser(validatedUser))
        .then(() => responseHandler.setResponse(200, "User created successfully!", response))
        .catch((error) => {
            if (error.status && error.status === 409) {
                responseHandler.setResponse(error.status, error.message, response);
            } else {
                responseHandler.setResponse(500, { "err": error }, response);
            }
        })
        .finally(() => responseHandler.sendResponse(res, response));
}

const _checkIfUserWithUsernameAlreadyExists = function(req) {
    const response = responseHandler.createResponseObject();
    const userName = req.body.username;

    return new Promise((resolve, reject) => {
        let foundUser;

        User.findOne({ username: userName })
            .exec()
            .then((user) => foundUser = user)
            .finally(() => {
                if (foundUser) {
                    response.status = 409;
                    response.message = "User with that username already exists!";
                    reject(response);
                } else {
                    resolve();
                }
            })
    });
}

const _generateTheSaltForPassword = function() {
    return Promise.resolve(bcrypt.genSalt(14));
}

const _generateHash = function(password, salt) {
    return bcrypt.hash(password, salt);
}

const _buildNewUser = function(req, password) {
    const user = {
        name: req.body.name,
        username: req.body.username,
        password: password
    };
    return Promise.resolve(user);
}

const _validateUser = function(newUser) {
    return new Promise((resolve, reject) => {
        User.validate(newUser)
            .then(() => resolve(newUser))
            .catch((error) => reject(error));
    });
}

const _createUser = function(newUser) {
    return User.create(newUser);
}

module.exports = {
    createUser,
    loginUser
}