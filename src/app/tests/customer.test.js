const supertest = require("supertest");
const mongoose = require("mongoose");
const shortUUID = require("short-uuid");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const customerRepo = require("../services/model/mongodb/customer");
const userRepo = require("../services/model/mongodb/user");
const regionRepo = require("../services/model/mongodb/region");
const API = supertest(app);

// ! Creamos una region
const initRegions = async () => {
    await regionRepo.deleteMany({});
    const { _id: id, name } = await customerRepo.create({ name: "region" });
    return { id: id.toJSON(), name };
};

// ! Poblamos de clientes
const createCustomer = (region, username, dni) => {
    return {
        dni: dni || shortUUID.generate().substring(0, 8),
        name: shortUUID.generate(),
        email: shortUUID.generate(),
        photoUrl: shortUUID.generate(),
        user: {
            username,
            password: "123",
        },
        region,
    };
};

let customersDB = [];
let regionDB = null;
beforeEach(async () => {
    await customerRepo.deleteMany();
    await userRepo.deleteMany();
    regionDB = await initRegions();
    customersDB = [];
    const customersFeik = [
        createCustomer(regionDB.id, "omar1"),
        createCustomer(regionDB.id, "omar12"),
        createCustomer(regionDB.id, "omar123", "12345678"),
    ];
    for (const customerFeik of customersFeik) {
        const { _id: user } = await userRepo.create({
            username: customerFeik.user.username,
            password: customerFeik.user.password,
        });
        customerFeik.user = user;
        const { _id: id, name } = await customerRepo.create(customerFeik);
        customersDB.push({ id: id.toJSON(), name });
    }
});

describe("GET /customers", () => {
    test("NO CONTENT, cuando no hay clientes", async () => {
        await customerRepo.deleteMany();
        const response = await API.get(`/customers`).send();
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos un cliente", async () => {
        const response = await API.get(`/customers`).send();
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /customers/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        const response = await API.get(`/customers/123`).send();
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el id es correcto", async () => {
        const id = customersDB[0].id;
        const response = await API.get(`/customers/${id}`).send();
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.name).toBe(customersDB[0].name);
    });
});

describe("POST /customers", () => {
    test("BAD REQUEST, cuando el body esta vacio", async () => {
        const response = await API.post(`/customers/`).send({});
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CONFLICT, cuando algun campo es repetido pero debe ser unico", async () => {
        const customer = createCustomer(undefined, "omar1234", "12345678");
        customer.regionName = regionDB.name;

        const response = await API.post(`/customers/`).send(customer);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("CONFLICT, cuando algun username es repetido pero debe ser unico", async () => {
        const customer = createCustomer(undefined, "omar123");
        const { name } = await regionRepo.create({ name: "region2" });
        customer.regionName = name;

        const response = await API.post(`/customers/`).send(customer);

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("BAD REQUEST, cuando la region no existe", async () => {
        const response = await API.post(`/customers/`).send(
            createCustomer("no existo", "omar1234")
        );
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CREATED, cuando los campos son correctos", async () => {
        const customer = createCustomer(undefined, "omar1234");
        const { name } = await regionRepo.create({ name: "region2" });
        customer.regionName = name;
        const response = await API.post(`/customers/`).send(customer);
        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

describe("POST /customers/regions", () => {
    test("CONFLICT, cuando el 'name' ya existe", async () => {
        const name = "Ya existo";
        await regionRepo.create({ name });
        const response = await API.post("/customers/regions").send({ name });
        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("BAD REQUEST, cuando no hay 'name'", async () => {
        const response = await API.post("/customers/regions").send({});
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CREATED, cuando 'name' es nuevo", async () => {
        const response = await API.post("/customers/regions").send({
            name: "Soy una nueva categoria",
        });
        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

describe("DELETE /customers/:id", () => {
    test("NOT FOUND, cuando el id no existe", async () => {
        const name = "Ya existo";
        await customerRepo.create({ name });
        const response = await API.post("/categories").send({ name });
        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("OK, cuando hay se elimina con exito", async () => {
        const response = await API.post("/categories").send({});
        expect(response.status).toBe(HttpStatus.OK);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
