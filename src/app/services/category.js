const { HttpError, HttpStatus } = require("../middleware/handleError");
const categoryRepo = require("./model/mongodb/category");
const CATEGORIES = require("../utils/categories");

const findByName = async (name) => {
    const categoryDB = await categoryRepo.findOne({ name });
    if (!categoryDB) {
        const message = `El nombre '${name}' no existe!`;
        throw HttpError(HttpStatus.NOT_FOUND, message);
    }
    return categoryDB;
};

const existsByName = async (name) => {
    const exists = Boolean(await categoryRepo.findOne({ name }));
    return exists;
};

const initCategories = async () => {
    const exists = await categoryRepo.findOne({ name: "Tecnologia" });
    if (!Boolean(exists)) {
        // ! OPCIÓN 1:
        // for (const country of COUNTRIES) {
        //     await countryRepo.create(country);
        // }

        // ! OPCIÓN 2:
        const createPromisesArray = CATEGORIES.map((item) =>
            categoryRepo.create(item)
        );
        await Promise.all(createPromisesArray);
    }
};

module.exports = {
    save: async (category) => {
        const { name } = category;
        if (await existsByName(name)) {
            const message = `El nombre '${name}' ya existe!`;
            throw HttpError(HttpStatus.CONFLICT, message);
        }
        const categoryModel = new categoryRepo({ name });
        return await categoryModel.save();
    },
    findAll: async () => await categoryRepo.find({}),
    findById: async (id) => {
        let categoryDB = null;
        try {
            categoryDB = await categoryRepo.findById(id);
        } catch (e) {
            const message = `La categoria no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }
        if (!categoryDB) {
            const message = `La categoria no existe!`;
            throw HttpError(HttpStatus.NOT_FOUND, message);
        }
        return categoryDB;
    },
    findByName,
    initCategories,
};
