const router = require("express").Router();
const controller = require("../controllers/products.controller");

router.post("", controller.createProduct);
router.get("/:id", controller.getProductById);
router.patch("/:id", controller.partiallyUpdateProduct);
router.put("/:id", controller.deleteOrUpdateById);
router.delete("/:id", controller.deleteOrUpdateById);