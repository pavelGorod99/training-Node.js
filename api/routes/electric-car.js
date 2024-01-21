const express = require("express");
const router = express.Router();

const electricCarsController = require("../controllers/electric-cars.controller");
const manufactureController = require("../controllers/manufacture.controller");

const auth = require("../controllers/authorization.controller");

router.route("")
    .post(auth.authorization, electricCarsController.createElectricCar)
    .get(electricCarsController.getAllElectricCars);

router.route("/:electricCarId")
    .get(auth.authorization, auth.permit('admin') ,electricCarsController.getElectricCarById)
    .delete(electricCarsController.deleteElectricCarById)
    .put(electricCarsController.fullUpdateElectricCar)
    .patch(electricCarsController.partiallyUpdateElectricCar);

router.route("/:electricCarId/manufactures")
    .get(manufactureController.getAllManufactures)
    .post(manufactureController.createManufacture);

router.route("/:electricCarId/manufactures/:manufactureId")
    .get(manufactureController.getManufactureById)
    .put(manufactureController.fullUpdateManufacture)
    .patch(manufactureController.partiallyUpdateManufacture)
    .delete(manufactureController.deleteManufactureById);

module.exports = router;