const jwtService = require("../utils/jwt");

module.exports = (req, res, next) => {
    const authorization = req.get("authorization");
    try {
        //req.connectedUser = jwtService.verify(authorization);
        next();
    } catch (error) {
        next(error);
    }
};
