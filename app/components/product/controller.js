const productService = require("./service");

module.exports = {
    save: async (req, res, next) => {
        try {
            const product = req.body;
            const productDB = await productService.save(product);
            res.status(204);
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
    findAll: async (req, res, next) => {
        try {
            const productsDB = await productService.findAll();
            res.send(productsDB);
        } catch (error) {
            next(error);
        }
    },
};
