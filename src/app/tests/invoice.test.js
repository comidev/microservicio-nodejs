const supertest = require("supertest");
const mongoose = require("mongoose");
const shortUUID = require("short-uuid");
const { app, server } = require("../../../app");
const { HttpStatus } = require("../middleware/handleError");
const { initInvoices } = require("./helpers/index");

const invoiceRepo = require("../services/model/mongodb/invoice");
const API = supertest(app);

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

afterAll(() => {
    mongoose.connection.close();
    server.close();
});
