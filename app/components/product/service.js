const ProductModel = require("./model");
const CategoryModel = require("../category/model");

module.exports = {
    save: async (product) => {
        const category = await CategoryModel.findOne({ name: product.categoryName });

        const productModel = new ProductModel({
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
        const productDB = await ProductModel.findById(id);
        return productDB;
    },
    deleteById: async (id) => {
        const productDB = await ProductModel.findByIdAndDelete(id);
        return productDB;
    },
    findAll: async () => {
        const productsDB = await ProductModel.find({});
        return productsDB;
    },
};
