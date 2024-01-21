const mongoose = require("mongoose");
const ElectricCar = mongoose.model("ElectricCar");
const responseHandler = require("./response.handler");

const createElectricCar = function(req, res) {
    const newElectricCar = _buildElectricCar(req);
    const response = responseHandler.createResponseObject();

    ElectricCar.create(newElectricCar)
        .then(() => response.message = "Electric car created successfully!")
        .catch((error) => responseHandler.setResponse(500, { "err": error }, response))
        .finally(() => responseHandler.sendResponse(res, response));
}

const _buildElectricCar = function(req) {
    const electricCar = {
        name: req.body.name,
        company: req.body.company,
        year: req.body.year,
        manufactures: []
    };

    if (req.body.manufactures.length > 0) {
        let manufactureArr = req.body.manufactures;
        for (let i = 0; i < manufactureArr.length; i++) {
            electricCar.manufactures[i] = {};
            electricCar.manufactures[i].country = manufactureArr[i].country;
            if (manufactureArr[i].state != null) {
                electricCar.manufactures[i].state = manufactureArr[i].state;
            }
            electricCar.manufactures[i].city = manufactureArr[i].city;
        }
    }

    return electricCar;
}

const getAllElectricCars = function(req, res) {
    const response = responseHandler.createResponseObject();

    ElectricCar.find()
               .exec()
               .then((electricCars) => response.message = electricCars)
               .catch((error) => responseHandler.setResponse(500, { "err": error }, response))
               .finally(() => responseHandler.sendResponse(res, response));
}

const getElectricCarById = function(req, res) {
    const electricCarId = req.params.electricCarId;
    const response = responseHandler.createResponseObject();

    ElectricCar.findById(electricCarId)
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar))
        .then((electricCar) => response.message = electricCar)
        .catch((error) => {
            if (error.status === 404) {
                responseHandler.setResponse(error.status, error.message, response);
            } else {
                responseHandler.setResponse(500, { "err": error }, response);
            }
        })
        .finally(() => responseHandler.sendResponse(res, response));
}

const _checkIfElectricCarExists = function(electricCar) {
    console.log("CHECK IF ELECTRIC CARS EXISTS");
    const response = responseHandler.createResponseObject();
    return new Promise((resolve, reject) => {
        console.log("ELECTRIC CAR: " + electricCar);
        if (electricCar) {
            resolve(electricCar);
        } else {
            response.status = 404;
            response.message = "Electric car not found!";
            reject(response);
        }
    });
}

const deleteElectricCarById = function(req, res) {
    const electricCarId = req.params.electricCarId;
    const response = responseHandler.createResponseObject();

    ElectricCar.deleteOne({ _id: electricCarId })
        .exec()
        .then((result) => response.message = result)
        .catch((error) => responseHandler.setResponse(500, { "err": error }, response))
        .finally(() => responseHandler.sendResponse(res, response));
}

const partiallyUpdateElectricCar = function(req, res) {
    const _setElectricCar = function(req, electricCar) {
        if (req.body.name) { electricCar.name = req.body.name; }
        if (req.body.company) { electricCar.company = req.body.company; }
        if (req.body.year) { electricCar.year = req.body.year; }

        if (req.body.manufactures && req.body.manufactures.length > 0) {
            const manufactureArr = req.body.manufactures;
            for (let i = 0; i < manufactureArr.length; i++) {
                if (manufactureArr[i].country) { electricCar.manufactures[i].country = manufactureArr[i].country; }
                if (manufactureArr[i].state != null) { electricCar.manufactures[i].state = manufactureArr[i].state; }
                if (manufactureArr[i].city) { electricCar.manufactures[i].city = manufactureArr[i].city; }
            }
        }
    }

    _update(req, res, _updateElectricCar, _setElectricCar);
}

const fullUpdateElectricCar = function(req, res) {
    const _setElectricCar = function(req, electricCar) {
        electricCar.name = req.body.name;
        electricCar.company = req.body.company;
        electricCar.year = req.body.year;

        if (req.body.manufactures && req.body.manufactures.length > 0) {
            const manufactureArr = req.body.manufactures;
            for (let i = 0; i < manufactureArr.length; i++) {
                electricCar.manufactures[i].country = manufactureArr[i].country;
                if (manufactureArr[i].state != null) {
                    electricCar.manufactures[i].state = manufactureArr[i].state;
                }
                electricCar.manufactures[i].city = manufactureArr[i].city;
            }
        }
    }

    _update(req, res, _updateElectricCar, _setElectricCar);
}

const _updateElectricCar = function(req, electricCar, _setElectricCar) {
    const response = responseHandler.createResponseObject();
    return new Promise((resolve, reject) => {
        _setElectricCar(req, electricCar);
        _saveElectricCar(electricCar)
            .then(() => {
                response.message = "ElectricCar updated successfully!";
                resolve(response);
            })
            .catch((error) => reject(error));
    });
}

const _saveElectricCar = function(electricCar) {
    return electricCar.save();
}

const _update = function(req, res, _updateElectricCar, _setElectricCar) {
    const electricCarId = req.params.electricCarId;
    const response = responseHandler.createResponseObject();

    ElectricCar.findById(electricCarId)
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar))
        .then((electricCar) => _updateElectricCar(req, electricCar, _setElectricCar))
        .then((result) => responseHandler.setResponse(result.status, result.message, response))
        .catch((error) => {
            console.log("ERROR: " + error);
            if (error.status === 404) {
                responseHandler.setResponse(error.status, error.message, response);
            } else {
                responseHandler.setResponse(500, { "err": error }, response)
            }
        })
        .finally(() => responseHandler.sendResponse(res, response));
}

module.exports = {
    createElectricCar,
    getAllElectricCars,
    getElectricCarById,
    deleteElectricCarById,
    fullUpdateElectricCar,
    partiallyUpdateElectricCar
}