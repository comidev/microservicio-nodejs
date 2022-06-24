const jsonwebtoken = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // Sacamos el JWT
    // Guardamos en el REQ alguna info nueva
    next();
};
