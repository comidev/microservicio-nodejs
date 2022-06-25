const { HttpError, HttpStatus } = require("../../middleware/handleError");
const CategoryModel = require("./model");

const findByName = async (name) => {
    const categoryDB = await CategoryModel.findOne({ name });
    if (!categoryDB) {
        const message = `El nombre '${name}' no existe!`;
        throw HttpError(HttpStatus.NOT_FOUND, message);
    }
    return categoryDB;
};

module.exports = {
    save: async (category) => {
        await findByName(category.name);
        const categoryModel = new CategoryModel({
            name: category.name,
        });
        return await categoryModel.save();
    },
    findAll: async () => await CategoryModel.find({}),
    findById: async (id) => {
        const categoryDB = await CategoryModel.findById(id);
        if (!categoryDB) {
            const message = `La categoria no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }
        return categoryDB;
    },
    findByName,
};
