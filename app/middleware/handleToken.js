const { HttpError, HttpStatus } = require("./handleError");
const jwtService = require("../services/jwt");

module.exports = (req, res, next) => {
    const authorization = req.get("authorization");
    try {
        req.connectedUser = jwtService.verify(authorization);
        next();
    } catch (error) {
        next(error);
    }
};
