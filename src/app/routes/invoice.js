const handleToken = require("../middleware/handleToken");
const { handleRoles, ROLES } = require("../middleware/handleRole");
const express = require("express");

const router = express.Router();
const controller = require("../controllers/invoice");
const validator = require("../validators/invoice");

// TODO: TODOS AUTENTICADOS
router.get("", handleToken, handleRoles(ROLES.ADMIN), controller.findAll);
router.get("/:id", handleToken, controller.findById);
router.get(
    "/customer/:id",
    handleToken,
    handleRoles(ROLES.CLIENTE),
    controller.findByCustomerId
);
router.post(
    "",
    validator.save,
    handleToken,
    handleRoles(ROLES.CLIENTE),
    controller.save
);

module.exports = router;
