const { check } = require("express-validator");
const validateResults = require("../utils/validator");

const save = [check(["name"]).exists().notEmpty(), validateResults];


module.exports = { save };
