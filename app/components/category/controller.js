const categoryService = require("./service");

module.exports = {
    save: async (req, res) => {
        const category = req.body;
        const categoryDB = await categoryService.save(category);
        res.send(categoryDB);
    },

    findById: (req, res) => {
        const { id } = req.params;
        const categoryDB = categoryService.findById(id);
        res.send(categoryDB);
    },

    findAll: async (req, res) => {
        const categoryDB = await categoryService.findAll();
        res.send(categoryDB);
    },
};
