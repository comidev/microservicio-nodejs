const supertest = require("supertest");
const mongoose = require("mongoose");
const shortUUID = require("short-uuid");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const {
    initInvoices,
    createCustomer,
    createInvoice,
    createProduct,
} = require("./helpers/index");

const invoiceRepo = require("../services/model/mongodb/invoice");
const API = supertest(app);

const generateId = () => mongoose.Types.ObjectId();

let invoicesIds = [];
beforeEach(async () => {
    await invoiceRepo.deleteMany();
    invoicesIds = await initInvoices();
});

describe("GET /invoices", () => {
    test("NO CONTENT, cuando no hay compras", async () => {
        await invoiceRepo.deleteMany();
        const response = await API.get(`/invoices`).send();
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando hay al menos una compra", async () => {
        const response = await API.get(`/invoices`).send();
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /invoices/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        const response = await API.get(`/invoices/123`).send();
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("OK, cuando el id es correcto", async () => {
        const id = invoicesIds[0];
        const response = await API.get(`/invoices/${id}`).send();
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("GET /invoices/customer/:id", () => {
    test("NOT FOUND, cuando el id es incorrecto", async () => {
        const response = await API.get(`/invoices/customer/123`).send();
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("NO CONTENT, cuando el id es correcto pero no tiene compras", async () => {
        const customerIdFeik = generateId();
        const response = await API.get(
            `/invoices/customer/${customerIdFeik}`
        ).send();
        expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    test("OK, cuando el id es correcto y tiene al menos una compra", async () => {
        const customerIdFeik = generateId();
        const { _id: id } = await createInvoice({ _id: customerIdFeik });
        const response = await API.get(
            `/invoices/customer/${customerIdFeik}`
        ).send();
        expect(response.status).toBe(HttpStatus.OK);
    });
});

describe("POST /invoices", () => {
    test("BAD REQUEST, cuando el body es vacio", async () => {
        const response = await API.post(`/invoices`).send({});
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("BAD REQUEST, cuando no hay compras o items en el body", async () => {
        const customerIdFeik = generateId();
        const invoiceRequest = {
            description: "description",
            customerId: customerIdFeik,
            invoiceItems: [],
        };
        const response = await API.post(`/invoices`).send(invoiceRequest);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
    test("BAD REQUEST, cuando NO hay cliente en el body", async () => {
        const invoiceRequest = {
            description: "description",
            invoiceItems: [
                {
                    productId: "62b635f44fcd649e90e1934b",
                    quantity: 2,
                },
            ],
        };
        const response = await API.post(`/invoices`).send(invoiceRequest);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    test("NOT FOUND, cuando el cliente no existe ", async () => {
        const invoiceRequest = {
            description: "description",
            customerId: "no existo :(",
            invoiceItems: [
                {
                    productId: "62b635f44fcd649e90e1934b",
                    quantity: 2,
                },
            ],
        };
        const response = await API.post(`/invoices`).send(invoiceRequest);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    test("CREATED, cuando el cliente existe y hay al menos una compra en el body", async () => {
        const customerIdFeik = await createCustomer();
        const productIdFeik = await createProduct();
        const invoiceRequest = {
            description: "description",
            customerId: customerIdFeik._id,
            invoiceItems: [
                {
                    productId: productIdFeik._id,
                    quantity: 2,
                },
            ],
        };
        const response = await API.post(`/invoices`).send(invoiceRequest);
        expect(response.status).toBe(HttpStatus.CREATED);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
