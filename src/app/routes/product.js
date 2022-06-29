const express = require("express");
const router = express.Router();

const handleToken = require("../middleware/handleToken");
const controller = require("../controllers/product");
const validator = require("../validators/product");

router.get("", controller.findAllOrFields);
router.get("/:id", controller.findById);
// TODO: AUTENTICADO!
router.post("", validator.saveProduct, handleToken, controller.save);
// TODO: AUTENTICADO!
router.delete("", handleToken, controller.deleteById);

module.exports = router;
