const jsonwebtoken = require("jsonwebtoken");
const { HttpError, HttpStatus } = require("../middleware/handleError");
const { SECRET, TOKEN_EXPIRATION_IN_SECONDS } = process.env;
const BEARER = "bearer ";
const ISSUER = "comidev";

const createToken = (payload, extraTimeInSeconds = 0) => {
    const expiresIn = Number(TOKEN_EXPIRATION_IN_SECONDS) + extraTimeInSeconds;
    const subject = payload.username;
    const issuer = ISSUER;

    return jsonwebtoken.sign(payload, SECRET, { expiresIn, subject, issuer });
};

const createTokens = (payload) => {
    const accessToken = createToken(payload);
    const refreshToken = createToken(payload,1800); //* 5 min extra
    return { access_token: accessToken, refresh_token: refreshToken };
};

const isBearer = (bearerToken) =>
    Boolean(bearerToken) &&
    bearerToken.toLowerCase().startsWith(BEARER) &&
    bearerToken.split(".").length === 3;

const verify = (bearerToken = "") => {
    if (!isBearer(bearerToken)) {
        throw HttpError(HttpStatus.UNAUTHORIZED, "Token - no es Bearer");
    }
    try {
        const token = bearerToken.substring(BEARER.length);
        const user = jsonwebtoken.verify(token, SECRET);

        if (!user.id || !user.username || !user.roles) {
            throw new Error("objeto del token inválido");
        }

        return user;
    } catch (error) {
        const message = `Token - ${error.message}`;
        throw HttpError(HttpStatus.UNAUTHORIZED, message);
    }
};

module.exports = { createTokens, verify, isBearer };
