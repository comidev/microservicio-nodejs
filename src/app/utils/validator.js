const { validationResult } = require("express-validator");

const validateResults = (req, res, next) => {
    try {
        validationResult(req).throw();
        next();
    } catch (e) {
        const error = e.errors;
        next(error);
    }
};

module.exports = validateResults;
