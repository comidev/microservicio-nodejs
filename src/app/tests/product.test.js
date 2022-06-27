const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const { createProduct, createCategory } = require("./helpers/index");

const productRepo = require("../services/model/mongodb/product");
const API = supertest(app);

const generateId = () => mongoose.Types.ObjectId();

beforeEach(async () => {
    await productRepo.deleteMany();
});

describe("GET /products", () => {
    test("NO CONTENT, cuando no hay productos", async () => {
        const response = await API.get(`/products`).send();
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos un producto", async () => {
        await createProduct();
        const response = await API.get(`/products`).send();
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /products/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        const response = await API.get(`/products/123`).send();
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el id es correcto", async () => {
        const { _id: id } = await createProduct();
        const response = await API.get(`/products/${id}`).send();
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("POST /products", () => {
    test("BAD REQUEST, cuando el body es vacio", async () => {
        const response = await API.post(`/products`).send({});
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando hay campos vacios en el body", async () => {
        const productRequest = {
            name: "Producto n-esimo",
            description: "Producto productero",
            price: 150.5,
        };
        const response = await API.post(`/products`).send(productRequest);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
    test("BAD REQUEST, cuando NO hay categoria en el body", async () => {
        const productRequest = {
            name: "Producto n-esimo",
            description: "Producto productero",
            stock: 100,
            price: 150.5,
        };
        const response = await API.post(`/products`).send(productRequest);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("NOT FOUND, cuando la categoria no existe ", async () => {
        const productRequest = {
            name: "Producto n-esimo",
            description: "Producto productero",
            stock: 100,
            price: 150.5,
            categoryName: "no existo :(",
        };
        const response = await API.post(`/products`).send(productRequest);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("CREATED, cuando los campos no son vacios y la categoria existe", async () => {
        const categoryFeik = await createCategory();
        const productRequest = {
            name: "Producto n-esimo",
            description: "Producto productero",
            stock: 100,
            price: 150.5,
            categoryName: categoryFeik.name,
        };
        const response = await API.post(`/products`).send(productRequest);
        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
