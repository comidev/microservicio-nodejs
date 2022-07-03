const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const {
    createProduct,
    createCategory,
    createTokenAdmin,
} = require("./helpers/index");
const productRepo = require("../services/model/mongodb/product");
const API = supertest(app);

beforeEach(async () => {
    await productRepo.deleteMany();
});

describe("GET /products?categoryName=...&name=...", () => {
    test("NO CONTENT, cuando no hay productos", async () => {
        await productRepo.deleteMany();

        const response = await API.get(`/products`).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos un producto", async () => {
        await createProduct();

        const response = await API.get(`/products`).send();

        expect(response.status).toBe(HttpStatus.OK);
    });

    test("NOT FOUND, el nombre de categoria no existe", async () => {
        const response = await API.get(`/products?categoryName=No existo uu`).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    // TODO: ?categoryName
    test("NO CONTENT, cuando la categoria no tiene productos", async () => {
        const { name: catengoryName } = await createCategory();

        const response = await API.get(
            `/products?categoryName=${catengoryName}`
        ).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando la categoria tiene al menos un producto", async () => {
        const { _id: categoryId, name: categoryName } = await createCategory();
        await createProduct({ categoriesId: [categoryId] });

        const response = await API.get(
            `/products?categoryName=${categoryName}`
        ).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
    // TODO: ?name
    test("NO CONTENT, cuando el producto no existe", async () => {
        const response = await API.get(`/products?name=${"noexistooo"}`).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando el nombre matchea con al menos un producto", async () => {
        const { name } = await createProduct();

        const response = await API.get(`/products?name=${name}`).send();

        expect(response.status).toBe(HttpStatus.OK);
    });

    // TODO: ?categoryName=...&name=...
    test("OK, cuando al menos hay un producto que tiene esa categoría", async () => {
        const { _id: categoryId, name: categoryName } = await createCategory();
        const { name: productName } = await createProduct({
            categoriesId: [categoryId],
        });

        const response = await API.get(
            `/products?categoryName=${categoryName}&name=${productName}`
        ).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /products/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        const response = await API.get(`/products/123`).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el id es correcto", async () => {
        const { _id } = await createProduct();

        const response = await API.get(`/products/${_id}`).send();

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
    test("BAD REQUEST, cuando NO hay categorias en el body", async () => {
        const productRequest = {
            name: "Producto n-esimo",
            description: "Producto productero",
            stock: 100,
            price: 150.5,
        };

        const response = await API.post(`/products`).send(productRequest);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("NOT FOUND, cuando al menos una categoria no existe ", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenAdmin();

        const productRequest = {
            name: "Producto n-esimo",
            description: "Producto productero",
            photoUrl: "xd",
            stock: 100,
            price: 150.5,
            categories: ["no existo :(", "yo tampoco u-u"],
        };

        const response = await API.post(`/products`).set(token).send(productRequest);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("CREATED, cuando los campos no son vacios y las categorias existen", async () => {
        //TODO: Token y Rol de acceso :D
        const token = await createTokenAdmin();

        const { name: categoryName1 } = await createCategory();
        const { name: categoryName2 } = await createCategory();
        const productRequest = {
            name: "Producto n-esimo",
            description: "Producto productero",
            photoUrl: "xd",
            stock: 100,
            price: 150.5,
            categories: [categoryName1, categoryName2],
        };

        const response = await API.post(`/products`).set(token).send(productRequest);

        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
