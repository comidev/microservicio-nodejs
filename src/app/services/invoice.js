const { HttpError, HttpStatus } = require("../middleware/handleError");
const productService = require("./product");
const invoiceRepo = require("./model/mongodb/invoice");
const customerRepo = require("./model/mongodb/customer");
const invoiceItemRepo = require("./model/mongodb/invoiceItem");

module.exports = {
    save: async (invoice) => {
        if (!(await customerRepo.findById(invoice.customerId))) {
            throw HttpError(HttpStatus.NOT_FOUND, `Cliente no encontrado!`);
        }

        const items = invoice.invoiceItems;
        if (!items || items.length === 0) {
            throw HttpError(
                HttpStatus.BAD_REQUEST,
                `Debe haber al menos una compra (invoice item)`
            );
        }

        for (const item of items) {
            const { productId, quantity } = item;
            await productService.updateStock(productId, quantity);
        }

        const invoiceItemsDB = [];
        for (const item of items) {
            const { productId, quantity } = item;
            const invoiceItemDB = await invoiceItemRepo.create({
                product: productId,
                quantity,
            });
            invoiceItemsDB.push(invoiceItemDB._id);
        }

        return await invoiceRepo.create({
            customer: invoice.customerId,
            description: invoice.description,
            invoiceItems: invoiceItemsDB,
            state: "CREATED",
        });
    },

    findAll: async () => await invoiceRepo.find({}),

    findById: async (id) => {
        let invoiceDB = null;
        try {
            invoiceDB = await invoiceRepo
                .findById(id)
                .populate(["customer", "invoiceItems"]);
        } catch (e) {
            throw HttpError(HttpStatus.NOT_FOUND, e.message);
        }
        if (!invoiceDB) {
            const message = `La compra con este id no existe :(`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }
        return invoiceDB;
    },
    findByCustomerId: async (id) => {
        let invoicesDB = null;
        try {
            invoicesDB = await invoiceRepo
                .find({ customer: id })
                .populate(["customer", "invoiceItems"]);
        } catch (e) {
            throw HttpError(HttpStatus.NOT_FOUND, e.message);
        }
        if (!invoicesDB) {
            const message = `El cliente no tiene compras :(`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }
        return invoicesDB;
    },
};
