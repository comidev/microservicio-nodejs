const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../app");
const API = supertest(app);

const CategoryModel = require("../components/category/model");

const categoriesMock = [
    {
        name: "Tecnologia",
    },
    {
        name: "Alimentos",
    },
    {
        name: "Comida",
    },
];

beforeEach(async () => {
    await CategoryModel.deleteMany();

    categoriesMock.forEach(async (categoryMock) => {
        await CategoryModel.create(categoryMock);
    });
});

describe("categorias", () => {
    test("es devuelto en JSON", async () => {
        await API.post("/categories")
            .send({ name: "Omar" })
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("la longitud es correcta", async () => {
        const response = await API.get("/categories");

        expect(response.body).toHaveLength(categoriesMock.length);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
