const handleRoles = require("../../middleware/handleRole");
const handleToken = require("../../middleware/handleToken");
const controller = require("./controller");
const express = require("express");
const router = express.Router();

router.get("/:id", controller.findById);
router.get("", controller.findAll);

router.post("", handleToken, handleRoles("ADMIN"), controller.save);

module.exports = router;
