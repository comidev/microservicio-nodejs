const categoryService = require("./service");

module.exports = {
    save: async (req, res, next) => {
        try {
            const category = req.body;
            const categoryDB = await categoryService.save(category);
            res.send(categoryDB);
        } catch (error) {
            next(error);
        }
    },
    findById: (req, res, next) => {
        try {
            const { id } = req.params;
            const categoryDB = categoryService.findById(id);
            res.send(categoryDB);
        } catch (error) {
            next(error);
        }
    },
    findAll: async (req, res, next) => {
        try {
            const categoryDB = await categoryService.findAll();
            res.send(categoryDB);
        } catch (error) {
            next(error);
        }
    },
};
