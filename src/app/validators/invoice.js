const { check, body } = require("express-validator");
const validateResults = require("../utils/validator");

const save = [
    check(["customerId", "description"]).exists().notEmpty(),
    check("invoiceItems").exists().isArray({ min: 1 }),
    validateResults,
];

module.exports = { save };
