const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const {
    createUser,
    createRole,
    createCustomer,
    createTokenAdmin,
    createTokenClient,
} = require("./helpers/index");

const userRepo = require("../services/model/mongodb/user");
const jwtService = require("../utils/jwt");
const API = supertest(app);

beforeEach(async () => {
    await userRepo.deleteMany();
});

describe("GET /users", () => {
    test("NO CONTENT, cuando no hay usuarios", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenAdmin();

        await userRepo.deleteMany();

        const response = await API.get(`/users`).set(token).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos un usuario", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenAdmin();

        await createUser();

        const response = await API.get(`/users`).set(token).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /users/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenAdmin();

        const response = await API.get(`/users/123`).set(token).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el id es correcto", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenAdmin();

        const { _id } = await createUser();

        const response = await API.get(`/users/${_id}`).set(token).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("POST /users/admin", () => {
    test("BAD REQUEST, cuando el body es vacio", async () => {
        const response = await API.post(`/users/admin`).send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay campos vacios en el body", async () => {
        const userRequest = { password: "" };

        const response = await API.post(`/users/admin`).send(userRequest);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando el username y/o password es menor 3 length", async () => {
        const userRequest = { username: "so", password: "12" };

        const response = await API.post(`/users/admin`).send(userRequest);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando los campos presentan ' ' espacios", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenAdmin();

        const userRequest = {
            username: "soy el  user   name",
            password: "strong password",
        };

        const response = await API.post(`/users/admin`).set(token).send(userRequest);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CONFLICT, cuando el username ya existe", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenAdmin();

        const { username } = await createUser();
        const userRequest = {
            username: username,
            password: "1234",
        };

        const response = await API.post(`/users/admin`).set(token).send(userRequest);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("CREATED, cuando los campos no son vacios y el username es nuevo", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenAdmin();

        const userRequest = {
            username: "soy_un_username_nuevo",
            password: "1234",
        };

        const response = await API.post(`/users/admin`).set(token).send(userRequest);

        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

describe("POST /users/login", () => {
    test("BAD REQUEST, cuando el body es vacio", async () => {
        const response = await API.post(`/users/login`).send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay campos vacios en el body", async () => {
        const userRequest = { password: "" };

        const response = await API.post(`/users/login`).send(userRequest);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando los campos presentan ' ' espacios", async () => {
        const userRequest = {
            username: "soy el username",
            password: "strong password",
        };

        const response = await API.post(`/users/login`).send(userRequest);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando el username y/o password es menor 3 length", async () => {
        const userRequest = { username: "so", password: "12" };

        const response = await API.post(`/users/login`).send(userRequest);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("FORBBIDEN, cuando el password es incorrecto", async () => {
        const { username } = await createUser();
        const userRequest = {
            username,
            password: "password_incorrecto",
        };

        const response = await API.post(`/users/login`).send(userRequest);

        expect(response.status).toBe(HttpStatus.FORBBIDEN);
    });

    test("FORBBIDEN, cuando el username es incorrecto", async () => {
        const { password } = await createUser();
        const userRequest = { username: "username_incorrecto", password };

        const response = await API.post(`/users/login`).send(userRequest);

        expect(response.status).toBe(HttpStatus.FORBBIDEN);
    });

    test("OK, cuando las credenciales son correctas y recibimos un token", async () => {
        const { _id } = await createRole();
        const { username, password } = await createUser({ role: _id });
        const userRequest = { username, password };

        const response = await API.post(`/users/login`).send(userRequest);

        expect(response.status).toBe(HttpStatus.OK);
        const { access_token, refresh_token } = response.body;
        const isBearer =
            jwtService.isBearer(`Bearer ${access_token}`) &&
            jwtService.isBearer(`Bearer ${refresh_token}`);
        expect(isBearer).toBe(true);
    });

    test("OK, cuando ingresamos con email y password, y recibimos un token", async () => {
        const { _id } = await createRole();
        const { _id: userId, password } = await createUser({ role: _id });
        const { email } = await createCustomer({ userId });
        const userRequest = { username: email, password };

        const response = await API.post(`/users/login`).send(userRequest);

        expect(response.status).toBe(HttpStatus.OK);
        const { access_token, refresh_token } = response.body;
        const isBearer =
            jwtService.isBearer(`Bearer ${access_token}`) &&
            jwtService.isBearer(`Bearer ${refresh_token}`);
        expect(isBearer).toBe(true);
    });
});

describe("POST /users/token/refresh", () => {
    test("UNAUTHORIZED, cuando no hay token en el header", async () => {
        const response = await API.post(`/users/token/refresh`).send();

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test("UNAUTHORIZED, cuando el token es incorrecto", async () => {
        const response = await API.post(`/users/token/refresh`).set({
            Authorization: "Beaer token.feik",
        });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test("OK, cuando el token es correcto", async () => {
        const { _id } = await createRole();
        const { username, password } = await createUser({ role: _id });
        const userRequest = { username, password };

        const responseLogin = await API.post(`/users/login`).send(userRequest);

        const { refresh_token } = responseLogin.body;

        const response = await API.post(`/users/token/refresh`).set({
            Authorization: `Bearer ${refresh_token}`,
        });

        expect(response.status).toBe(HttpStatus.OK);
        const { access_token, refresh_token: refresh_tokenRes } = response.body;
        const isBearer =
            jwtService.isBearer(`Bearer ${access_token}`) &&
            jwtService.isBearer(`Bearer ${refresh_tokenRes}`);
        expect(isBearer).toBe(true);
    });
});

describe("POST /users/validate/username", () => {
    test("BAD REQUEST, cuando el body esta vacio", async () => {
        const response = await API.post(`/users/validate/username`).send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando el username menr a 3 length", async () => {
        const response = await API.post(`/users/validate/username`).send({
            username: "12",
        });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("OK, true, cuando el username es correcto y existe", async () => {
        const { username } = await createUser();
        const userRequest = { username };

        const response = await API.post(`/users/validate/username`).send(
            userRequest
        );

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.exists).toBeDefined();
        expect(response.body.exists).toBeTruthy();
    });

    test("OK, false, cuando el useranme es correcto y NO existe", async () => {
        const userRequest = { username: "usernameQueNoExiste" };

        const response = await API.post(`/users/validate/username`).send(
            userRequest
        );

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.exists).toBeDefined();
        expect(response.body.exists).toBeFalsy();
    });
});

describe("POST /users/auth/info", () => {
    test("UNAUTHORIZED, cuando no hay token en el header", async () => {
        const response = await API.post(`/users/auth/info`).send();

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test("UNAUTHORIZED, cuando el token es incorrecto", async () => {
        const response = await API.post(`/users/auth/info`).set({
            Authorization: "Beaer token.feik",
        });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test("OK, cuando el token es correcto", async () => {
        const { _id } = await createRole();
        const { _id: userId, username, password } = await createUser({ role: _id });
        const { photoUrl, _id: customerId, name } = await createCustomer({ userId });

        const userRequest = { username, password };
        const responseLogin = await API.post(`/users/login`).send(userRequest);
        const { access_token } = responseLogin.body;

        const response = await API.post(`/users/auth/info`).set({
            Authorization: `Bearer ${access_token}`,
        });

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.photoUrl).toBe(photoUrl);
        expect(response.body.customerId).toBe(customerId.toJSON());
        expect(response.body.username).toBe(username);
        expect(response.body.name).toBe(name);
    });
});

describe("PUT /users/:id/password", () => {
    test("BAD REQUEST, cuando el body esta vacio", async () => {
        const response = await API.put(`/users/123/password`).send();

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenClient();

        const response = await API.put(`/users/123/password`).set(token).send({
            currentPassword: "xd1",
            newPassword: "xd2",
        });

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("UNAUTHORIZED, cuando el password es incorrecto", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenClient();

        const { _id: userId } = await createUser();

        const response = await API.put(`/users/${userId}/password`).set(token).send({
            currentPassword: "soy_un_mal_password",
            newPassword: "xd2",
        });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    test("OK, cuando el password es correcto y se actualiza", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenClient();

        const { _id: userId, password } = await createUser();

        const response = await API.put(`/users/${userId}/password`).set(token).send({
            currentPassword: password,
            newPassword: "SoyNuevo",
        });

        expect(response.status).toBe(HttpStatus.OK);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
