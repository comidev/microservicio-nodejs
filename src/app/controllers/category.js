const categoryService = require("../services/category");

module.exports = {
    save: async (req, res, next) => {
        try {
            const category = req.body;
            const categoryDB = await categoryService.save(category);
            res.status(201);
            res.send(categoryDB);
        } catch (error) {
            next(error);
        }
    },
    findById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const categoryDB = await categoryService.findById(id);
            res.send(categoryDB);
        } catch (error) {
            next(error);
        }
    },
    findAll: async (req, res, next) => {
        try {
            const categoryDB = await categoryService.findAll();
            res.status(categoryDB.length === 0 ? 204 : 200);
            res.send(categoryDB);
        } catch (error) {
            next(error);
        }
    },
};
