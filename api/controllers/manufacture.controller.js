const mongoose = require("mongoose");
const ElectricCar = mongoose.model("ElectricCar");
const responseHandler = require("./response.handler");

const getManufactureById = function(req, res) {
    const electricCarId = req.params.electricCarId;
    const manufactureId = req.params.manufactureId;
    const response = responseHandler.createResponseObject();
 
    ElectricCar.findOne(
        {
            _id: electricCarId,
            'manufactures._id': manufactureId
        },
        {
            'manufactures.$': 1
        }
    ).exec()
    .then((electricCar) => response.message = electricCar.manufactures[0])
    .catch((err) => responseHandler.setResponse(500, { "err": err }, response))
    .finally(() => responseHandler.sendResponse(res, response));
}

const getAllManufactures = function(req, res) {
    const electricCarId = req.params.electricCarId;
    const response = responseHandler.createResponseObject();

    ElectricCar.findById(electricCarId)
        .select("manufactures")
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar))
        .then((electricCar) => response.message = electricCar.manufactures)
        .catch((error) => {
            if (error.status === 404) {
                responseHandler.setResponse(error.status, error.message, response);
            } else {
                responseHandler.setResponse(500, { "err": error }, response);
            }
        })
        .finally(() => responseHandler.sendResponse(res, response));
}

const createManufacture = function(req, res) {
    const electricCarId = req.params.electricCarId;
    const manufacture = req.body;
    const response = responseHandler.createResponseObject();

    ElectricCar.findById(electricCarId)
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar))
        .then((electricCar) => _addNewManufacture(manufacture, electricCar))
        .then((electricCar) => _saveElectricCar(electricCar))
        .then(() => response.message = "Manufacture created successfully!")
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
    const response = responseHandler.createResponseObject();
    return new Promise((resolve, reject) => {
        if (electricCar) {
            resolve(electricCar);
        } else {
            response.status = 404;
            response.message = "Electric car ID not found!";
            reject(response);
        }
    });
}

const _addNewManufacture = function(body, electricCar) {
    const manufactureArr = electricCar.manufactures;
    const newManufacture = {};

    newManufacture.country = body.country;
    if (body.state && body.state != "") {
        newManufacture.state = body.state;
    }
    newManufacture.city = body.city;

    manufactureArr.push(newManufacture);
    electricCar.manufactures = manufactureArr;

    return Promise.resolve(electricCar);
}

const _saveElectricCar = function(electricCar) {
    return electricCar.save();
}

const fullUpdateManufacture = function(req, res) {
    const _setManufacture = function(req, manufacture) {
        manufacture.country = req.body.country;
        if (req.body.state) {
            manufacture.state = req.body.state;
        }
        manufacture.city = req.body.city;
    }
    _update(req, res, _updateManufacture, _setManufacture);
}

const partiallyUpdateManufacture = function(req, res) {
    const _setManufacture = function(req, manufacture) {
        if (req.body.country) { manufacture.country = req.body.country; }
        if (req.body.state) { manufacture.state = req.body.state; }
        if (req.body.city) { manufacture.city = req.body.city; }
    }
    _update(req, res, _updateManufacture, _setManufacture);
}

const _updateManufacture = function(req, electricCar, _setManufacture) {
    const response = responseHandler.createResponseObject();

    return new Promise((resolve, reject) => {
        const manufactureId = req.params.manufactureId;
        const manufactureToUpdate = electricCar.manufactures.id(manufactureId);

        if (!manufactureToUpdate) {
            response.status = 404;
            response.status = "Manufacture with ID not found!";
        } else {
            _setManufacture(req, manufactureToUpdate);
            _saveElectricCar(electricCar)
                .then(() => {
                    response.status = 200;
                    response.message = "Manufacture updated successfully!";
                    resolve(response);
                })
                .catch((error) => reject(error));
        }
    });
}

const _update = function(req, res, _updateManufacture, _setManufacture) {
    const electricCarId = req.params.electricCarId;
    const response = responseHandler.createResponseObject();

    ElectricCar.findById(electricCarId)
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar))
        .then((electricCar) => _updateManufacture(req, electricCar, _setManufacture))
        .then((result) => responseHandler.setResponse(result.status, result.message, response))
        .catch((error) => {
            if (error.status === 404) {
                responseHandler.setResponse(error.status, error.message, response);
            } else {
                responseHandler.setResponse(500, { "err": error }, response);
            }
        })
        .finally(() => responseHandler.sendResponse(res, response));
}

const deleteManufactureById = function(req, res) {
    const electricCarId = req.params.electricCarId;
    const manufactureId = req.params.manufactureId;
    const response = responseHandler.createResponseObject();

    ElectricCar.updateOne(
        { _id: electricCarId },
        { $pull: { manufactures: { _id: manufactureId } } }
    ).exec()
    .then((result) => _checkIfAnyObjectWasModified(result, response))
    .catch((error) => {
        if (error.status != 404) {
            responseHandler.setResponse(500, { "err": error }, response);
        }
    })
    .finally(() => responseHandler.sendResponse(res, response));
}

const _checkIfAnyObjectWasModified = function(result, response) {
    return new Promise((resolve, reject) => {
        if (result.modifiedCount == 0) {
            response.status = 404;
            response.message = "Manufacture not found!";
            reject(response);
        } else {
            response.message = "Manufacture deleted successfully!";
            resolve(response);
        }
    });
}

module.exports = {
    getManufactureById,
    getAllManufactures,
    createManufacture,
    fullUpdateManufacture,
    partiallyUpdateManufacture,
    deleteManufactureById
}