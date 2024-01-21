const express = require("express");
const router = express.Router();

const electricCarsRouter = require("./electric-car");
const userRouter = require("./user");

router.use("/electric-cars", electricCarsRouter);
router.use(userRouter);

module.exports = router;