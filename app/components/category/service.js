const CategoryModel = require("./model");

module.exports = {
    save: async (category) => {
        const categoryModel = new CategoryModel({
            name: category.name,
        });
        const categoryDB = await categoryModel.save();
        return categoryDB;
    },
    findAll: async () => {
        const categoriesDB = await CategoryModel.find({});
        return categoriesDB;
    },
    findById: async (id) => {
        const categoryDB = await CategoryModel.findById(id);
        return categoryDB;
    },
    findByName: async (name) => {
        const categoryDB = await CategoryModel.findOne({ name });
        return categoryDB;
    },
};
