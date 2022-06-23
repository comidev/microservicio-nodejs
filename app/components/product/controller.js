const ProductService = require("./service");

module.exports = {
    save: (req, res) => {
        const product = req.body;
        console.log({ product });
        const productDB = ProductService.save(product);
        res.status(204);
        res.send(productDB);
    },
    findById: (req, res) => {
        const { id } = req.params;
        const productDB = ProductService.findById(id);
        res.send(productDB);
    },
    deleteById: (req, res) => {
        const { id } = req.params;
        const productDB = ProductService.deleteById(id);
        res.send(productDB);
    },
    findAll: async (req, res) => {
        const productsDB = await ProductService.findAll();
        res.send(productsDB);
    },
};
