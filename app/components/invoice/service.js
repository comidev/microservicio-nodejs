const invoiceRepo = require("./model");
const customerService = require("../customer/service");
const productService = require("../product/service");
const invoiceItemRepo = require("../invoiceItem/model");

module.exports = {
    save: async (invoice) => {
        if (!customerService.findById(invoice.customerId)) {
            return null;
        }

        const invoiceItems = invoice.invoiceItems;
        const invoiceItemsDB = invoiceItems.map(invoiceItem => {
            const productId = invoiceItem.productId;
            const quantity = invoiceItem.quantity;

            const productDB = productService.updateStock(productId, quantity);
            console.log({ message: "product.service.save.map()", productDB });

            const invoiceItemDB = await invoiceItemRepo.create(invoiceItem);
            return invoiceItemDB._id;
        })

        const invoiceDB = await invoiceRepo.create({
            customer: invoice.customerId,
            description: invoice.description,
            invoiceItems: invoiceItemsDB,
            state: "CREATED",
        });
        return invoiceDB;
    },
    findAll: async () => await invoiceRepo.find({}),
    findById: async (id) => {
        const invoiceDB = await invoiceRepo.findById(id);
        return invoiceDB;
    },
};
