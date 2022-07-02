const { check } = require("express-validator");
const validateResults = require("../utils/validator");

const saveCustomer = [
    check(["name", "dni", "email", "countryName", "gender", "dateOfBirth"])
        .exists()
        .notEmpty(),
    check(["dni"]).isLength({ min: 8, max: 8 }),
    check(["user"]).isObject().notEmpty().exists(),
    validateResults,
];
const saveCountry = [check(["name"]).exists().notEmpty(), validateResults];
const existsEmail = [check(["email"]).exists().notEmpty(), validateResults];

module.exports = { saveCustomer, saveCountry, existsEmail };
