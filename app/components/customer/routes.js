const handleRoles = require("../../middleware/handleRole");
const handleToken = require("../../middleware/handleToken");
const controller = require("./controller");
const express = require("express");
const router = express.Router();

router.post("", controller.save);
// TODO: SOLO CLIENTES
router.get("/:id", handleToken, handleRoles("CLIENTE"), controller.findById);
// TODO: SOLO ADMINS
router.get("", handleToken, handleRoles("ADMIN"), controller.findAll);
// TODO: SOLO ADMINS
router.post("/regions", handleToken, handleRoles("ADMIN"), controller.saveRegion);
// TODO: SOLO ADMINS Y CLIENTES
router.delete(
    "/:id",
    handleToken,
    handleRoles("ADMIN", "CLIENTE"),
    controller.deleteById
);

module.exports = router;
