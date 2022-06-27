const { handleRoles, ROLES } = require("../middleware/handleRole");
const handleToken = require("../middleware/handleToken");
const controller = require("../controllers/category");
const validator = require("../validators/category");

const express = require("express");
const router = express.Router();

router.get("/:id", controller.findById);
router.get("", controller.findAll);

router.post(
    "",
    validator.save,
    handleToken,
    handleRoles(ROLES.ADMIN),
    controller.save
);

module.exports = router;
