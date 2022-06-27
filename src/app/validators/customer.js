const { check } = require("express-validator");
const validateResults = require("../utils/validator");

const saveCustomer = [
    check(["name", "dni", "email", "regionName"]).exists().notEmpty(),
    check(["dni"]).isLength({ min: 8, max: 8 }),
    // check(["username", "password"]).isLength({ min: 3 }).exists().notEmpty(),
    validateResults,
];
const saveRegion = [check(["name"]).exists().notEmpty(), validateResults];

module.exports = { saveCustomer, saveRegion };
