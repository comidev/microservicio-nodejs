const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const { createUser, createRole } = require("./helpers/index");

const userRepo = require("../services/model/mongodb/user");
const jwtService = require("../utils/jwt");
const API = supertest(app);

beforeEach(async () => {
    await userRepo.deleteMany();
});

describe("GET /users", () => {
    test("NO CONTENT, cuando no hay usuarios", async () => {
        const response = await API.get(`/users`).send();
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos un usuario", async () => {
        await createUser();
        const response = await API.get(`/users`).send();
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /users/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        const response = await API.get(`/users/123`).send();
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el id es correcto", async () => {
        const { _id: id } = await createUser();
        const response = await API.get(`/users/${id}`).send();
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("POST /users/admin", () => {
    test("BAD REQUEST, cuando el body es vacio", async () => {
        const response = await API.post(`/users/admin`).send({});
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay campos vacios en el body", async () => {
        const userRequest = {
            password: "",
        };
        const response = await API.post(`/users/admin`).send(userRequest);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando los campos presentan ' ' espacios", async () => {
        const userRequest = {
            username: "soy el  user   name",
            password: "strong password",
        };
        const response = await API.post(`/users/admin`).send(userRequest);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando el username y/o password es menor 3 length", async () => {
        const userRequest = {
            username: "so",
            password: "12",
        };
        const response = await API.post(`/users/admin`).send(userRequest);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CONFLICT, cuando el username ya existe", async () => {
        const { username } = await createUser();
        const userRequest = {
            username: username,
            password: "1234",
        };
        const response = await API.post(`/users/admin`).send(userRequest);
        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("CREATED, cuando los campos no son vacios y el username es nuevo", async () => {
        const userRequest = {
            username: "soy_un_username_nuevo",
            password: "1234",
        };
        const response = await API.post(`/users/admin`).send(userRequest);
        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

describe("POST /users/login", () => {
    test("BAD REQUEST, cuando el body es vacio", async () => {
        const response = await API.post(`/users/login`).send({});
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay campos vacios en el body", async () => {
        const userRequest = {
            password: "",
        };
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
        const userRequest = {
            username: "so",
            password: "12",
        };
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
        const userRequest = {
            username: "username_incorrecto",
            password,
        };
        const response = await API.post(`/users/login`).send(userRequest);
        expect(response.status).toBe(HttpStatus.FORBBIDEN);
    });

    test("OK, cuando las credenciales son correctas y recibimos un token", async () => {
        const roleId = await createRole();
        const { username, password } = await createUser(roleId);
        const userRequest = { username, password };

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
        const roleId = await createRole();
        const { username, password } = await createUser(roleId);
        const userRequest = { username, password };
        const responseLogin = await API.post(`/users/login`).send(userRequest);
        const { refresh_token } = responseLogin.body;

        const response = await API.post(`/users/token/refresh`).set({
            Authorization: `Bearer ${refresh_token}`,
        });

        console.log(response.body);

        expect(response.status).toBe(HttpStatus.OK);
        const { access_token, refresh_token: refresh_tokenRes } = response.body;
        const isBearer =
            jwtService.isBearer(`Bearer ${access_token}`) &&
            jwtService.isBearer(`Bearer ${refresh_tokenRes}`);
        expect(isBearer).toBe(true);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close(); /*  */
});
