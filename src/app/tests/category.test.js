const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const categoryRepo = require("../services/model/mongodb/category");
const { createCategory } = require("./helpers/index");
const API = supertest(app);

beforeEach(async () => {
    await categoryRepo.deleteMany();
});

describe("GET /categories", () => {
    test("NO CONTENT, cuando no hay categorias", async () => {
        const response = await API.get("/categories").send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos una categoria", async () => {
        await createCategory();

        const response = await API.get("/categories").send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /categories/:id", () => {
    test("NOT FOUND, id incorrecto o no existe", async () => {
        const response = await API.get("/categories/123").send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el id es correcto y existe", async () => {
        const { _id, name } = await createCategory();

        const response = await API.get(`/categories/${_id}`).send();

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.name).toBe(name);
    });
});

describe("POST /categories", () => {
    test("CONFLICT, cuando el 'name' ya existe", async () => {
        const { name } = await createCategory({ categoryName: "Ya existo :D" });

        const response = await API.post("/categories").send({ name });

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    test("BAD REQUEST, cuando no hay 'name'", async () => {
        const response = await API.post("/categories").send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("CREATED, cuando 'name' es nuevo", async () => {
        const response = await API.post("/categories").send({
            name: "Soy una nueva categoria",
        });

        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
