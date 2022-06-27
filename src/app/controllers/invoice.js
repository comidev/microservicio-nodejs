const invoiceService = require("../services/invoice");

module.exports = {
    save: async (req, res, next) => {
        try {
            const invoice = req.body;
            const invoiceDB = await invoiceService.save(invoice);
            res.status(201);
            res.send(invoiceDB);
        } catch (error) {
            next(error);
        }
    },
    findAll: async (req, res, next) => {
        try {
            const invoicesDB = await invoiceService.findAll();
            res.status(invoicesDB.length === 0 ? 204 : 200);
            res.send(invoicesDB);
        } catch (error) {
            next(error);
        }
    },
    findById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const invoiceDB = await invoiceService.findById(id);
            res.status(200);
            res.send(invoiceDB);
        } catch (error) {
            next(error);
        }
    },
    findByCustomerId: async (req, res, next) => {
        try {
            const { id } = req.params;
            const invoicesDB = await invoiceService.findByCustomerId(id);
            res.status(invoicesDB.length === 0 ? 204 : 200);
            res.send(invoicesDB);
        } catch (error) {
            next(error);
        }
    },
};
