const { HttpError, HttpStatus } = require("../middleware/handleError");
const categoryService = require("../services/category");
const productRepo = require("./model/mongodb/product");

const findById = async (id) => {
    const productDB = await productRepo.findById(id);
    if (!productDB) {
        const message = `Producto no encontrado: ${id}`;
        throw HttpError(HttpStatus.NOT_FOUND, message);
    }
    return productDB;
};

module.exports = {
    save: async (product) => {
        const category = await categoryService.findByName(product.categoryName);

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
    deleteById: async (id) => {
        const productDB = await productRepo.findByIdAndDelete(id);
        return productDB;
    },
    findAll: async () => {
        const productsDB = await productRepo
            .find({})
            .populate("category", { _id: 0, name: 1 });
        return productsDB;
    },
    updateStock: async (id, quantity) => {
        const productDB = await findById(id);
        const newQuantity = productDB.stock - quantity;
        if (newQuantity < 0) {
            const message = `Stock menor a cero: ${id} | ${quantity} !`;
            throw HttpError(HttpStatus.NOT_ACCEPTABLE, message);
        }
        await productRepo.findByIdAndUpdate(id, { stock: newQuantity });
    },
    findById,
};
