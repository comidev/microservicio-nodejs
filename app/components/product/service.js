const productRepo = require("./model");
const categoryRepo = require("../category/model");

module.exports = {
    save: async (product) => {
        const category = await categoryRepo.findOne({ name: product.categoryName });

        const productModel = new productRepo({
            name: product.name,
            description: product.description,
            stock: product.stock,
            price: product.price,
            status: "CREATED",
            category,
        });

        const productDB = await productModel.save();
        return productDB;
    },
    findById: async (id) => {
        const productDB = await productRepo.findById(id);
        return productDB;
    },
    deleteById: async (id) => {
        const productDB = await productRepo.findByIdAndDelete(id);
        return productDB;
    },
    findAll: async () => {
        const productsDB = await productRepo.find({});
        return productsDB;
    },
    updateStock: async (id, quantity) => {
        const productDB = await productRepo.findByIdAndUpdate(id, {
            quantity: quantity,
        });
        return productDB;
    },
};
