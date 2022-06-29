const { HttpError, HttpStatus } = require("../middleware/handleError");
const categoryService = require("../services/category");
const productRepo = require("./model/mongodb/product");

const findById = async (id) => {
    let productDB = null;
    try {
        productDB = await productRepo.findById(id);
    } catch (e) {
        throw HttpError(HttpStatus.NOT_FOUND, e.message);
    }
    if (!productDB) {
        const message = `Producto no encontrado: ${id}`;
        throw HttpError(HttpStatus.NOT_FOUND, message);
    }
    return productDB;
};

module.exports = {
    save: async (product) => {
        const categories = [];

        for (const categoryName of product.categories) {
            const categoryDB = await categoryService.findByName(categoryName);
            categories.push(categoryDB._id);
        }

        const productModel = new productRepo({
            name: product.name,
            photoUrl: product.photoUrl,
            description: product.description,
            stock: product.stock,
            price: product.price,
            status: "CREATED",
            categories,
        });

        const productDB = await productModel.save();
        return productDB;
    },
    deleteById: async (id) => {
        const productDB = await productRepo.findByIdAndDelete(id);
        return productDB;
    },
    findAllOrFields: async (categoryName, name) => {
        let filter = {};
        if (categoryName) {
            const category = await categoryService.findByName(categoryName);
            filter.categories = category;
        }
        if (name) {
            filter.name = [name];
        }
        return await productRepo.find(filter);
    },
    updateStock: async (id, quantity) => {
        const productDB = await findById(id);
        const newQuantity = productDB.stock + quantity;
        await productRepo.findByIdAndUpdate(id, { stock: newQuantity });
    },
    findById,
};
