const { HttpError, HttpStatus } = require("./handleError");

const handleRoles = (allowedRoles) => (req, res, next) => {
    try {
        const { roles } = req.connectedUser;

        const isPermited = allowedRoles.some((allowedRoles) =>
            roles.includes(allowedRoles)
        );

        if (!isPermited) {
            const message = "No tiene autorización >:(";
            throw HttpError(HttpStatus.FORBBIDEN, message);
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = (...roles) => handleRoles(roles);
