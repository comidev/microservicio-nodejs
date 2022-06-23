const express = require("express");
const productController = require("./controller");
const router = express.Router();

router.get("", productController.findAll);
router.get("/:id", productController.findById);
router.post("", productController.save);
router.delete("", productController.deleteById);

module.exports = router;
