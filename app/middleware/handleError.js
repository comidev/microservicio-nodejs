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

const HttpError = (status, message) =>
    new Error(`${status}${ERROR_SPLIT}${message}`);

const handleGeneralError = (error, req, res, next) => {
    console.log(`------- ERROR - ${new Date().toISOString()} --------`);
    const path = `${req.method} - ${req.url}`;

    if (!error.message.includes(ERROR_SPLIT)) {
        const messageError = {
            error: "??? - UNEXPECTED_ERROR",
            message: error.message,
            path,
        };
        res.status(500);
        res.send(messageError);
        console.log(messageError);
        return;
    }

    const [status, message] = error.message.split(ERROR_SPLIT);
    const STATUS = Number(status);

    const messageError = {
        error: `${STATUS} - ${HttpStatusCode[STATUS]}`,
        message,
        path,
    };

    res.status(STATUS);
    res.send(messageError);
    console.log(messageError);
};

module.exports = {
    HttpStatus,
    HttpError,
    handleGeneralError,
};
