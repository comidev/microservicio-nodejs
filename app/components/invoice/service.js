const { HttpError, HttpStatus } = require("../../middleware/handleError");
const invoiceRepo = require("./model");
const customerRepo = require("../customer/model");
const productService = require("../product/service");
const invoiceItemRepo = require("../invoiceItem/model");

module.exports = {
    save: async (invoice) => {
        if (!(await customerRepo.findById(invoice.customerId))) {
            throw HttpError(HttpStatus.NOT_FOUND, `Cliente no encontrado!`);
        }

        const items = invoice.invoiceItems;

        // items.forEach(({ productId, quantity }) => {
        //     productService.updateStock(productId, quantity);
        // });

        for (const item of items) {
            const { productId, quantity } = item;
            await productService.updateStock(productId, quantity);
        }

        // const invoiceItemsDB = items.map((item) => {
        //     const invoiceItemDB = invoiceItemRepo.create({
        //         product: item.productId,
        //         quantity: item.quantity,
        //     });
        //     return invoiceItemDB._id;
        // });

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
        const invoiceDB = await invoiceRepo.findById(id);
        if (!invoiceDB) {
            const message = `La compra con este id no existe :(`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }
        return invoiceDB;
    },
    findByCustomerId: async (id) => {
        const invoicesDB = await invoiceRepo.find({ customer: id });
        if (!invoicesDB) {
            const message = `El cliente no tiene compras :(`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }
        return invoicesDB;
    },
};
