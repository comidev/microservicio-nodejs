const customerService = require("../services/customer");

module.exports = {
    save: async (req, res, next) => {
        try {
            const customer = req.body;
            const customerDB = await customerService.save(customer);
            res.status(201);
            res.send(customerDB);
        } catch (error) {
            next(error);
        }
    },
    deleteById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const customerDB = await customerService.deleteById(id);
            res.status(200);
            res.send(customerDB);
        } catch (error) {
            next(error);
        }
    },
    findAll: async (req, res, next) => {
        try {
            const customersDB = await customerService.findAll();
            res.status(customersDB.length === 0 ? 204 : 200);
            res.send(customersDB);
        } catch (error) {
            next(error);
        }
    },
    findById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const customerDB = await customerService.findById(id);
            res.status(200);
            res.send(customerDB);
        } catch (error) {
            next(error);
        }
    },
    saveRegion: async (req, res, next) => {
        try {
            const { name } = req.body;
            const regionDB = await customerService.saveRegion(name);
            res.status(201);
            res.send(regionDB);
        } catch (error) {
            next(error);
        }
    },
};
