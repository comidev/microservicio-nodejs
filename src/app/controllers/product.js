const productService = require("../services/product");

module.exports = {
    save: async (req, res, next) => {
        try {
            const product = req.body;
            const productDB = await productService.save(product);
            res.status(201);
            res.send(productDB);
        } catch (error) {
            next(error);
        }
    },
    findById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const productDB = await productService.findById(id);
            res.send(productDB);
        } catch (error) {
            next(error);
        }
    },
    deleteById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const productDB = await productService.deleteById(id);
            res.send(productDB);
        } catch (error) {
            next(error);
        }
    },
    findAllOrFields: async (req, res, next) => {
        try {
            const { categoryName, name } = req.query;
            const productsDB = await productService.findAllOrFields(categoryName, name);
            res.status(productsDB.length === 0 ? 204 : 200);
            res.send(productsDB);
        } catch (error) {
            next(error);
        }
    },
};
