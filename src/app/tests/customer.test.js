const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const { createCustomer, createUser, createRegion } = require("./helpers/index");
const regionRepo = require("../services/model/mongodb/region");
const customerRepo = require("../services/model/mongodb/customer");

const API = supertest(app);

beforeEach(async () => {
    await customerRepo.deleteMany();
});

describe("GET /customers", () => {
    test("NO CONTENT, cuando no hay clientes", async () => {
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
            email,
            photoUrl: "none",
            user: {
                username: "cesar",
                password: "123",
            },
            regionName: "Region",
        };

        const response = await API.post(`/customers/`).send(customerRequest);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("CONFLICT, cuando algun username es repetido pero debe ser unico", async () => {
        const { name: regionName } = await createRegion();
        const { _id, username } = await createUser();
        await createCustomer({ userId: _id });
        const customerRequest = {
            dni: "87654321",
            name: "comidev",
            email: "email@email.com",
            photoUrl: "none",
            user: {
                username,
                password: "123",
            },
            regionName,
        };

        const response = await API.post(`/customers/`).send(customerRequest);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("NOT FOUND, cuando la region no existe", async () => {
        const customerRequest = {
            dni: "87654321",
            name: "comidev",
            email: "email@email.com",
            photoUrl: "none",
            user: {
                username: "username",
                password: "123",
            },
            regionName: "No existo u_u",
        };

        const response = await API.post(`/customers/`).send(customerRequest);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("CREATED, cuando los campos son correctos", async () => {
        const { name: regionName } = await createRegion();

        const customerRequest = {
            dni: "87654321",
            name: "comidev",
            email: "email@email.com",
            photoUrl: "none",
            user: {
                username: "username",
                password: "123",
            },
            regionName,
        };

        const response = await API.post(`/customers/`).send(customerRequest);

        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

describe("POST /customers/regions", () => {
    test("CONFLICT, cuando el 'name' ya existe", async () => {
        const { name } = await createRegion();

        const response = await API.post("/customers/regions").send({ name });

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("BAD REQUEST, cuando no hay 'name'", async () => {
        const response = await API.post("/customers/regions").send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CREATED, cuando 'name' es nuevo", async () => {
        await regionRepo.deleteMany();
        const name = "Soy una nueva categoria";

        const response = await API.post("/customers/regions").send({ name });

        expect(response.status).toBe(HttpStatus.CREATED);
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

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
