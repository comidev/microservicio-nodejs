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

    existsEmail: async (req, res, next) => {
        try {
            const { email } = req.body;
            const exists = await customerService.existsEmail(email);
            res.status(200);
            res.send(exists);
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
    findAllCountries: async (req, res, next) => {
        try {
            const countriesDB = await customerService.findAllCountries();
            res.status(countriesDB.length === 0 ? 204 : 200);
            res.send(countriesDB);
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
    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            const customer = req.body;
            await customerService.update(customer, id);
            res.status(200);
            res.send();
        } catch (error) {
            next(error);
        }
    },
};
