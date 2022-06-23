const SPLIT = "$&$&$&$&$&$&";

const HTTP_ERROR = {
    400: "BAD REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBBIDEN",
    404: "NOT FOUND",
    406: "NOT ACCEPTABLE",
    409: "CONFLICT",
    500: "INTERNAL SERVER ERROR",
    503: "SERVICE UNAVAILABLE",
};

const ErrorStatusAndMessage = (status, message) => {
    return new Error(`${status}${SPLIT}${message}`);
};

const httpError = (res, err) => {
    const [status, message] = err.message.split(SPLIT);
    console.log(err);
    console.log(res);

    const STATUS = Number(status);

    res.status(STATUS);
    res.send({
        error: HTTP_ERROR[STATUS],
        message,
        path: "path :v",
    });
};

module.exports = { httpError, ErrorStatusAndMessage };
