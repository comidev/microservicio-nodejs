const { check } = require("express-validator");
const validateResults = require("../utils/validator");

const saveProduct = [
    check(["name", "description", "stock", "price", "photoUrl"]).exists().notEmpty(),
    check(["categories"]).exists().notEmpty().isArray({ min: 1 }),
    check(["stock", "price"]).isNumeric(),
    validateResults,
];

module.exports = { saveProduct };
