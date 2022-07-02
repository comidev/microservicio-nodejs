const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const GENDERS = require("../utils/genders");
const { createCustomer, createUser, createCountry } = require("./helpers/index");
const countryRepo = require("../services/model/mongodb/country");
const customerRepo = require("../services/model/mongodb/customer");
const userRepo = require("../services/model/mongodb/user");

const API = supertest(app);

beforeEach(async () => {
    await customerRepo.deleteMany();
});

describe("GET /customers", () => {
    test("NO CONTENT, cuando no hay clientes", async () => {
        await customerRepo.deleteMany();

        const response = await API.get(`/customers`).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos un cliente", async () => {
        await createCustomer();

        const response = await API.get(`/customers`).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /customers/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto o no existe", async () => {
        const response = await API.get(`/customers/123`).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el id es correcto y existe", async () => {
        const { _id, name } = await createCustomer();

        const response = await API.get(`/customers/${_id}`).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.name).toBe(name);
    });
});

describe("POST /customers", () => {
    test("BAD REQUEST, cuando el body esta vacio", async () => {
        const response = await API.post(`/customers/`).send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CONFLICT, cuando algun campo es repetido pero debe ser unico", async () => {
        const { dni, email } = await createCustomer();
        const customerRequest = {
            dni,
            name: "comidev",
            gender: GENDERS.MALE,
            dateOfBirth: new Date(2000, 3, 11),
            email,
            photoUrl: "none",
            user: {
                username: "cesar",
                password: "123",
            },
            countryName: "Perú",
        };

        const response = await API.post(`/customers/`).send(customerRequest);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("CONFLICT, cuando algun username es repetido pero debe ser unico", async () => {
        const { name: countryName } = await createCountry();
        const { _id, username } = await createUser();
        await createCustomer({ userId: _id });
        const customerRequest = {
            dni: "87654321",
            name: "comidev",
            email: "email@email.com",
            gender: GENDERS.MALE,
            dateOfBirth: new Date(2000, 3, 11),
            photoUrl: "none",
            user: {
                username,
                password: "123",
            },
            countryName,
        };

        const response = await API.post(`/customers`).send(customerRequest);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("NOT FOUND, cuando el país no existe", async () => {
        const customerRequest = {
            dni: "87654321",
            name: "comidev",
            email: "email@email.com",
            gender: GENDERS.MALE,
            dateOfBirth: new Date(2000, 3, 11),
            photoUrl: "none",
            user: {
                username: "username",
                password: "123",
            },
            countryName: "No existo u_u",
        };

        const response = await API.post(`/customers/`).send(customerRequest);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("CREATED, cuando los campos son correctos", async () => {
        await userRepo.deleteMany();
        const { name: countryName } = await createCountry();

        const customerRequest = {
            dni: "87654321",
            name: "comidev",
            gender: GENDERS.MALE,
            dateOfBirth: new Date(2000, 3, 11),
            email: "email@email.com",
            photoUrl: "none",
            user: {
                username: "usernameIrrepetibleYUnico",
                password: "123",
            },
            countryName,
        };

        const response = await API.post(`/customers/`).send(customerRequest);

        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

describe("GET /customers/countries", () => {
    test("NO CONTENT, cuando no hay ningun pais", async () => {
        await countryRepo.deleteMany();

        const response = await API.get("/customers/countries").send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos una país", async () => {
        await createCountry();

        const response = await API.get("/customers/countries").send({});

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("DELETE /customers/:id", () => {
    test("NOT FOUND, cuando el id no existe", async () => {
        const response = await API.delete("/customers/123").send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando hay se elimina con exito", async () => {
        const { _id } = await createCustomer();

        const response = await API.delete(`/customers/${_id}`).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("POST /customers/validate/email", () => {
    test("BAD REQUEST, cuando el body esta vacio", async () => {
        const response = await API.post(`/customers/validate/email`).send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("OK, true, cuando el email es correcto y existe", async () => {
        const { email } = await createCustomer();
        const customerRequest = { email };

        const response = await API.post(`/customers/validate/email`).send(
            customerRequest
        );

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.exists).toBeDefined();
        expect(response.body.exists).toBeTruthy();
    });

    test("OK, false, cuando el email es correcto y NO existe", async () => {
        const customerRequest = { email: "unnuevo@email.comxd" };

        const response = await API.post(`/customers/validate/email`).send(
            customerRequest
        );

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.exists).toBeDefined();
        expect(response.body.exists).toBeFalsy();
    });
});

describe("PUT /customers/:id", () => {
    test("BAD REQUEST, cuando el body esta vacio", async () => {
        const response = await API.put(`/customers/:id`).send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("NOT FOUND, cuando el id no existe", async () => {
        const { email, name, photoUrl, dni, gender, dateOfBirth } =
            await createCustomer();

        const customerReq = {
            dni,
            name,
            email,
            photoUrl,
            gender,
            dateOfBirth,
            countryName: "Perú",
            user: {
                username: "feik",
                password: "soy_falso",
            },
        };

        const response = await API.put(`/customers/123`).send(customerReq);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("UNAUTHORIZED, cuando el password es incorrecto", async () => {
        const { _id: countryId, name: countryName } = await createCountry();
        const { _id: userId, username, password } = await createUser();
        const {
            _id: customerId,
            email,
            name,
            photoUrl,
            dni,
            gender,
            dateOfBirth,
        } = await createCustomer({ userId, countryId });

        const customerReq = {
            dni,
            name,
            email,
            photoUrl,
            gender,
            dateOfBirth,
            countryName,
            user: {
                username,
                password: "soy_falso",
            },
        };

        const response = await API.put(`/customers/${customerId}`).send(customerReq);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
    test("OK, cuando todo está correcto y se actualiza", async () => {
        const { _id: countryId, name: countryName } = await createCountry();
        const { _id: userId, username, password } = await createUser();
        const {
            _id: customerId,
            email,
            photoUrl,
            dni,
            gender,
            dateOfBirth,
        } = await createCustomer({ userId, countryId });

        const customerReq = {
            dni,
            name: "Cesar Espinoza",
            email,
            photoUrl,
            gender,
            dateOfBirth,
            countryName,
            user: {
                username,
                password,
            },
        };

        const response = await API.put(`/customers/${customerId}`).send(customerReq);
        console.log(response.body);

        expect(response.status).toBe(HttpStatus.OK);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
