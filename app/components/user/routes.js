const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.get("", controller.findAll);
router.get("/:id", controller.findById);
router.post("/login", controller.login);
router.post("/cliente", controller.saveCliente);
router.post("/admin", controller.saveAdmin);

module.exports = router;
