const handleToken = require("../../middleware/handleToken");
const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.get("", controller.findAll);
router.get("/:id", controller.findById);
// TODO: AUTENTICADO!
router.post("", handleToken, controller.save);
// TODO: AUTENTICADO!
router.delete("", handleToken, controller.deleteById);

module.exports = router;
