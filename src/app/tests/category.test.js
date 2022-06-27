const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const categoryRepo = require("../services/model/mongodb/category");
const API = supertest(app);

const categoriesFeik = [
    { name: "Alimentos" },
    { name: "Adultos" },
    { name: "Tecnologia" },
];

let categoriesDB = [];

beforeEach(async () => {
    await categoryRepo.deleteMany({});
    categoriesDB = [];
    for (const categoryFeik of categoriesFeik) {
        const { _id: id, name } = await categoryRepo.create(categoryFeik);
        categoriesDB.push({ id: id.toJSON(), name });
    }
});

describe("GET /categories/:id", () => {
    test("NOT FOUND, id incorrecto", async () => {
        const response = await API.get("/categories/123").send();
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, id correcto devuelve el objeto buscado", async () => {
        const id = categoriesDB[0].id;
        const response = await API.get(`/categories/${id}`).send();
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.name).toBe(categoriesDB[0].name);
    });
});

describe("GET /categories", () => {
    test("NO CONTENT, devuelve 'no content' cuando no hay contenido", async () => {
        await categoryRepo.deleteMany({});
        const response = await API.get("/categories").send();
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay contenido", async () => {
        const response = await API.get("/categories").send();
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("POST /categories", () => {
    test("CONFLICT, cuando el 'name' ya existe", async () => {
        const name = "Ya existo";
        await categoryRepo.create({ name });
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
