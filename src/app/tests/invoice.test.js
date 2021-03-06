const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const {
    createInvoice,
    createCustomer,
    createProduct,
    createInvoiceItem,
    createTokenAdmin,
    createTokenClient,
} = require("./helpers/index");
const invoiceRepo = require("../services/model/mongodb/invoice");
const invoiceItemRepo = require("../services/model/mongodb/invoiceItem");
const API = supertest(app);

beforeEach(async () => {
    await invoiceRepo.deleteMany();
});

describe("GET /invoices", () => {
    test("NO CONTENT, cuando no hay compras", async () => {
        //TODO: Token y rol de acceso :D
        const token = await createTokenAdmin();

        await invoiceRepo.deleteMany();

        const response = await API.get(`/invoices`).set(token).send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos una compra", async () => {
        //TODO: Token y rol de acceso :D
        const token = await createTokenAdmin();

        await createInvoice();

        const response = await API.get(`/invoices`).set(token).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /invoices/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        //TODO: Token y rol de acceso :D
        const token = await createTokenAdmin();

        const response = await API.get(`/invoices/123`).set(token).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el id es correcto", async () => {
        //TODO: Token y rol de acceso :D
        const token = await createTokenAdmin();

        const { _id } = await createInvoice();

        const response = await API.get(`/invoices/${_id}`).set(token).send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /invoices/customer/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        //TODO: Token y rol de acceso :D
        const token = await createTokenClient();

        const response = await API.get(`/invoices/customer/123`).set(token).send();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("NO CONTENT, cuando el id es correcto pero no tiene compras", async () => {
        //TODO: Token y rol de acceso :D
        const token = await createTokenClient();

        const { _id } = await createCustomer();

        const response = await API.get(`/invoices/customer/${_id}`)
            .set(token)
            .send();

        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando el id es correcto y tiene al menos una compra", async () => {
        //TODO: Token y rol de acceso :D
        const token = await createTokenClient();

        const { _id: productId } = await createProduct();
        const { _id: invoiceItemId } = await createInvoiceItem({ productId });
        const { _id: customerId } = await createCustomer();
        await createInvoice({ customerId, invoiceItemsIds: [invoiceItemId] });

        const response = await API.get(`/invoices/customer/${customerId}`)
            .set(token)
            .send();

        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("POST /invoices", () => {
    test("BAD REQUEST, cuando el body es vacio", async () => {
        const response = await API.post(`/invoices`).send({});

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando no hay compras o items en el body", async () => {
        const { _id: customerId } = await createCustomer();
        const invoiceRequest = {
            description: "description",
            customerId,
            invoiceItems: [],
        };

        const response = await API.post(`/invoices`).send(invoiceRequest);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
    test("BAD REQUEST, cuando NO hay cliente en el body", async () => {
        const { _id: productId } = await createProduct();
        const invoiceRequest = {
            description: "description",
            invoiceItems: [
                {
                    productId,
                    quantity: 2,
                },
            ],
        };

        const response = await API.post(`/invoices`).send(invoiceRequest);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("NOT FOUND, cuando el cliente no existe ", async () => {
        //TODO: Token y rol de acceso :D
        const token = await createTokenClient();

        const { _id: productId } = await createProduct();
        const invoiceRequest = {
            description: "description",
            customerId: "no existo :(",
            invoiceItems: [
                {
                    productId,
                    quantity: 2,
                },
            ],
        };

        const response = await API.post(`/invoices`).set(token).send(invoiceRequest);

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("CREATED, cuando el cliente existe y hay al menos una compra en el body", async () => {
        //TODO: Token y rol de acceso :D
        const token = await createTokenClient();

        const [_, { _id: customerId }, { _id: productId }] = await Promise.all([
            invoiceItemRepo.deleteMany(),
            createCustomer(),
            createProduct(),
        ]);
        const invoiceRequest = {
            description: "description",
            customerId,
            invoiceItems: [
                {
                    productId,
                    quantity: 2,
                },
            ],
        };

        const response = await API.post(`/invoices`).set(token).send(invoiceRequest);

        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
