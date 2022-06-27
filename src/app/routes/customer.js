const { handleRoles, ROLES } = require("../middleware/handleRole");
const handleToken = require("../middleware/handleToken");
const controller = require("../controllers/customer");
const validator = require("../validators/customer");

const express = require("express");
const router = express.Router();

router.post("", validator.saveCustomer, controller.save);

// TODO: SOLO CLIENTES
router.get("/:id", handleToken, handleRoles(ROLES.CLIENTE), controller.findById);

// TODO: SOLO ADMINS
router.get("", handleToken, handleRoles(ROLES.ADMIN), controller.findAll);

// TODO: SOLO ADMINS
router.post(
    "/regions",
    validator.saveRegion,
    handleToken,
    handleRoles(ROLES.ADMIN),
    controller.saveRegion
);

// TODO: SOLO ADMINS Y CLIENTES
router.delete(
    "/:id",
    handleToken,
    handleRoles(ROLES.ADMIN, ROLES.CLIENTE),
    controller.deleteById
);

module.exports = router;
