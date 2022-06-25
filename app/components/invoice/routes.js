const handleToken = require("../../middleware/handleToken");
const handleRoles = require("../../middleware/handleRole");
const express = require("express");
const router = express.Router();
const controller = require("./controller");

// TODO: TODOS AUTENTICADOS
router.get("", handleToken, handleRoles("ADMIN"), controller.findAll);
router.get("/:id", handleToken, controller.findById);
router.get("/customer/:id", handleToken, controller.findByCustomerId);
router.post("", handleToken, handleRoles("CLIENTE"), controller.save);

module.exports = router;
