const { ERROR_SPLIT } = process.env;

const HttpStatus = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBBIDEN: 403,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

const HttpStatusCode = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBBIDEN",
    404: "NOT_FOUND",
    406: "NOT_ACCEPTABLE",
    409: "CONFLICT",
    500: "INTERNAL_SERVER_ERROR",
    503: "SERVICE_UNAVAILABLE",
};

const httpError = (status, message) => {
    return new Error(`${status}${ERROR_SPLIT}${message}`);
};

const handleGeneralError = (error, req, res, next) => {
    if (!error.message.includes(ERROR_SPLIT)) {
        res.status(500);
        res.send({
            error: "INTERNAL_SERVER_ERROR",
            message: error.message,
            path: "path :v",
        });
    }

    const [status, message] = error.message.split(ERROR_SPLIT);
    console.log({ error, res, status, message });

    const STATUS = Number(status);

    res.status(STATUS);
    res.send({
        error: HttpStatusCode[STATUS],
        message,
        path: "path :v",
    });
};

module.exports = { HttpStatus, httpError, handleGeneralError };
