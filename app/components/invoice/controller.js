const invoiceService = require("./service");

module.exports = {
    save: async (req, res, next) => {
        try {
            const invoice = req.body;
            const invoiceDB = invoiceService.save(invoice);
            res.status(204);
            res.send(invoiceDB);
        } catch (error) {
            next(error);
        }
    },
    findAll: async (req, res, next) => {
        try {
            const invoicesDB = await invoiceService.findAll();
            res.status(200);
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
};
