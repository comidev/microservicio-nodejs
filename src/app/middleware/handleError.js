const { ERROR_SPLIT } = process.env;

const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBBIDEN: 403,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

const HttpStatusName = {
    400: "BAD REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBBIDEN",
    404: "NOT FOUND",
    406: "NOT ACCEPTABLE",
    409: "CONFLICT",
    500: "INTERNAL SERVER ERROR",
    503: "SERVICE UNAVAILABLE",
};
// TODO: ERROR PERSONALIZADO
const HttpError = (status, message) =>
    new Error(`${status}${ERROR_SPLIT}${message}`);

const handleGeneralError = (error, req, res, next) => {
    const path = `${req.method} - ${req.url}`;

    // TODO: Error por Express Validator
    if (error instanceof Array) {
        res.status(400);
        res.send({
            error: "400 - BAD REQUEST",
            message: error,
            path,
        });
    } else if (error.message?.includes(ERROR_SPLIT)) {
        // TODO: Error controlado :D
        const [status, message] = error.message.split(ERROR_SPLIT);
        const STATUS = Number(status);
        res.status(STATUS);
        res.send({
            error: `${STATUS} - ${HttpStatusName[STATUS]}`,
            message,
            path,
        });
    } else {
        // TODO: Error no controlado o desconocido
        res.status(400);
        res.send({
            error: "400 - BAD REQUEST",
            message: error.message || "Hubo un error :(",
            path,
        });
    }
};

module.exports = { HttpStatus, HttpError, handleGeneralError };
