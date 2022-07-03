const handleToken = require("../middleware/handleToken");
const { handleRoles, ROLES } = require("../middleware/handleRole");
const validator = require("../validators/user");

const express = require("express");
const router = express.Router();

const controller = require("../controllers/user");

// TODO: TODOS
router.post("/login", validator.saveAdminOrLogin, controller.login);
// TODO: TODOS
router.post("/token/refresh", controller.tokenRefresh);
router.post("/token/validate", controller.tokenValidate);
// TODO: TODOS
router.put(
    "/:id/password",
    validator.updatePassword,
    handleToken,
    handleRoles(ROLES.CLIENTE),
    controller.updatePassword
);
// TODO: CLIENTE
router.post(
    "/auth/info",
    handleToken,
    handleRoles(ROLES.CLIENTE),
    controller.authInfo
);
// TODO: TODOS
router.post(
    "/validate/username",
    validator.existsUsername,
    controller.existsUsername
);

// TODO: SOLO ADMINS
router.get("", handleToken, handleRoles(ROLES.ADMIN), controller.findAll);
// TODO: SOLO ADMINS
router.post(
    "/admin",
    validator.saveAdminOrLogin,
    handleToken,
    handleRoles(ROLES.ADMIN),
    controller.saveAdmin
);

// TODO: SOLO ADMINS Y CLIENTES
router.get(
    "/:id",
    handleToken,
    handleRoles(ROLES.ADMIN, ROLES.CLIENTE),
    controller.findById
);

module.exports = router;
