const handleToken = require("../../middleware/handleToken");
const handleRoles = require("../../middleware/handleRole");
const express = require("express");
const router = express.Router();

const controller = require("./controller");

// TODO: TODOS
router.post("/login", controller.login);
// TODO: TODOS
router.post("/token/refresh", controller.tokenRefresh);

// TODO: SOLO ADMINS
router.get("", handleToken, handleRoles("ADMIN"), controller.findAll);
// TODO: SOLO ADMINS
router.post("/admin", handleToken, handleRoles("ADMIN"), controller.saveAdmin);

// TODO: SOLO ADMINS Y CLIENTES
router.get(
    "/:id",
    handleToken,
    handleRoles("ADMIN", "CLIENTE"),
    controller.findById
);

module.exports = router;
