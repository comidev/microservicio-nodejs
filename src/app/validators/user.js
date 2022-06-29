const { check } = require("express-validator");
const validateResults = require("../utils/validator");

const saveAdminOrLogin = [
    check(["username", "password"]).exists().notEmpty().isLength({ min: 3 }),
    validateResults,
];

const existsUsername = [
    check(["username"]).exists().notEmpty().isLength({ min: 3 }),
    validateResults,
];
module.exports = { saveAdminOrLogin, existsUsername };
