const { check } = require("express-validator");
const validateResults = require("../utils/validator");

const saveProduct = [
    check(["categoryName", "name", "description", "stock", "price"])
        .exists()
        .notEmpty(),
    check(["stock", "price"]).isNumeric(),
    validateResults,
];

module.exports = { saveProduct };
